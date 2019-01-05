import Encoder from './Encoder'

const DEFAULT_CONCURRENCY = 4;

export interface Options{
	isCached?: boolean, 
	rawEncoding?: string,
	concurrency?: number    
}

export function parseOptions(options: Options) : Options {
	return {
		isCached: options.isCached != undefined ? options.isCached === true : true,
		concurrency: options.concurrency || DEFAULT_CONCURRENCY,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}