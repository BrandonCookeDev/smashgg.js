import request from 'request-promise'
import { GraphQLClient } from 'graphql-request'
import {EventEmitter} from 'events'

import log from './Logger'
import * as Common from './Common'
import SRQ from './StaggeredRequestQueue'
import GQLClient from './GQLClient'
import QueryQueue from './QueryQueue'
import TokenHandler from './TokenHandler'
import {merge, mergeQuery} from './Common'

//import {ITournament, IEvent, IPhase, IPhaseGroup, IPlayer, IGGSet} from '../internal'

const RATE_LIMIT_MS_TIME = process.env.RateLimitMsTime || 1000
const TOTAL_PAGES_REGEX_JSON = new RegExp(/"pageInfo":[\s]?{[\n\s]*?"totalPages": ([0-9]*)/);
const TOTAL_PAGES_REGEX_STRING = new RegExp(/"pageInfo":{"totalPages":([0-9]*)}/);
const MAX_COMPLEXITY = 1000

import Variables = INetworkInterface.Variables

export default class NetworkInterface{

	static client: GraphQLClient
	static initialized: boolean = false
	static isClientDelinquent: boolean = false
	static queryCount: number = 0
	static delinquencyTimer: any
	static delinquencyQueue: any[]
	static delinquencyPaginatedQueue: any[]

	static init(){
		if(!NetworkInterface.initialized){
			NetworkInterface.client = GQLClient.getInstance()
			NetworkInterface.initialized = true
		}
	}
	
	/**
	 * query
	 * 
	 * takes a graphql query string and corresponding variable object
	 * if the client has not exceeded the threshold of 80 requests per 60 
	 * seconds, it is considered Not Delinquent. 
	 * otherwise, a Delinquent client will be halted from executing their 
	 * queries. In this case, the query is wrapped in a function returning
	 * a promise to be fired after the 60 second time limit is up
	 * 
	 * Useful for when many queries need to be run consecutively
	 * 
	 * @param  {string} query
	 * @param  {object} variables 
	 * @returns {promise} resolving the results of the query after being staggered in the request queue
	 */
	static query(query: string, variables: Variables) : Promise<any>{
		return new Promise(function(resolve, reject){
			log.queries("Query: " + query + ":\n" + variables);
			QueryQueue.getInstance().add(() => {
				return NetworkInterface.client.request(query, variables)
						.then(resolve)
						.catch(reject)
			})
		})
	}

	static rawQuery(query: string, variables: Variables) : Promise<any>{
		log.queries("Raw Query: " + query + ":\n" + variables);
		return new Promise(function(resolve, reject){
			QueryQueue.getInstance().add(() => {
				return NetworkInterface.client.rawRequest(query, variables)
					.then(resolve)
					.catch(reject)
			})
		})
	}

	static staggeredQuery(query: string, variables: Variables) : Promise<any>{
		return new Promise(function(resolve, reject){ 
			SRQ.getInstance().add(() => {
				return NetworkInterface.client.request(query, variables)
					.then(resolve)
					.catch(reject)
			})
		})
	}

	static clusterQuery(keys: any[], fcn: string, options: any) : Promise<any[]>{
		return Promise.all(keys.map(key => {
			if(!key.hasOwnProperty(fcn) && !key.__proto__.hasOwnProperty(fcn))
				throw new Error(`${fcn} is not a function in type ${typeof key}`)
			return key[fcn](options)
		}))
	}

	static async singleQuery(query: string, variables: Variables) : Promise<any>{
		await Common.sleep(+RATE_LIMIT_MS_TIME)
		return await NetworkInterface.client.request(query, variables)
	}

	static async paginatedQuery(operationName: string, queryString: string, params: object, options?: IPaginatedQuery.Options, additionalParams?: {}, complexitySubtraction: number = 0) : Promise<any[]>{
		log.info('%s: Calling Paginated Querys', operationName);
		log.queries("Paginated Query: " + queryString + ":\n" + params);

		let results = [];

		// parse options
		let page = options != undefined && options.page ? options.page : 1
		let perPage = options != undefined && options.perPage ? options.perPage : null
		let filters = options != undefined && options.filters  ? options.filters : null

		// preflight query
		// first paginated query should get the total page count w/ data
		// also initial query will be used to determine optimal stats
		let queryOptions: IPaginatedQuery.Options = {
			page: page,
			perPage: perPage,
			filters: filters,
			pageInfo: 'pageInfo{\ntotalPages\n}'
		}
		queryOptions = Object.assign(queryOptions, additionalParams)
		let preflightQuery = mergeQuery(queryString, queryOptions)
		let preflightData = [await NetworkInterface.rawQuery(preflightQuery, params)] as any[];
		if(preflightData.length <= 0)
			throw new Error(`${operationName}: No data returned from query for operation`)

		let totalPages = NetworkInterface.parseTotalPages(operationName, preflightData)
		let onePageComplexity = preflightData[0].extensions.queryComplexity - complexitySubtraction
		log.info('Total Pages using 1 perPage: %s, Object Complexity per Page: %s', totalPages, onePageComplexity)
		perPage = NetworkInterface.calculateOptimalPerPagecount(onePageComplexity, totalPages)


		// get total page count and verify we are getting things back from the api
		//let complexity = NetworkInterface.determineComplexity(data[0]) - complexitySubtraction //Object.keys(data[0]).length
		//log.info('Total Pages using 1 perPage: %s, Object Complexity per Page: %s', totalPages, complexity)

		// check to see if the implementer is forcing perPage
		// if they are not, calculate the optimal perPage count, 
		// requery for new pageCount, and continue
		let query, data;
		/*
		let isForcingPerPage = perPage > 1 && options != undefined && options.perPage != undefined // TODO this logic is probably superficial
		if(!isForcingPerPage){
			log.info('Optimal Per Page Count: %s', perPage)
			queryOptions = {
				page: page,
				perPage: perPage,
				filters: filters,
				pageInfo: 'pageInfo{\ntotalPages\n}'
			}
			//queryOptions = Object.assign(queryOptions, additionalParams)
			query = mergeQuery(queryString, queryOptions)
			let optimizedData = await NetworkInterface.query(query, params)
			data = data.concat([optimizedData])
			totalPages = NetworkInterface.parseTotalPages(operationName, optimizedData)
			log.info('Optimal Page Count: %s', totalPages)
		}
		else
			log.warn('Implementer has chosen to force perPage at %s per page', perPage)
		*/
			
		// after, leave off the total page count to minimize complexity
		for(let i = 1; i<=totalPages; i++){
			log.info('%s: Collected %s/%s pages', operationName, i, totalPages)
			queryOptions = Object.assign({
				page: i,
				perPage: perPage,
				filters: filters,
				pageInfo: ''
			}, additionalParams);
			query = mergeQuery(queryString, queryOptions)
			results.push(await NetworkInterface.query(query, params))
		}

		return results;
	}

	static parseTotalPages(operationName: string, results: any) : number{
		let parsed = TOTAL_PAGES_REGEX_STRING.exec(JSON.stringify(results))
		if(!parsed) 
			throw new Error(`${operationName}: Something wrong with paginated query. Did not match regex ${TOTAL_PAGES_REGEX_STRING.toString()}`)
		return +parsed[1]
	}

	static calculateOptimalPerPagecount(objectComplexity: number, totalPages: number) : number{
		let totalComplexity = objectComplexity * totalPages
		
		return MAX_COMPLEXITY / objectComplexity;
		/*
		log.verbose('Calculating Optimal Pagecount: Complexity [%s], Total Pages [%s], Total Complexity [%s]', 
			objectComplexity, totalPages, totalComplexity
		)
		
		if(totalComplexity < MAX_COMPLEXITY)
			return 1
			//return Math.ceil(MAX_COMPLEXITY / objectComplexity / totalPages)
		else
			return Math.ceil(MAX_COMPLEXITY / objectComplexity / totalPages)
			//return Math.floor((objectComplexity * totalPages) / MAX_COMPLEXITY)
		*/
	}

	static determineComplexity(objects: any[]) : number{
		let complexity = 0;
		let nextArgs = []
		for(let i in objects){
			// add 1 for each object passed into the function arg array
			complexity++

			let cur = objects[i]
			for(let key in cur) {
				if(key === 'pageInfo') continue;
				else if(typeof cur[key] === 'object' && cur[key] != null){
					// if array, calculate the first object then multiple by how many perPage
					// otherwise add object to nextArgs and dig
					if(Array.isArray(cur[key])){
						complexity *= cur[key].length
						nextArgs.push(cur[key][0])
					}
					else{
						nextArgs.push(cur[key])
					}
				}
			}
		}
		if(nextArgs.length === 0) return complexity
		else return complexity + NetworkInterface.determineComplexity(nextArgs)
	}
}

namespace INetworkInterface{
	export interface NetworkInterface{

	}

	export interface Variables{

	}
}

namespace IPaginatedQuery{
	export interface Options{
		page?: number | null,
		perPage?: number | null,
		pageInfo?: PageInfoData | string,
		[x: string]: any
	}

	export interface PageInfoData{
		pageInfo: {
			totalPages: number
		} 
	}

	export interface Filters{
		[x: string]: {
			[x: string]: string
		}
	}
}

module.exports = NetworkInterface