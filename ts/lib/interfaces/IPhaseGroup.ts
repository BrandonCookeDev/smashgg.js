import Encoder from '../util/Encoder'

import { ICommon } from './ICommon'
import { IPlayer } from './IPlayer'
import { IGGSet } from './IGGSet'

import Player = IPlayer.Player
import GGSet = IGGSet.GGSet
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
		players: Array<Player>
		sets: Array<GGSet>
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