import _ from 'lodash'

import {Entrant, IEntrant} from './Entrant' // TODO change this to internal
import {GGSet} from './GGSet'
import PaginatedQuery from './util/PaginatedQuery'
import Encoder from './util/Encoder'
import log from './util/Logger'

import { ICommon } from './util/Common'
import { IGGSet } from './GGSet'

import * as queries from './scripts/phaseGroupQueries'
import { IPhase } from './Phase';

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

	getId(): number {
		return this.id
	}

	getPhaseId(): number{
		return this.phaseId
	}

	getDisplayIdentifier(): string | null{
		return this.displayIdentifier
	}

	getFirstRoundTime(): number | null{
		return this.firstRoundTime
	}

	getState(): number | null{
		return this.state
	}

	getWaveId(): number | null{
		return this.waveId
	}

	getTiebreakOrder(): object | null{
		return this.tiebreakOrder
	}

	async getEntrants(options: IPhaseGroup.EntrantOptions = {id: this.id}) : Promise<Entrant[]>{
		let data: IPhaseGroup.PhaseGroupSeedData = await PaginatedQuery.query(
			`Phase Group Entrants [${this.id}]`, 
			queries.phaseGroupEntrants, 
			{id: this.id, page: options.page, perPage: options.perPage, sortBy: options.sortBy},
			{}, 2
		)
		let entrants: Entrant[] = data.phaseGroup.paginatedSeeds.nodes.map(e => Entrant.parse(e))
		return entrants
	}

	getSets() : Promise<GGSet[]>{

	}

	getCompleteSets() : Promise<GGSet[]>{

	}

	getIncompleteSets() : Promise<GGSet[]>{

	}

	getSetsXMinutesBack(minutes: number) : Promise<GGSet[]>{

	}

	findPlayerByParticipantId(id: number) : Promise<Entrant | undefined>{

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
		getEntrants(options: IPhaseGroup.EntrantOptions) : Promise<Entrant[]>
		getSets() : Promise<GGSet[]>
		getCompleteSets() : Promise<GGSet[]>
		getIncompleteSets() : Promise<GGSet[]>
		getSetsXMinutesBack(minutes: number) : Promise<GGSet[]>
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

	export interface PhaseGroupSeedData{
		phaseGroup:{
			paginatedSeeds:{
				pageInfo?: {
					totalPages: number
				},
				nodes: IEntrant.EntrantData[]
			}
		}
	}

	export interface EntrantOptions{
		id: number,
		page?: number | null,
		perPage?: number | null,
		sortBy?: string,
		filter?: {
			id?: number,
			entrantName?: string,
			checkInState?: number,
			phaseGroupId?: number[],
			phaseId?: number[],
			eventId?: number,
			seach?:{
				fieldsToSearch: string[],
				searchString: string
			}
		}
	}
}