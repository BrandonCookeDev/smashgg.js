import Encoder from '../util/Encoder'

/* Interfaces */
import { IPhaseGroup } from './IPhaseGroup'
import { IPlayer } from './IPlayer'
import { IGGSet } from './IGGSet'

/* Types */
import TPhaseGroup = IPhaseGroup.PhaseGroup
import TPlayer = IPlayer.Player
import TGGSet = IGGSet.GGSet

import PhaseGroup = IPhaseGroup.PhaseGroup

export namespace IPhase{
	export interface Phase{
		id: number
		url: string
		data: Data | string
		isCached: boolean
		rawEncoding: string
		expandsString: string
		expands: Expands

		loadData(data: Data) : Data | string
		
		getData() : Data
		
		//getPhase(id: number, options: Options) : Promise<Phase> 
		
		load(): Promise<Data | string> 
		
		getPhaseGroups(options: Options) : Promise<Array<PhaseGroup>>
		
		getSets(options: Options) : Promise<Array<TGGSet>>
		
		getPlayers(options: Options) : Promise<Array<TPlayer>>
		
		getIncompleteSets(options: Options) : Promise<Array<TGGSet>>
		
		getCompleteSets(options: Options) : Promise<Array<TGGSet>>
		
		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<Array<TGGSet>>
		
		getFromDataEntities(prop: string) : any
		
		getName() : string
		
		getEventId() : string
		
		nullValueString(prop: string) : string
		
		emitPhaseReady() : void
		
		emitPhaseError(err: Error) : void
	}

	export interface Options{
		isCached?: boolean,
		expands?: Expands,
		rawEncoding?: string
	}

	export interface Expands{
		groups: boolean
	}

	export interface Data{
		id: number,
		[x: string]: any
	}

	export interface Entity{
		id: number,
		[x: string]: any
	}

	export function getDefaultData(){
		return {
			id: 0
		}
	}

	export function getDefaultExpands(){
		return {
			groups: true
		}
	}

	export function getDefaultOptions(options: Options) : Options{
		return {
			expands: {
				groups: true
			},
			isCached: true,
			rawEncoding: 'JSON'
		}
	}

	export function parseOptions(options: Options) : Options{
		return{
			expands: {
				groups: (options.expands != undefined && options.expands.groups == false) ? false : true
			},
			isCached: options.isCached != undefined ? options.isCached === true : true,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}
}