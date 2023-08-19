import { format } from 'util'
import Encoder from './Encoder'
import _ from 'lodash'
import log from './Logger'

import {ICommonOptions} from '../interfaces/ICommon'
import {IGGSet} from '../interfaces/IGGSet'

const DEFAULT_CONCURRENCY = 4

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

const losersRoundRegex = new RegExp(/Losers Round (\d)/)

export function merge(target: string, obj: any): string{
	let ret = _.clone(target)

	for (const prop in obj) {
		if(prop){
			const regex = new RegExp(`{${prop}}`, 'g')
			ret = ret.replace(regex, obj[prop])
		}
	}

	return ret
}

export function mergeQuery(target: string, obj: any): string{
	let ret: string = _.clone(target)

	for (const prop in obj) {
		if(prop){
			const regex = new RegExp(`{${prop}}`, 'g')
			ret = ret.replace(regex, obj[prop])
		}
	}

	const orphanedVarsRegex = new RegExp(/\{\S*\}/, 'g')
	const orphanedVars = orphanedVarsRegex.exec(ret)
	if(orphanedVars){
		log.warn('Variables orphaned by this query: [%s]', orphanedVars.join(','))
		log.warn('Replacing orphans with null')
		ret = ret.replace(orphanedVarsRegex, 'null')
	}
	log.queries(ret)
	return ret
}

export function determineComplexity(...objects: any[]): number{
	let complexity = 0
	const objs = []

	for (const i in objects) {
		if(i){
			const obj = objects[i]
			for (const key in obj) {
				if (typeof obj[key] === 'object') {
					complexity++
					objs.push(obj[key])
				}
			}
		}
	}

	if(complexity === 0) return 0
	else return complexity + determineComplexity(objs)
}

export function sleep(ms: number): Promise<null | undefined>{
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

export function orderTop8(sets: IGGSet[]): IGGSet[]{
	let ordered: IGGSet[] = []
	const fn = (roundName: string) => {
		ordered = ordered.concat(_.find(sets, set => {
			return set.getFullRoundText() === roundName
		}) as IGGSet)
	}

	const hasReset = _.find(sets, set => {
		return set.getFullRoundText() === 'Grand Final Reset'
	})
	if(hasReset) fn('Grand Final Reset')

	fn('Grand Final')
	fn('Losers Final')
	fn('Losers Semi-Final')
	fn('Winners Final')
	fn('Losers Quarter-Final')
	fn('Winners Semi-Final')

	const roundNames = sets.map(set => set.getFullRoundText())
	const losersRoundName = roundNames.filter(name => losersRoundRegex.test(name!))[0]
	fn(losersRoundName!)

	return ordered
}

export function parseOptions(options: ICommonOptions): ICommonOptions {
	return {
		isCached: options.isCached !== undefined ? options.isCached === true : true,
		concurrency: options.concurrency ?? DEFAULT_CONCURRENCY,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

// todo remove theabove and below non-null expectations

export function getHighestLevelLosersRound(sets: IGGSet[]): string {
	const loserRounds = sets.filter(set => losersRoundRegex.test(set.getFullRoundText()!))
	const loserRoundNumbers = loserRounds.map(set => (losersRoundRegex.exec(set.getFullRoundText()!) as any[])[1])
	const highestLoserRoundNumber = Math.max.apply(null, loserRoundNumbers)
	return `Losers Round ${highestLoserRoundNumber}`
}

export function filterForTop8Sets(sets: IGGSet[]): IGGSet[] {
	const highestLoserRound = getHighestLevelLosersRound(sets)
	const targetLabels = TOP_8_LABELS.concat([highestLoserRound])
	const topSets = sets.filter(set => targetLabels.includes(set.getFullRoundText()!))
	return orderTop8(topSets)
}

export function createExpandsString(expands: any): string{
	let expandsString: string = ''
	for (const property in expands) {
		if (expands.hasOwnProperty(property))
			expandsString += format('expand[]=%s&', property)
	}
	return expandsString
}

export function convertEpochToDate(epoch: number): Date{
	const d = new Date(0)
	d.setUTCSeconds(epoch)
	return d
}
