import { format } from 'util'
import { GGSet } from '../GGSet'
import Encoder from './Encoder'

const DEFAULT_CONCURRENCY = 4;

const TOP_8_LABELS = [
	'Losers Quarter-Final', 'Losers Semi-Final', 
	'Winners Semi-Final', 'Winners Final',
	'Grand Final', 'Grand Final Reset', 'Losers Final'
]

const TOP_8_LABELS_STANDALONE = [
	'Losers Quarter-Final', 'Losers Semi-Final', 
	'Winners Semi-Final', 'Winners Final',
	'Grand Final', 'Grand Final Reset', 'Losers Final',
	'Losers Round 1'
]

import Options = ICommon.Options

export function parseOptions(options: Options) : Options {
	return {
		isCached: options.isCached != undefined ? options.isCached === true : true,
		concurrency: options.concurrency || DEFAULT_CONCURRENCY,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

export function getHighestLevelLosersRound(sets: GGSet[]) : string {
	let regex = new RegExp(/Losers Round ([0-9])/)
	let loserRounds = sets.filter(set => regex.test(set.getRound()))
	let loserRoundNumbers = loserRounds.map(set => (regex.exec(set.getRound()) as any[])[1])
	let highestLoserRoundNumber = Math.max.apply(null, loserRoundNumbers)
	return `Losers Round ${highestLoserRoundNumber}`
}

export function filterForTop8Sets(sets: GGSet[]) : GGSet[] {
	let highestLoserRound = getHighestLevelLosersRound(sets)
	let targetLabels = TOP_8_LABELS.concat([highestLoserRound])
	let topSets = sets.filter(set => targetLabels.includes(set.getRound()))
	return topSets;
}

export function createExpandsString(expands: any) : string{
	let expandsString: string = '';
    for(let property in expands){
		if(expands.hasOwnProperty(property))
			expandsString += format('expand[]=%s&', property);
	}
	return expandsString;
}

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