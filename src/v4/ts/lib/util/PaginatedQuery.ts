import log from './Logger'
import NI from './NetworkInterface'
import {format} from 'util'
import {merge} from './Common'

const TOTAL_PAGES_REGEX_JSON = new RegExp(/"pageInfo":[\s]?{[\n\s]*?"totalPages": ([0-9]*)/);
const TOTAL_PAGES_REGEX_STRING = new RegExp(/"pageInfo":{"totalPages":([0-9]*)}/);
const MAX_COMPLEXITY = 1000

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
		let query = merge(queryString, queryOptions);

		let data = [await NI.query(query, params)];
		let totalPagesExec = TOTAL_PAGES_REGEX_STRING.exec(JSON.stringify(data))
		if(!totalPagesExec)
			throw new Error(`${operationName}: Something wrong with paginated query. Did not match regex ${TOTAL_PAGES_REGEX_STRING.toString()}`)
		else if(data.length <= 0)
			throw new Error(`${operationName}: No data returned from query for operation`)

		// after, leave off the total page count to minimize complexity
		let totalPages = +totalPagesExec[1]
		let complexity = Object.keys(data[0]).length
		perPage = 
			options != undefined && options.perPage != undefined ? 
			options.perPage : PaginatedQuery.calculateOptimalPagecount(complexity)

		for(let i = page; i<=totalPages; i++){
			log.info('%s: Collected %s/%s pages', operationName, i, totalPages)
			queryOptions = Object.assign({
				page: page + i,
				perPage: perPage,
				filters: filters,
				pageInfo: ''
			}, additionalParams);
			query = merge(queryString, queryOptions)
			data.push(await NI.query(query, params))
		}

		return data
	}

	static determineComplexity(obj: any) : number{
		let complexity = 1;
		let objs = []
		for(let key in obj) {
			if(typeof obj[key] === 'object'){
				objs.push(obj[key])
			}
		}
		
		if(objs.length == 0) return 0
	}

	static calculateOptimalPagecount(objectComplexity: number) : number{
		return MAX_COMPLEXITY / objectComplexity
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