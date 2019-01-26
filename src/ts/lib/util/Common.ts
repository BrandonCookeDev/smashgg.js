import { format } from 'util'
import { GGSet } from '../GGSet'
import Encoder from './Encoder'
import _ from 'lodash'

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

const losersRoundRegex = new RegExp(/Losers Round ([0-9])/)

import Options = ICommon.Options

export function sleep(ms: number) : Promise<null | undefined>{
	return new Promise(function(resolve){
		setTimeout(resolve, ms)
	})
}

export function orderTop8(sets: GGSet[]) : GGSet[]{
	let ordered: GGSet[] = [];
	const fn = (roundName: string) => {
		ordered = ordered.concat(_.find(sets, set => {
			return set.getRound() === roundName;
		}) as GGSet)
	}

	let hasReset = _.find(sets, set => {
		return set.getRound() === 'Grand Final Reset';
	})
	if(hasReset) fn('Grand Final Reset')

	fn('Grand Final')
	fn('Losers Final')
	fn('Losers Semi-Final')
	fn('Winners Final')
	fn('Losers Quarter-Final')
	fn('Winners Semi-Final')


	let roundNames = sets.map(set => set.getRound())
	let losersRoundName = roundNames.filter(name => losersRoundRegex.test(name))[0]
	fn(losersRoundName)

	return ordered
}

export function parseOptions(options: Options) : Options {
	return {
		isCached: options.isCached != undefined ? options.isCached === true : true,
		concurrency: options.concurrency || DEFAULT_CONCURRENCY,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

export function getHighestLevelLosersRound(sets: GGSet[]) : string {
	let loserRounds = sets.filter(set => losersRoundRegex.test(set.getRound()))
	let loserRoundNumbers = loserRounds.map(set => (losersRoundRegex.exec(set.getRound()) as any[])[1])
	let highestLoserRoundNumber = Math.max.apply(null, loserRoundNumbers)
	return `Losers Round ${highestLoserRoundNumber}`
}

export function filterForTop8Sets(sets: GGSet[]) : GGSet[] {
	let highestLoserRound = getHighestLevelLosersRound(sets)
	let targetLabels = TOP_8_LABELS.concat([highestLoserRound])
	let topSets = sets.filter(set => targetLabels.includes(set.getRound()))
	return orderTop8(topSets);
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