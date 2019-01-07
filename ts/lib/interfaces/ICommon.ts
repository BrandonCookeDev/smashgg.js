
import Encoder from '../util/Encoder'

export namespace ICommon{
	export interface Options{
		isCached?: boolean, 
		rawEncoding?: string,
		concurrency?: number    
	}
	
	export interface Entity{
		id: number,
		[x: string]: any
	}
	
	export interface Data{
		[x: string]: any
	}

	export function parseOptions(options: Options) : Options{
		return {
			isCached: options.isCached != undefined ? options.isCached === true : true,
			concurrency: options.concurrency || 4,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}
}