import _ from 'lodash'

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

	static parse(data: IPhaseGroup.PhaseGroupData) : PhaseGroup{
		return new PhaseGroup(
			data.id,
			data.phaseId,
			data.displayIdentifier,
			data.firstRoundTime,
			data.state,
			data.waveId,
			data.tiebreakOrder
		)
	}

	static parseFull(data: IPhaseGroup.Data) : PhaseGroup[]{
		return data.event.phaseGroups.map(pg => PhaseGroup.parse(pg));
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
		getEntrants() : Entrant[] | [] 
		findPlayerByParticipantId(id: number) : Promise<Entrant | undefined>
	}

	export interface Data{
		event:{
			phaseGroups: PhaseGroupData[]
		}
	}

	export interface PhaseGroupData{
		id: number
		phaseId: number
		displayIdentifier: string | null
		firstRoundTime: number | null
		state: number | null
		waveId: number | null
		tiebreakOrder: object | null
	}
}