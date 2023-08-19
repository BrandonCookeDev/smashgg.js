import { GraphQLClient, Variables } from 'graphql-request'

import {
	IPaginatedQueryOptions
} from '../interfaces/IPaginatedQuery'

import log from './Logger'
import * as Common from './Common'
import SRQ from './StaggeredRequestQueue'
import GQLClient from './GQLClient'
import QueryQueue from './QueryQueue'
import {mergeQuery} from './Common'

// import {ITournament, IEvent, IPhase, IPhaseGroup, IPlayer, IGGSet} from '../internal'

const RATE_LIMIT_MS_TIME = process.env.RateLimitMsTime ?? 1000
const TOTAL_PAGES_REGEX_JSON = new RegExp(/"pageInfo":\s?{[\n\s]*?"totalPages": (\d*)/)
const TOTAL_PAGES_REGEX_STRING = new RegExp(/"pageInfo":{"totalPages":(\d*)}/)
const MAX_COMPLEXITY = 1000

export default class NetworkInterface{

	public static client: GraphQLClient
	public static initialized: boolean = false
	public static isClientDelinquent: boolean = false
	public static queryCount: number = 0
	public static delinquencyTimer: any
	public static delinquencyQueue: any[]
	public static delinquencyPaginatedQueue: any[]

	public static init(){
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
	public static query(query: string, variables: Variables): Promise<any>{
		return new Promise((resolve, reject) => {
			log.queries('Query: ' + JSON.stringify(query) + ':\n' + JSON.stringify(variables))
			QueryQueue.getInstance().add(() => {
				return NetworkInterface.client.request(query, variables)
						.then(resolve)
						.catch(reject)
			})
		})
	}

	public static rawQuery(query: string, variables: Variables): Promise<any>{
		return new Promise((resolve, reject) => {
			log.queries('Raw Query: ' + JSON.stringify(query) + ':\n' + JSON.stringify(variables))
			QueryQueue.getInstance().add(() => {
				return NetworkInterface.client.rawRequest(query, variables)
					.then(resolve)
					.catch(reject)
			})
		})
	}

	public static staggeredQuery(query: string, variables: Variables): Promise<any>{
		return new Promise((resolve, reject) => { 
			SRQ.getInstance().add(() => {
				return NetworkInterface.client.request(query, variables)
					.then(resolve)
					.catch(reject)
			})
		})
	}

	public static clusterQuery(keys: any[], fcn: string, options: any): Promise<any[]>{
		return Promise.all(keys.map(key => {
			if(!key.hasOwnProperty(fcn) && !Object.getPrototypeOf(key).hasOwnProperty(fcn))
				throw new Error(`${fcn} is not a function in type ${typeof key}`)
			return key[fcn](options)
		}))
	}

	public static async singleQuery(query: string, variables: Variables): Promise<any>{
		await Common.sleep(+RATE_LIMIT_MS_TIME)
		return await NetworkInterface.client.request(query, variables)
	}

	public static async paginatedQuery(
		operationName: string, 
		queryString: string, params: object, 
		options?: IPaginatedQueryOptions, 
		additionalParams?: {}, 
		complexitySubtraction: number = 0
	): Promise<any[]>{

		log.info('%s: Calling Paginated Querys', operationName)
		log.queries('Paginated Query: ' + JSON.stringify(queryString) + ':\n' + JSON.stringify(params))

		const results = []

		// parse options
		const isSinglePage = options?.page
		const curPage = options?.page ? options.page : 1
		const curFilters = options?.filters  ? options.filters : null
		let curPerPage = options?.perPage ? options.perPage : null

		// preflight query
		// first paginated query should get the total page count w/ data
		// also initial query will be used to determine optimal stats
		let queryOptions: IPaginatedQueryOptions = {
			page: curPage,
			perPage: curPerPage,
			filters: curFilters,
			pageInfo: 'pageInfo{\ntotalPages\n}'
		}
		queryOptions = Object.assign(queryOptions, additionalParams)

		// if the option for a single page is requested, return a standard query. dont paginate
		if(isSinglePage){
			params = Object.assign(params, queryOptions)
			const singlePageQuery = mergeQuery(queryString, queryOptions)
			return [await NetworkInterface.query(singlePageQuery, params as Variables)]
		}

		// otherwise, calculate the most optimal pagination count
		const preflightQuery = mergeQuery(queryString, queryOptions)
		const preflightData = [await NetworkInterface.rawQuery(preflightQuery, params as Variables)] as any[]
		if(preflightData.length <= 0)
			throw new Error(`${operationName}: No data returned from query for operation`)

		const totalPages = NetworkInterface.parseTotalPages(operationName, preflightData)
		const onePageComplexity = preflightData[0].extensions.queryComplexity - complexitySubtraction
		log.info('Total Pages using 1 perPage: %s, Object Complexity per Page: %s', totalPages, onePageComplexity)
		//curPerPage = NetworkInterface.calculateOptimalPerPagecount(onePageComplexity, totalPages)
			
		// after, leave off the total page count to minimize complexity
		
		let query
		for(let i = 1; i<=totalPages; i++){
			log.info('%s: Collected %s/%s pages', operationName, i, totalPages)
			queryOptions = Object.assign({
				page: i,
				// TODO fix perPage
				// perPage: perPage.toFixed(0),
				filters: curFilters,
				pageInfo: ''
			}, additionalParams, params)
			query = mergeQuery(queryString, queryOptions)
			results.push(await NetworkInterface.query(query, queryOptions))
		}

		return results
	}

	public static parseTotalPages(operationName: string, results: any): number{
		const parsed = TOTAL_PAGES_REGEX_STRING.exec(JSON.stringify(results))
		if(!parsed) 
			throw new Error(
				`${operationName}: Something wrong with paginated query. Did not match regex ${TOTAL_PAGES_REGEX_STRING.toString()}`
			)
		return +parsed[1]
	}

	public static calculateOptimalPerPagecount(objectComplexity: number, totalPages: number): number{
		//const totalComplexity = objectComplexity * totalPages
		
		return MAX_COMPLEXITY / objectComplexity
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

	public static determineComplexity(objects: any[]): number{
		let complexity = 0
		
		const nextArgs = []
		for(const i in objects){
		    if(!i){
		        continue
		    }
			// add 1 for each object passed into the function arg array
			complexity++

			const cur = objects[i]
			let curKeyVal;
			for(const key in cur) {
				if(key === 'pageInfo' || cur[key] == null) continue
				else if(typeof cur[key] === 'object'){
				    curKeyVal = cur[key];
					// if array, calculate the first object then multiple by how many perPage
					// otherwise add object to nextArgs and dig
					if(Array.isArray(cur[key])){
						complexity *= cur[key].length
						curKeyVal = cur[key][0]
					}
					nextArgs.push(curKeyVal)
				}
			}
		}

		return nextArgs.length === 0 ? complexity : complexity + NetworkInterface.determineComplexity(nextArgs)
	}
}
