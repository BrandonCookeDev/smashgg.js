import _ from 'lodash'

import {Entrant, IEntrant} from './Entrant' // TODO change this to internal
import { GGSet, IGGSet } from './GGSet'
import PaginatedQuery from './util/PaginatedQuery'
import NI from './util/NetworkInterface'
import log from './util/Logger'

import * as queries from './scripts/phaseGroupQueries'

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

	static parseFull(data: IPhaseGroup.Data) : PhaseGroup {
		return PhaseGroup.parse(data.phaseGroup)
	}

	static parseEventData(data: IPhaseGroup.DataEventPhaseGroups) : PhaseGroup[]{
		return data.event.phaseGroups.map(pg => PhaseGroup.parse(pg))
	}

	static async get(id: number) : Promise<PhaseGroup> {
		log.info('Getting Phase Group with id %s', id)
		let data: IPhaseGroup.Data = await NI.query(queries.phaseGroup, {id: id})
		return PhaseGroup.parse(data.phaseGroup)
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

	getTiebreakOrder(): object | [] | null{
		return this.tiebreakOrder
	}

	async getEntrants(options: IPhaseGroup.EntrantOptions = IPhaseGroup.getDefaultEntrantOptions()) : Promise<Entrant[]>{
		log.info('Getting Entrants for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		let data: IPhaseGroup.PhaseGroupEntrantData[] = await PaginatedQuery.query(
			`Phase Group Entrants [${this.id}]`, 
			queries.phaseGroupEntrants, {id: this.id},
			options, 2
		) 
		let phaseGroups = data.map(pg => pg.phaseGroup);
		let entrants: Entrant[] = _.flatten(phaseGroups.map(pg => pg.paginatedSeeds.nodes.map(e => Entrant.parseFull(e)).filter(seed => seed != null)))
		return entrants
	}

	async getSets(options: IPhaseGroup.SetOptions = IPhaseGroup.getDefaultSetOptions()) : Promise<GGSet[]>{
		log.info('Getting Sets for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		let data: IPhaseGroup.PhaseGroupSetData[] = await PaginatedQuery.query(
			`Phase Group Sets [${this.id}]`,
			queries.phaseGroupSets, {id: this.id},
			options, 2
		)
		let phaseGroups = data.map(pg => pg.phaseGroup);
		let sets: GGSet[] = _.flatten(phaseGroups.map(pg => pg.paginatedSets.nodes.map(set => GGSet.parse(set)).filter(set => set != null)))
		return sets
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
		getEntrants(options: EntrantOptions) : Promise<Entrant[]>
		getSets(options: SetOptions) : Promise<GGSet[]>
		getCompleteSets() : Promise<GGSet[]>
		getIncompleteSets() : Promise<GGSet[]>
		getSetsXMinutesBack(minutes: number) : Promise<GGSet[]>
		findPlayerByParticipantId(id: number) : Promise<Entrant | undefined>
	}

	export interface Data{
		phaseGroup: PhaseGroupData
	}

	export interface DataEventPhaseGroups{
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

	export interface PhaseGroupEntrantData{
		phaseGroup:{
			paginatedSeeds:{
				pageInfo?: {
					totalPages: number
				},
				nodes: IEntrant.Data[]
			}
		}
	}

	export interface PhaseGroupSetData{
		phaseGroup:{
			paginatedSets:{
				pageInfo?: {
					totalPages: number
				},
				nodes: IGGSet.SetData[]
			}
		}
	}
	

	export interface EntrantOptions{
		page?: number | null,
		perPage?: number | null,
		sortBy?: string | null,
		filter?: null | {
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

	export function getDefaultEntrantOptions() : EntrantOptions{
		return {
			page: 1,
			perPage: 1,
			sortBy: null,
			filter: null
		}
	}

	export interface SetOptions{
		page?: number | null,
		perPage?: number | null,
		sortBy?: null | 'NONE' | 'STANDARD' | 'RACE_SPECTATOR' | 'ADMIN',
		filters?: null | {
			entrantIds?: number[],
			state?: number[],
			stationIds?: number[],
			phaseIds?: number[],
			phaseGroupIds?: number[],
			roundNumber?: number
		}
	}

	export function getDefaultSetOptions() : SetOptions{
		return {
			page: 1,
			perPage: 1,
			sortBy: null,
			filters: null
		}
	}
}