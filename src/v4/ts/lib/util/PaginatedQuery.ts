import log from './Logger'
import NI from './NetworkInterface'
import * as Common from './Common'
import {format} from 'util'
import {merge, mergeQuery} from './Common'

const TOTAL_PAGES_REGEX_JSON = new RegExp(/"pageInfo":[\s]?{[\n\s]*?"totalPages": ([0-9]*)/);
const TOTAL_PAGES_REGEX_STRING = new RegExp(/"pageInfo":{"totalPages":([0-9]*)}/);
const MAX_COMPLEXITY = 1000

//{ b: 1,
//c: 2,
//d: { d: 3, s: 1, e: 1, f: { o: 0 } },
//g: { d: 3, g: 32, e: 1 } }

export default class PaginatedQuery{

	static async query(operationName: string, queryString: string, params: object, options?: IPaginatedQuery.Options, additionalParams?: {}) : Promise<any>{
		log.info('%s: Calling Paginated Querys', operationName);

		let page = options != undefined && options.page ? options.page : 1
		let perPage = options != undefined && options.perPage ? options.perPage : 1
		let filters = options != undefined && options.filters  ? options.filters : null

		// first paginated query should get the total page count w/ data
		// also initial query will be used to determine optimal stats
		let queryOptions: IPaginatedQuery.Options = {
			page: page,
			perPage: perPage,
			filters: filters,
			pageInfo: 'pageInfo{\ntotalPages\n}'
		}
		queryOptions = Object.assign(queryOptions, additionalParams)
		let query = mergeQuery(queryString, queryOptions)
		let data = [await NI.query(query, params)];
		if(data.length <= 0)
			throw new Error(`${operationName}: No data returned from query for operation`)

		// get total page count and verify we are getting things back from the api
		let totalPages = PaginatedQuery.parseTotalPages(operationName, data)

		// check to see if the implementer is forcing perPage
		// if they are not, calculate the optimal perPage count, 
		// requery for new pageCount, and continue
		let isForcingPerPage = perPage > 1 && options != undefined && options.perPage != undefined // TODO this logic is probably superficial

		if(!isForcingPerPage){
			let complexity = PaginatedQuery.determineComplexity(data[0]) //Object.keys(data[0]).length
			perPage = PaginatedQuery.calculateOptimalPagecount(complexity, totalPages)
			log.info('Total Pages using 1 perPage: %s, Object Complexity per Page: %s', totalPages, complexity)

			queryOptions = {
				page: page++,
				perPage: perPage,
				filters: filters,
				pageInfo: 'pageInfo{\ntotalPages\n}'
			}
			query = mergeQuery(queryString, queryOptions)
			let optimizedData = await NI.query(query, queryOptions)
			data = data.concat([optimizedData])
			totalPages = PaginatedQuery.parseTotalPages(operationName, optimizedData)
		}
		else
			log.warn('Implementer has chosen to force perPage at %s per page', perPage)
			
			
		// after, leave off the total page count to minimize complexity
		for(let i = page; i<=totalPages; i++){
			log.info('%s: Collected %s/%s pages', operationName, i, totalPages)
			queryOptions = Object.assign({
				page: page + i,
				perPage: perPage,
				filters: filters,
				pageInfo: ''
			}, additionalParams);
			query = mergeQuery(queryString, queryOptions)
			data.push(await NI.query(query, params))
		}

		return data
	}

	static parseTotalPages(operationName: string, results: any) : number{
		let parsed = TOTAL_PAGES_REGEX_STRING.exec(JSON.stringify(results))
		if(!parsed) 
			throw new Error(`${operationName}: Something wrong with paginated query. Did not match regex ${TOTAL_PAGES_REGEX_STRING.toString()}`)
		return +parsed[1]
	}

	static calculateOptimalPagecount(objectComplexity: number, totalPages: number) : number{
		return Math.ceil(MAX_COMPLEXITY / objectComplexity / totalPages)
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
		else return complexity + PaginatedQuery.determineComplexity(nextArgs)
	}
}



namespace IPaginatedQuery{
	export interface Options{
		page?: number | null,
		perPage?: number | null,
		filters?: Filters | null,
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