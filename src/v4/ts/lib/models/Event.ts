
import _ from 'lodash'
import {format} from 'util'
import { EventEmitter } from 'events'
import log from '../util/Logger'

import {
	IEvent,
	IEventData,
	IEventDataFull,
	IEventPhaseData,
	IEventPhaseGroupData,
	IEventStandings,
	IEventEntrantData,
	IEventAttendeeData,
	IEventSetData
} from '../interfaces/IEvent'
import {IPhase} from '../interfaces/IPhase'
import {IPhaseGroup} from '../interfaces/IPhaseGroup'
import {IGGSet, IGGSetOptions} from '../interfaces/IGGSet'
import {IStanding, IStandingOptions} from '../interfaces/IStanding'
import {IEntrant, IEntrantOptions} from '../interfaces/IEntrant'
import {IAttendee, IAttendeeOptions} from '../interfaces/IAttendee'

import {Phase} from './Phase'
import {PhaseGroup} from './PhaseGroup'
import {GGSet} from './GGSet'
import {Entrant} from './Entrant'
import {Attendee} from './Attendee'
import {Standing} from './Standing'

import NI from '../util/NetworkInterface'
import * as queries from '../scripts/eventQueries'

export class Event extends EventEmitter implements IEvent{

	public static parse(data: IEventData): IEvent {
		return new Event(
			data.id,
			data.name, 
			data.slug,
			data.state,
			data.startAt,
			data.numEntrants,
			data.checkInBuffer,
			data.checkInDuration,
			data.checkInEnabled,
			data.isOnline,
			data.teamNameAllowed,
			data.teamManagementDeadline
		)
	}

	public static filterDuplicates(arr: IEvent[]){
		return _.uniqBy(arr, 'id')
	}

	public static parseFull(data: IEventDataFull): IEvent {
		return Event.parse(data.event)
	}

	public static async get(tournamentSlug: string, eventSlug: string): Promise<IEvent> {
		log.info('Getting Event with tournament slug %s and event slug %s', tournamentSlug, eventSlug)
		const slug = format('tournament/%s/event/%s', tournamentSlug, eventSlug)
		
		log.debug('formatted slug: %s', slug)
		return Event.getBySlug(slug)
	}

	public static async getById(theId: number): Promise<IEvent> {
		log.info('Getting Event with id %s', theId)
		const data: IEventDataFull = await NI.query(queries.event, {id: theId})
		return Event.parseFull(data)
	}

	public static async getBySlug(theSlug: string): Promise<IEvent> {
		log.info('Getting Event with slug "%s"', theSlug)
		const data: IEventDataFull = await NI.query(queries.eventSlug, {slug: theSlug})
		return Event.parseFull(data)
	}

	private id: number 
	private name: string
	private slug: string
	private state: string | null
	private startAt: number | null
	private numEntrants: number | null
	private checkInBuffer: number | null
	private checkInDuration: number | null
	private checkInEnabled: boolean | null
	private isOnline: boolean | null
	private teamNameAllowed: boolean | null
	private teamManagementDeadline: number | null

    // SonarLint TODO: Need restructuring so we dont have as many parameters
	constructor(
		id: number ,
		name: string,
		slug: string,
		state: string | null,
		startAt: number | null,
		numEntrants: number | null,
		checkInBuffer: number | null,
		checkInDuration: number | null,
		checkInEnabled: boolean | null,
		isOnline: boolean | null,
		teamNameAllowed: boolean | null,
		teamManagementDeadline: number | null
	){
		super()
		
		this.id =  id
		this.name = name
		this.slug = slug
		this.state = state 
		this.startAt =  startAt
		this.numEntrants =  numEntrants
		this.checkInBuffer =  checkInBuffer
		this.checkInDuration = checkInDuration
		this.checkInEnabled = checkInEnabled
		this.isOnline =  isOnline
		this.teamNameAllowed =  teamNameAllowed
		this.teamManagementDeadline = teamManagementDeadline
	}

	public getId(): number{
		return this.id
	}

	public getName(): string{
		return this.name
	}

	public getSlug(): string{
		return this.slug
	}

	public getState(): string | null{
		return this.state
	}

	public getNumEntrants(): number | null{
		return this.numEntrants
	}

	public getCheckInBuffer(): number | null{
		return this.checkInBuffer
	}

	public getCheckInDuration(): number | null{
		return this.checkInDuration
	}

	public getCheckInEnabled(): boolean | null{
		return this.checkInEnabled
	}

	public getIsOnline(): boolean | null{
		return this.isOnline
	}

	public getTeamNameAllowed(): boolean | null{
		return this.teamNameAllowed
	}

	public getTeamManagementDeadline(): number | null{
		return this.teamManagementDeadline
	}

	// aggregation
	public async getPhases(): Promise<IPhase[]> {
		log.info('Getting Phases for Event [%s :: %s]', this.id, this.name)
		const data: IEventPhaseData = await NI.query(queries.eventPhases, {id: this.id})
		return data.event.phases.map(phaseData => Phase.parse(phaseData, this.id))
	}

	public async getPhaseGroups(): Promise<IPhaseGroup[]> {
		log.info('Getting Phase Groups for Event [%s :: %s]', this.id, this.name)
		const data: IEventPhaseGroupData = await NI.query(queries.eventPhaseGroups, {id: this.id})
		return data.event.phaseGroups.map(phaseGroupData => PhaseGroup.parse(phaseGroupData))
	}

	public async getStandings(
		options: IStandingOptions = Standing.getDefaultOptions()
	): Promise<IStanding[]> {
		log.info('Getting Standings for Event [%s :: %s]', this.id, this.name)
		
		const data: IEventStandings[] = await NI.paginatedQuery(
			`Event Standings: [${this.id} :: ${this.name}]`, queries.eventStandings,
			{id: this.id}, options, {}, 3)

		const events = _.flatten(data.map(d => d.event))
		const standings: IStanding[] = _.flatten(
			_.flatten(
				events.map(event => event.standings.nodes.map(standingData => Standing.parse(standingData)))
			)
		)
		_.sortBy(standings, 'placement')
		return standings
	}

	public async getEntrants(
		options: IEntrantOptions = Entrant.getDefaultEntrantOptions()
	): Promise<IEntrant[]> {
		log.info('Getting Entrants for Event [%s :: %s]', this.id, this.name)

		if(!options.areSeedsPublished)
			return this.getEntrants2(options)

		const pgs: IPhaseGroup[] = await this.getPhaseGroups()
		const entrants: IEntrant[] = await NI.clusterQuery(pgs, 'getEntrants', options)
		return _.uniqBy(_.flatten(entrants), 'id')
	}

	public async getAttendees(
		options: IAttendeeOptions = Attendee.getDefaultAttendeeOptions()
	): Promise<IAttendee[]> {
		log.info('Getting Attendees for Event [%s :: %s]', this.id, this.name)

		if(!options.areSeedsPublished){
			log.verbose('seeds are not published, getting attendees from pagination')
			return this.getAttendees2(options)
		}

		const pgs: IPhaseGroup[] = await this.getPhaseGroups()
		
		let attendees: IAttendee[] = await NI.clusterQuery(pgs, 'getAttendees', options)
		if(options.isVerified) attendees = attendees.filter(attendee => attendee.getVerified())
		return _.uniqBy(_.flatten(attendees), 'id')
	}

	public async getSets(
		options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]> {
		log.info('Getting Sets for Event [%s :: %s]', this.id, this.name)

		const pgs: IPhaseGroup[] = await this.getPhaseGroups()
		const sets: IGGSet[] = await NI.clusterQuery(pgs, 'getSets', options)
		return _.uniqBy(_.flatten(sets), 'id')
	}

	public async getEntrants2(
		options: IEntrantOptions = Entrant.getDefaultEntrantOptions()
	): Promise<IEntrant[]> {
		log.info('Getting Entrants for Event [%s :: %s]', this.id, this.name)
		const data: IEventEntrantData[] = await NI.paginatedQuery(
			`Event Entrants [${this.id} :: ${this.name}]`,
			queries.eventEntrants, {id: this.id},
			options, {}, 2
		)
		const entrantData = _.flatten(data.map(d => d.event.entrants.nodes))
		const entrants: IEntrant[] = entrantData.map(entrant => Entrant.parse(entrant))
		return _.uniqBy(entrants, 'id')
	}

	public async getAttendees2(
		options: IAttendeeOptions = Attendee.getDefaultAttendeeOptions()
	): Promise<IAttendee[]> {
		log.info('Getting Attendees for Event [%s :: %s]', this.id, this.name)
		const data: IEventAttendeeData[] = await NI.paginatedQuery(
			`Event Attendees [${this.id} :: ${this.name}]`,
			queries.eventAttendees, {id: this.id},
			options, {}, 3
		)
		const attendeeData = _.flatten(data.map(d => d.event.tournament.participants.nodes))

		let attendees: IAttendee[] = attendeeData.map(attendee => Attendee.parse(attendee))
		if(options.isVerified) attendees = attendees.filter(attendee => attendee.getVerified())
		return _.uniqBy(attendees, 'id')
	}

	public async getSets2(
		options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]> {
		log.info('Getting Sets for Event [%s :: %s]', this.id, this.name)
		const data: IEventSetData[] = await NI.paginatedQuery(
			`Event Sets [${this.id} :: ${this.name}]`,
			queries.eventSets, {id: this.id},
			options, {}, 3
		)
		const phaseGroups = _.flatten(data.map(d => d.event.phaseGroups))
		const setData = _.flatten(phaseGroups.map(pg => pg.paginatedSets.nodes))
		const sets: IGGSet[] = setData.map(set => GGSet.parse(set))
		return _.uniqBy(sets, 'id')
	}

	// need coverage
	public async getIncompleteSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]> {
		log.info('Getting Incomplete Sets for Event [%s :: %s]', this.id, this.name)
		const sets: IGGSet[] = await this.getSets(options)
		return GGSet.filterForIncompleteSets(sets)
	}

	// need coverage
	public async getCompleteSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]> {
		log.info('Getting Completed Sets for Event [%s :: %s]', this.id, this.name)
		const sets: IGGSet[] = await this.getSets(options)		
		return GGSet.filterForCompleteSets(sets)
	}

	// need coverage
	public async getSetsXMinutesBack(minutes: number, options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]> {
		log.info('Getting sets completed %s minutes ago for Event [%s :: %s]', minutes, this.id, this.name)
		const sets: IGGSet[] = await this.getSets(options)
		return GGSet.filterForXMinutesBack(sets, minutes)
	}
}
