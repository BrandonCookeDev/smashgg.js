import { format } from 'util'
import Encoder from './Encoder'

const DEFAULT_CONCURRENCY = 4;

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

export function parseOptions(options: Options) : Options {
	return {
		isCached: options.isCached != undefined ? options.isCached === true : true,
		concurrency: options.concurrency || DEFAULT_CONCURRENCY,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

export function createExpandsString(expands: any) : string{
	let expandsString: string = '';
    for(let property in expands){
		if(expands.hasOwnProperty(property))
			expandsString += format('expand[]=%s&', property);
	}
	return expandsString;
}