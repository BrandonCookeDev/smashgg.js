import _ from 'lodash'

import { Attendee, IAttendee } from './Attendee'
import { Entrant, IEntrant } from './Entrant' // TODO change this to internal
import { GGSet, IGGSet } from './GGSet'
import { Seed, ISeed } from './Seed'
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

	async getSeeds(options: ISeed.SeedOptions = ISeed.getDefaultSeedOptions()) : Promise<Seed[]> {
		log.info('Getting Seeds for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		
		let data: IPhaseGroup.PhaseGroupSeedData[] = await NI.paginatedQuery(
			`Phase Group Seeds [${this.id}]`,
			queries.phaseGroupSeeds, {id: this.id},
			options, {}, 2
		)

		let phaseGroups = _.flatten(data.map(pg => pg.phaseGroup))
		let seedData: ISeed.SeedData[] = _.flatten(phaseGroups.map(pg => pg.paginatedSeeds.nodes))
		let seeds = seedData.map(seed => Seed.parse(seed))
		return seeds
	}

	async getEntrants(options: IEntrant.EntrantOptions = IEntrant.getDefaultEntrantOptions()) : Promise<Entrant[]>{
		log.info('Getting Entrants for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		let data: IPhaseGroup.PhaseGroupEntrantData[] = await NI.paginatedQuery(
			`Phase Group Entrants [${this.id}]`, 
			queries.phaseGroupEntrants, {id: this.id},
			options, {}, 2
		) 
		let phaseGroups = data.map(pg => pg.phaseGroup);
		let entrants: Entrant[] = _.flatten(phaseGroups.map(pg => pg.paginatedSeeds.nodes.map(e => Entrant.parseFull(e)).filter(seed => seed != null)))
		return entrants
	}

	async getAttendees(options: IAttendee.AttendeeOptions = IAttendee.getDefaultAttendeeOptions()) : Promise<Attendee[]>{
		log.info('Getting Attendees for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		let data: IPhaseGroup.PhaseGroupAttendeeData[] = await NI.paginatedQuery(
			`Phase Group Attendees [${this.id}]`,
			queries.phaseGroupAttendees, {id: this.id},
			options, {}, 2
		)
		let seeds = _.flatten(data.map(entrant => entrant.phaseGroup.paginatedSeeds.nodes))
		let entrants = seeds.map(seed => seed.entrant).filter(entrant => entrant != null)
		let attendeeData: IAttendee.AttendeeData[] = _.flatten(entrants.map(entrant => entrant.participants))
		let attendees: Attendee[] = attendeeData.map(a => Attendee.parse(a))
		return attendees
	}

	async getSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]>{
		log.info('Getting Sets for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		let data: IPhaseGroup.PhaseGroupSetData[] = await NI.paginatedQuery(
			`Phase Group Sets [${this.id}]`,
			queries.phaseGroupSets, {id: this.id},
			options, {}, 2
		)
		let phaseGroups = data.map(pg => pg.phaseGroup);
		let sets: GGSet[] = _.flatten(phaseGroups.map(pg => pg.paginatedSets.nodes.map(set => GGSet.parse(set)).filter(set => set != null)))
		
		// optional filters
		if(options.filterByes) sets = GGSet.filterOutDQs(sets)
		if(options.filterResets) sets = GGSet.filterOutResets(sets)
		if(options.filterByes) sets = GGSet.filterOutByes(sets)

		return sets
	}

	async getCompleteSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]>{
		log.info('Getting Completed sets for Phase Group [%s]', this.id)
		let sets = await this.getSets(options)
		return GGSet.filterForCompleteSets(sets)
	}

	async getIncompleteSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]>{
		log.info('Getting Incompleted sets for Phase Group [%s]', this.id)
		let sets = await this.getSets(options)
		return GGSet.filterForIncompleteSets(sets)
	}

	async getSetsXMinutesBack(minutes: number, options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]>{
		log.info('Getting sets completed %s minutes ago for Phase Group [%s]', minutes, this.id)
		let sets = await this.getSets(options)
		return GGSet.filterForXMinutesBack(sets, minutes)
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
		getSeeds(options: ISeed.SeedOptions) : Promise<Seed[]>
		getEntrants(options: IEntrant.EntrantOptions) : Promise<Entrant[]>
		getAttendees(options: IAttendee.AttendeeOptions) : Promise<Attendee[]>
		getSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getCompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getIncompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getSetsXMinutesBack(minutes: number, options: IGGSet.SetOptions) : Promise<GGSet[]>
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

	export interface PhaseGroupAttendeeData{
		phaseGroup:{
			paginatedSeeds:{
				pageInfo?: {
					totalPages: number
				},
				nodes: {
					entrant: {
						participants: IAttendee.AttendeeData[]
					}
				}
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
	
	export interface PhaseGroupSeedData{
		phaseGroup:{
			paginatedSeeds:{
				pageInfo?:{
					totalPages: number
				},
				nodes: ISeed.SeedData[]
			}
		}
	}

}