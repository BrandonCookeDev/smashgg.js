import log from './Logger'
import NI from './NetworkInterface'
import {format} from 'util'
import {merge} from './Common'

const TOTAL_PAGES_REGEX_JSON = new RegExp(/"pageInfo":[\s]?{[\n\s]*?"totalPages": ([0-9]*)/);
const TOTAL_PAGES_REGEX_STRING = new RegExp(/"pageInfo":{"totalPages":([0-9]*)}/);

export default class PaginatedQuery{

	static async query(queryString: string, params: object, options?: IPaginatedQuery.Options) : Promise<any>{
		
		let page = options != undefined && options.page ? options.page : 1
		let perPage = options != undefined && options.perPage ? options.perPage : 1
		let sortBy = options != undefined && options.sortBy  ? options.sortBy : null
		let filters = options != undefined && options.filters  ? options.filters : null

		// first paginated query should get the total page count w/ data
		let initialOptions = {
			page: page,
			perPage: perPage,
			sortBy: sortBy,
			filters: filters,
			pageInfo: 'pageInfo{\ntotalPages\n}'
		}
		let query = merge(queryString, initialOptions);

		let data = [await NI.query(query, params)];
		let totalPagesExec = TOTAL_PAGES_REGEX_STRING.exec(JSON.stringify(data))
		if(!totalPagesExec)
			throw new Error('Something wrong with paginated query. Did not match regex ' + TOTAL_PAGES_REGEX_STRING.toString())
		
		// after, leave off the total page count to minimize complexity
		let totalPages = +totalPagesExec[1];
		for(let i = 0; i<totalPages; i++){
			query = merge(queryString, {
				page: page + i,
				perPage: perPage,
				sortBy: sortBy,
				filters: filters
			})
			data.push(await NI.query(query, params))
		}

		return data
	}

}

namespace IPaginatedQuery{
	export interface Options{
		page?: number,
		perPage?: number,
		sortBy?: string,
		filters?: Filters
	}

	export interface PageInfoData{
		pageInfo: {
			totalPages: number
		},
		[x: string]: any
	}

	export interface Filters{
		[x: string]: {
			[x: string]: string
		}
	}
}