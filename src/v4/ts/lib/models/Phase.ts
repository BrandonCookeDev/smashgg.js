import _ from 'lodash'
import log from '../util/Logger'
import NI from '../util/NetworkInterface'
import * as queries from '../scripts/phaseQueries'

import {
	IPhase, 
	IPhaseData, 
	IPhaseDataFull,
	IPhaseSeedData,
	IPhaseEntrantData,
	IPhaseAttendeeData,
	IPhasePaginatedData
} from '../interfaces/IPhase'
import {
	IPhaseGroup, 
	IPhaseGroupData,
	IPhaseGroupEventData,
} from '../interfaces/IPhaseGroup'
import {IGGSet, IGGSetOptions} from '../interfaces/IGGSet'
import {IAttendee, IAttendeeOptions} from '../interfaces/IAttendee'
import {IEntrant, IEntrantData, IEntrantOptions} from '../interfaces/IEntrant'
import {ISeed, ISeedData, ISeedOptions} from '../interfaces/ISeed'

import {Seed} from './Seed'
import {GGSet} from './GGSet'
import {Attendee} from './Attendee'
import {Entrant} from './Entrant'
import {PhaseGroup} from './PhaseGroup'

export class Phase implements IPhase{

	public static parse(data: IPhaseData, eventId: number = -1): IPhase {
		return new Phase(
			data.id,
			eventId || -1,
			data.name,
			data.numSeeds,
			data.groupCount
		)
	}

	public static async get(theId: number, eventId: number): Promise<IPhase> {
		log.info('Getting Phase with id %s and event id %s', theId, eventId)
		const data: IPhaseDataFull = await NI.query(queries.phase, {id: theId})
		return Phase.parse(data.phase, eventId)
	}

	private id: number
	private eventId: number
	private name: string
	private numSeeds: number
	private groupCount: number

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

	public getId(): number{
		return this.id
	}

	public getEventId(): number{
		return this.eventId
	}

	public getName(): string{
		return this.name
	}

	public getNumSeeds(): number{
		return this.numSeeds
	}

	public getGroupCount(): number{
		return this.groupCount
	}

	public async getPhaseGroups2(): Promise<IPhaseGroup[]> {
		log.info('Getting phase groups for phase %s', this.id)
		const data: IPhaseGroupEventData = await NI.query(queries.phasePhaseGroups2, {eventId: this.eventId})
		const phaseGroupData: IPhaseGroupData[] = 
			data.event.phaseGroups.filter(pgData => pgData.phase.id === this.id)
		const phaseGroups: IPhaseGroup[] = phaseGroupData.map(pg => PhaseGroup.parse(pg))
		return phaseGroups
	}

	public async getPhaseGroups(): Promise<IPhaseGroup[]> {
		log.info('Getting phase groups for phase %s', this.id)
		const data: IPhasePaginatedData = await NI.query(queries.phasePhaseGroups, {id: this.id})
		const phaseGroupData: IPhaseGroupData[] =
			data.phase.phaseGroups.nodes.filter(pgData => pgData.phase.id === this.id)
		const phaseGroups: IPhaseGroup[] = phaseGroupData.map(pg => PhaseGroup.parse(pg))
		return phaseGroups
	}

	public async getSeeds(options: ISeedOptions): Promise<ISeed[]> {
		log.info('Getting seeds for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		const pgs = await this.getPhaseGroups()
		const seeds = await NI.clusterQuery(pgs, 'getSeeds', options)
		return _.uniqBy(_.flatten(seeds), 'id')
	}

	public async getEntrants(options: IEntrantOptions = Entrant.getDefaultEntrantOptions()): Promise<IEntrant[]> {
		log.info('Getting entrants for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		const pgs = await this.getPhaseGroups()
		const entrants = await NI.clusterQuery(pgs, 'getEntrants', options)
		return _.uniqBy(_.flatten(entrants), 'id')
	}

	public async getAttendees(options: IAttendeeOptions = Attendee.getDefaultAttendeeOptions()): Promise<IAttendee[]> {
		log.info('Getting attendees for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		const pgs = await this.getPhaseGroups()
		const attendees = await NI.clusterQuery(pgs, 'getAttendees', options)
		return _.uniqBy(_.flatten(attendees), 'id')
	}

	public async getSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()): Promise<IGGSet[]> {
		log.info('Getting sets for phase %s', this.id)

		// get all phase group objects, then promise all over the array pf phase groups
		// getting their respective sets for time efficiency
		const pgs = await this.getPhaseGroups()
		const pgSets = await NI.clusterQuery(pgs, 'getSets', options)
		return _.uniqBy(_.flatten(pgSets), 'id')
	}

	// alternatives
	public async getSeeds2(options: ISeedOptions): Promise<ISeed[]> {
		log.info('Getting seeds for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		const data: IPhaseSeedData[] = await NI.paginatedQuery(
			`Phase Seeds [${this.id}]`, 
			queries.phaseSeeds, {id: this.id},
			options, {}, 2
		)
		const seedData: ISeedData[] = 
			_.flatten(data.map(results => results.phase.paginatedSeeds.nodes)).filter(seed => seed != null)
		const seeds = seedData.map( (sData: ISeedData) => Seed.parse(sData) )
		return _.uniqBy(seeds, 'id')
	}

	public async getEntrants2(
		options: IEntrantOptions = Entrant.getDefaultEntrantOptions()
	): Promise<IEntrant[]> {
		log.info('Getting entrants for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		const data: IPhaseEntrantData[] = await NI.paginatedQuery(
			`Phase Entrants [${this.id}]`, 
			queries.phaseEntrants, {id: this.id}, 
			options, {}, 2
		)
		const entrantData: IEntrantData[] = 
			_.flatten(
				data.map(eData => eData.phase.paginatedSeeds.nodes )
			).filter(entrant => entrant != null)
		
		const entrants: IEntrant[] = 
			entrantData.map((e: IEntrantData) => Entrant.parse(e)) as IEntrant[]

		return _.uniqBy(entrants, 'id')
	}

	public async getAttendees2(
		options: IAttendeeOptions = Attendee.getDefaultAttendeeOptions()
	): Promise<IAttendee[]> {
		log.info('Getting attendees for phase %s', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))

		const data: IPhaseAttendeeData[] = await NI.paginatedQuery(
			`Phase Attendees [${this.id}]`,
			queries.phaseAttendees, {id: this.id},
			options, {}, 3
		)
		const seeds = _.flatten(data.map(seed => seed.phase.paginatedSeeds))
		const nodes = _.flatten(seeds.map(seed => seed.nodes))
		const entrants = nodes.map(node => node.entrant)
		const participants = 
			_.flatten(entrants.map(entrant => entrant.participants)).filter(participant => participant != null)
		const attendees = participants.map(participant => Attendee.parse(participant))
		return _.uniqBy(attendees, 'id')
	}

	public async getIncompleteSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()): Promise<IGGSet[]> {
		return GGSet.filterForIncompleteSets(await this.getSets(options))
	}

	public async getCompleteSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()): Promise<IGGSet[]> {
		return GGSet.filterForCompleteSets(await this.getSets(options))
	}

	public async getSetsXMinutesBack(
		minutesBack: number,
		options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]> {
		return GGSet.filterForXMinutesBack(await this.getSets(options), minutesBack)
	}
}
