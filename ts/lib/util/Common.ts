import { format } from 'util'
import Encoder from './Encoder'
import { ICommon } from '../models/ICommon';

const DEFAULT_CONCURRENCY = 4;

import Options = ICommon.Options

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