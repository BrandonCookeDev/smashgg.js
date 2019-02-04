import _ from 'lodash'
import pmap from 'p-map'
import { format } from 'util'
import moment from 'moment'
import request from 'request-promise'
import { EventEmitter } from 'events'

import Cache from './util/Cache'
import {Entrant, GGSet} from './internal'
import Encoder from './util/Encoder'
import log from './util/Logger'

import { ICommon } from './util/Common'
import { IGGSet } from './GGSet'

/* Convenience */
import Data = IPhaseGroup.Data
import Entity = ICommon.Entity
import Options = ICommon.Options
import Expands = IPhaseGroup.Expands
import PhaseGroupOptions = IPhaseGroup.Options
import parseOptions = ICommon.parseOptions

/* Constants */
const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';

export class PhaseGroup implements IPhaseGroup.PhaseGroup{

	id: number
	phaseId: number
	displayIdentifier: string | null
	firstRoundTime: number | null
	state: number | null
	waveId: number | null
	tiebreakOrder: object | null


	constructor(
		id: number,
		phaseId: number,
		displayIdentifier: string | null,
		firstRoundTime: number | null,
		state: number | null,
		waveId: number | null,
		tiebreakOrder: object | null
	){
		this.id = id 
		this.phaseId = phaseId
		this.displayIdentifier = displayIdentifier  
		this.firstRoundTime = firstRoundTime  
		this.state = state  
		this.waveId = waveId  
		this.tiebreakOrder = tiebreakOrder  
	}

}

export namespace IPhaseGroup{

	export interface PhaseGroup{
		
		id: number
		phaseId: number
		displayIdentifier: string | null
		firstRoundTime: number | null
		state: number | null
		waveId: number | null
		tiebreakOrder: object | null

		getId(): number
		getPhaseId(): number
		getDisplayIdentifier(): string | null
		getFirstRoundTime(): number | null
		getState(): number | null
		getWaveId(): number | null
		getTiebreakOrder(): object | null
		getPlayers(options: Options) : Promise<Entrant[]>
		getSets(options: Options) : Promise<GGSet[]>
		getCompleteSets(options: Options) : Promise<GGSet[]>
		getIncompleteSets(options: Options) : Promise<GGSet[]>
		getSetsXMinutesBack(minutes: number, options: Options) : Promise<GGSet[]>
		getFromDataEntities(prop: string) : any
		getPhaseId() : number
		getEntrants() : Array<Entrant.Entity> | [] 
		findPlayerByParticipantId(id: number) : Promise<Entrant | undefined>
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
			sets?: [IGGSet.SetEntity],
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

	export function getDefaultOptions() : Options{
		return {
			isCached: true,
			rawEncoding: 'json',
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