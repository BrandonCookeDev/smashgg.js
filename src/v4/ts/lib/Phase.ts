'use strict';

import _ from 'lodash'

import NI from './util/NetworkInterface'
import * as queries from './scripts/phaseQueries'
import {PhaseGroup, GGSet, IGGSet} from './internal'
import {Entrant, IEntrant} from './Entrant'
import {Seed, ISeed} from './Seed'
import PaginatedQuery from './util/PaginatedQuery'
import Encoder from './util/Encoder'
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

	static parse(data: IPhase.Data) : Phase{
		return new Phase(
			data.phase.id,
			data.id,
			data.phase.name,
			data.phase.numSeeds,
			data.phase.groupCount
		)
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
		let data: IPhaseGroup.Data = await NI.query(queries.phasePhaseGroups, {eventId: this.eventId})
		let phaseGroupData: IPhaseGroup.PhaseGroupData[] = data.event.phaseGroups.filter(phaseGroupData => phaseGroupData.phaseId === this.id)
		let phaseGroups: PhaseGroup[] = phaseGroupData.map(pg => PhaseGroup.parse(pg))
		return phaseGroups;
	}

	async getSeeds() : Promise<Seed[]> {
		log.info('Getting seeds for phase %s', this.id)
		let data: ISeed.Data[] = await PaginatedQuery.query(queries.phaseSeeds, {id: this.id})
		let seedData: ISeed.SeedData[] = _.flatten(data.map(results => results.seed))
		let seeds = seedData.map( (seedData: ISeed.SeedData) => Seed.parse(seedData) )
		return seeds
	}

	async getSets() : Promise<GGSet[]> {
		log.info('Getting sets for phase %s', this.id)
		let data: IGGSet.Data[] = await PaginatedQuery.query(queries.phaseSets, {eventId: this.eventId, phaseId: this.id})
		let setsData: IGGSet.SetData[] = _.flatten(data.map(setData => setData.set))
		let sets = setsData.map( (setData: IGGSet.SetData) => GGSet.parse(setData) )
		return sets
	}

	async getEntrants() : Promise<Entrant[]> {
		log.info('Getting entrants for phase %s', this.id)
		let data: IPhase.PhaseEntrantData[] = await PaginatedQuery.query(queries.phaseEntrants, {id: this.id})
		let entrantData: IEntrant.EntrantData[] = _.flatten(data.map(entrantData => entrantData.phase.entrants ))
		let entrants: Entrant[] = entrantData.map(e => Entrant.parse(e)) as Entrant[];
		return entrants
	}

	async getIncompleteSets() : Promise<GGSet[]> {
		return GGSet.filterForIncompleteSets(await this.getSets())
	}

	async getCompleteSets() : Promise<GGSet[]> {
		return GGSet.filterForCompleteSets(await this.getSets())
	}

	async getSetsXMinutesBack(minutesBack: number) : Promise<GGSet[]> {
		return GGSet.filterForXMinutesBack(await this.getSets(), minutesBack)
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
		getSets() : Promise<GGSet[]>
		getEntrants() : Promise<Entrant[]>
		getIncompleteSets() : Promise<GGSet[]>
		getCompleteSets() : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number) : Promise<GGSet[]>

	}

	export interface Data{
		id: number
		phase: PhaseData
	}

	export interface PhaseData{
		id: number,
		eventId: number,
		name: string,
		numSeeds: number,
		groupCount: number
	}

	export interface PhaseSeedData{
		id: number,
		phase:{
			seeds: ISeed.Data[]
		}
	}

	export interface PhaseSetData{
		id: number,
		phase: {
			sets: IGGSet.SetData[]
		}
	}

	export interface PhaseEntrantData{
		id: number,
		phase: {
			entrants: IEntrant.EntrantData
		}
	}
}