'use strict';

import _ from 'lodash'

import NI from './util/NetworkInterface'
import * as queries from './scripts/phaseQueries'
import {PhaseGroup} from './PhaseGroup' //TODO change this to internal
import {GGSet, IGGSet} from './GGSet'
import {Entrant, IEntrant} from './Entrant'
import {Seed, ISeed} from './Seed'
import {Attendee, IAttendee} from './Attendee'
import Cache from './util/Cache'
import log from './util/Logger'

import { ICommon } from './util/Common'
import { IPhaseGroup } from './PhaseGroup';
import { phaseGroup } from './scripts/phaseGroupQueries';

export class Phase implements IPhase.Phase{

	id: number
	eventId: number
	name: string
	numSeeds: number
	groupCount: number

	constructor(
		id: number,
		eventId: number,
		name: string,
		numSeeds: number,
		groupCount: number
	){
		this.id = id
		this.eventId = eventId
		this.name = name
		this.numSeeds = numSeeds
		this.groupCount = groupCount
	}

	static parse(data: IPhase.PhaseData, eventId: number = -1) : Phase {
		return new Phase(
			data.id,
			eventId || -1,
			data.name,
			data.numSeeds,
			data.groupCount
		)
	}

	static async get(id: number, eventId: number) : Promise<Phase> {
		log.info('Getting Phase with id %s and event id %s', id, eventId)
		let data: IPhase.Data = await NI.query(queries.phase, {id: id});
		return Phase.parse(data.phase, eventId);
	}
	
	getId(): number{
		return this.id
	}

	getEventId(): number{
		return this.eventId
	}

	getName(): string{
		return this.name
	}

	getNumSeeds(): number{
		return this.numSeeds
	}

	getGroupCount(): number{
		return this.groupCount
	}

	async getPhaseGroups() : Promise<PhaseGroup[]> {
		log.info('Getting phase groups for phase %s', this.id)
		let data: IPhase.PhaseGroupData = await NI.query(queries.phasePhaseGroups, {eventId: this.eventId})
		let phaseGroupData: IPhaseGroup.PhaseGroupData[] = data.event.phaseGroups.filter(phaseGroupData => phaseGroupData.phaseId === this.id)
		let phaseGroups: PhaseGroup[] = phaseGroupData.map(pg => PhaseGroup.parse(pg))
		return phaseGroups;
	}

	async getSeeds(options: ISeed.SeedOptions) : Promise<Seed[]> {
		log.info('Getting seeds for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		let pgs = await this.getPhaseGroups()
		let seeds = await NI.clusterQuery(pgs, 'getSeeds', options)
		return _.flatten(seeds)
	}
	async getEntrants(options: IEntrant.EntrantOptions = IEntrant.getDefaultEntrantOptions()) : Promise<Entrant[]> {
		log.info('Getting entrants for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		let pgs = await this.getPhaseGroups()
		let entrants = await NI.clusterQuery(pgs, 'getEntrants', options)
		return _.flatten(entrants)
	}

	async getAttendees(options: IAttendee.AttendeeOptions = IAttendee.getDefaultAttendeeOptions()) : Promise<Attendee[]> {
		log.info('Getting attendees for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		let pgs = await this.getPhaseGroups()
		let attendees = await NI.clusterQuery(pgs, 'getAttendees', options)
		return _.flatten(attendees);
	}

	async getSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting sets for phase %s', this.id)

		// get all phase group objects, then promise all over the array pf phpase groups
		// getting their respective sets for time efficiency
		let pgs = await this.getPhaseGroups()
		let pgSets = await NI.clusterQuery(pgs, 'getSets', options)
		return _.flatten(pgSets)
	}

	// alternatives
	async getSeeds2(options: ISeed.SeedOptions) : Promise<Seed[]> {
		log.info('Getting seeds for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		let data: IPhase.PhaseSeedData[] = await NI.paginatedQuery(
			`Phase Seeds [${this.id}]`, 
			queries.phaseSeeds, {id: this.id},
			options, {}, 2
		)
		let seedData: ISeed.SeedData[] = _.flatten(data.map(results => results.phase.paginatedSeeds.nodes)).filter(seed => seed != null)
		let seeds = seedData.map( (seedData: ISeed.SeedData) => Seed.parse(seedData) )
		return seeds
	}

	async getEntrants2(options: IEntrant.EntrantOptions = IEntrant.getDefaultEntrantOptions()) : Promise<Entrant[]> {
		log.info('Getting entrants for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		let data: IPhase.PhaseEntrantData[] = await NI.paginatedQuery(
			`Phase Entrants [${this.id}]`, 
			queries.phaseEntrants, {id: this.id}, 
			options, {}, 2
		)
		let entrantData: IEntrant.Data[] = _.flatten(data.map(entrantData => entrantData.phase.paginatedSeeds.nodes )).filter(entrant => entrant != null)
		let entrants: Entrant[] = entrantData.map(e => Entrant.parseFull(e)) as Entrant[];
		return entrants
	}

	async getAttendees2(options: IAttendee.AttendeeOptions = IAttendee.getDefaultAttendeeOptions()) : Promise<Attendee[]> {
		log.info('Getting attendees for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		let data: IPhase.PhaseAttendeeData[] = await NI.paginatedQuery(
			`Phase Attendees [${this.id}]`,
			queries.phaseAttendees, {id: this.id},
			options, {}, 3
		)
		let seeds = _.flatten(data.map(seed => seed.phase.paginatedSeeds))
		let nodes = _.flatten(seeds.map(seed => seed.nodes))
		let entrants = nodes.map(node => node.entrant)
		let participants = _.flatten(entrants.map(entrant => entrant.participants)).filter(participant => participant != null)
		let attendees = participants.map(participant => Attendee.parse(participant))
		return attendees
	}

	async getIncompleteSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		return GGSet.filterForIncompleteSets(await this.getSets(options))
	}

	async getCompleteSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		return GGSet.filterForCompleteSets(await this.getSets(options))
	}

	async getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		return GGSet.filterForXMinutesBack(await this.getSets(options), minutesBack)
	}
}

export namespace IPhase{
	export interface Phase{
		
		id: number
		name: string
		eventId: number
		numSeeds: number
		groupCount: number


		getId(): number
		getEventId(): number
		getName(): string
		getNumSeeds(): number
		getGroupCount(): number	
		getPhaseGroups() : Promise<PhaseGroup[]>
		getSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getEntrants(options: IEntrant.EntrantOptions) : Promise<Entrant[]>
		getIncompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getCompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions) : Promise<GGSet[]>

	}


	export interface Data{
		phase: PhaseData 
	}

	export interface DataSeeds{
		event: PhaseSeedData
	}

	export interface DataSets{
		event: PhaseSetData
	}

	export interface DataEntrants{
		event: PhaseEntrantData
	}

	export interface PhaseData{
		id: number,
		name: string,
		numSeeds: number,
		groupCount: number
	}

	export interface PhaseSeedData{
		phase:{
			paginatedSeeds: {
				pageInfo?:{
					totalPages: number
				}
				nodes: ISeed.SeedData[]
			} 
		}
	}

	export interface PhaseSetData{
		id: number,
		phaseGroups: {
			paginatedSets: {
				pageInfo?: { totalPages: number }
				nodes: IGGSet.SetData[]
			}
		}
	}

	export interface PhaseEntrantData{
		phase: {
			paginatedSeeds:{
				pageInfo?:{
					totalPages: number
				}
				nodes: IEntrant.Data[]
			} 
		}
	}

	export interface PhaseGroupData{
		event:{
			phaseGroups: IPhaseGroup.PhaseGroupData[]
		}
	}

	export interface PhaseAttendeeData{
		phase:{
			paginatedSeeds:{
				pageInfo?:{
					totalPages: number
				}
				nodes:{
					entrant:{
						participants: IAttendee.AttendeeData[]
					}
				}
			}[]
		}
	}
}