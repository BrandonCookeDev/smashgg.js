'use strict';

import _ from 'lodash'

import NI from './util/NetworkInterface'
import * as queries from './scripts/phaseQueries'
import {PhaseGroup} from './PhaseGroup' //TODO change this to internal
import {GGSet, IGGSet} from './GGSet'
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

	static parse(data: IPhase.PhaseData, eventId: number) : Phase{
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
		let data: IPhaseGroup.Data = await NI.query(queries.phasePhaseGroups, {eventId: this.eventId})
		let phaseGroupData: IPhaseGroup.PhaseGroupData[] = data.event.phaseGroups.filter(phaseGroupData => phaseGroupData.phaseId === this.id)
		let phaseGroups: PhaseGroup[] = phaseGroupData.map(pg => PhaseGroup.parse(pg))
		return phaseGroups;
	}

	async getSeeds() : Promise<Seed[]> {
		log.info('Getting seeds for phase %s', this.id)
		let data: ISeed.Data[] = await PaginatedQuery.query(`Phase Seeds [${this.id}]`, queries.phaseSeeds, {id: this.id})
		let seedData: ISeed.SeedData[] = _.flatten(data.map(results => results.seed))
		let seeds = seedData.map( (seedData: ISeed.SeedData) => Seed.parse(seedData) )
		return seeds
	}

	async getSets(options?: IPhase.SetOptions) : Promise<GGSet[]> {
		log.info('Getting sets for phase %s', this.id)
		let optionSet = IPhase.parseSetOptions(options)
		let data: IPhase.DataSets[] = await PaginatedQuery.query(`Phase Sets [${this.id}]`, queries.phaseSets, {eventId: this.eventId, phaseId: this.id}, optionSet.params, optionSet.additionalParams)
		let phaseGroups = _.flatten(data.map(setData => setData.event.phaseGroups))
		let setsData: IGGSet.SetData[] = _.flatten(phaseGroups.map(pg => pg.paginatedSets.nodes)).filter(set => set != null)
		let sets = setsData.map( (setData: IGGSet.SetData) => GGSet.parse(setData) )
		return sets
	}

	async getEntrants() : Promise<Entrant[]> {
		log.info('Getting entrants for phase %s', this.id)
		let data: IPhase.PhaseEntrantData[] = await PaginatedQuery.query(`Phase Entrants [${this.id}]`, queries.phaseEntrants, {id: this.id})
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
		getSets(options: SetOptions) : Promise<GGSet[]>
		getEntrants() : Promise<Entrant[]>
		getIncompleteSets() : Promise<GGSet[]>
		getCompleteSets() : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number) : Promise<GGSet[]>

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
			seeds: ISeed.Data[]
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
			entrants: IEntrant.EntrantData
		}
	}

	export interface SetOptions{
		page?: number,
		perPage?: number
		sortType?: 'NONE' | 'STANDARD' | 'RACE_SPECTATOR' | 'ADMIN',
		hasPermissions?: boolean,
		filters?: {
			entrantIds?: number,
			state?: number,
			stationIds?: number,
			phaseIds?: number,
			phaseGroupIds?: number,
			roundNumber?: number
		}
	}

	export interface EntrantOptions{
		page?: number,
		perPage?: number,
		sortType?: string
	}

	export function parseSetOptions(options?: SetOptions) : 
			{params?: {page?: number | 1, perPage?: number | 1}, 
			additionalParams?: {sortType?: string | null, hasPermissions?: boolean | null, filters?: any}} 
	{
		if(!options) 
			return {params: {page: 1, perPage: undefined}, additionalParams: {sortType: null, hasPermissions: null, filters: null}}
		let params, additionalParams
		if(options){
			params = {page: options.page, perPage: options.perPage}
			additionalParams = {
				sortType: options.sortType || null,
				hasPermissions: options.hasPermissions || null,
				filters: options.filters
			}
		}
		return {
			params: params,
			additionalParams: additionalParams
		}
	}
}