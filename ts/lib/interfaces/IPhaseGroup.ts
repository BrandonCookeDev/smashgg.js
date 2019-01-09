import Encoder from '../util/Encoder'

/* Interfaces */
import { ICommon } from './ICommon'
import { IPlayer } from './IPlayer'
import { IGGSet } from './IGGSet'

/* Types */
import TPlayer = IPlayer.Player
import TGGSet = IGGSet.GGSet

import PlayerEntity = IPlayer.Entity
import SetEntity = IGGSet.Entity

export namespace IPhaseGroup{

	export interface PhaseGroup{
		id: number
		url: string
		data: Data | string,
		rawEncoding: string,
		expandsString: string,
		expands: Expands
		players: Array<TPlayer>
		sets: Array<TGGSet>

		loadData(data: Data) : Data | string
		getData() : Data
		load() : Promise<Data | string>
		getPlayers(options: Options) : Promise<Array<TPlayer>>
		getSets(options: Options) : Promise<Array<TGGSet>>
		getCompleteSets(options: Options) : Promise<Array<TGGSet>>
		getIncompleteSets(options: Options) : Promise<Array<TGGSet>>
		getSetsXMinutesBack(minutes: number, options: Options) : Promise<Array<TGGSet>>
		resolveSet(set: IGGSet.Entity) : Promise<TGGSet | undefined>
		getFromDataEntities(prop: string) : any
		getPhaseId() : number
		getEntrants() : Array<IPlayer.Entity> | [] 
		nullValueString(prop: string) : string
		emitPhaseGroupReady() : void
		emitPhaseGroupError(err: Error) : void
		findPlayerByParticipantId(id: number) : TPlayer
	}

	export interface Options{
		isCached?: boolean,
		rawEncoding?: string,
		expands?: Expands
	}

	export interface Expands{
		sets: boolean,
		entrants: boolean,
		standings: boolean,
		seeds: boolean
	}

	export interface Data{
		entities: {
			id: number,
			sets?: [SetEntity],
			entrants?: [PlayerEntity],
			standings?: [{
				[x: string]: any
			}],
			seeds?: [{
				[x: string]: any
			}],
			[x: string]: any
		}
	}

	export function parseOptions(options: Options) : Options{
		return{
			expands: {
				sets: (options.expands != undefined  && options.expands.sets == false) ? false : true,
				entrants: (options.expands != undefined  && options.expands.entrants == false) ? false : true,
				standings: (options.expands != undefined  && options.expands.standings == false) ? false : true,
				seeds: (options.expands != undefined  && options.expands.seeds == false) ? false : true
			},
			isCached: options.isCached != undefined ? options.isCached === true : true,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}

	export function getDefaultOptions(options: Options) : Options{
		return {
			isCached: true,
			rawEncoding: 'JSON',
			expands: getDefaultExpands()
		}
	}

	export function getDefaultData(): Data{
		return {
			entities:{
				id: 0
			}
		}
	}

	export function getDefaultExpands() : Expands{
		return {
			sets: true,
			entrants: true,
			standings: true,
			seeds: true
		}
	}
}