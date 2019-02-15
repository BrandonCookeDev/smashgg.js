
import _ from 'lodash'
import { EventEmitter } from 'events'
import log from './util/Logger'

import {Phase, IPhase} from './Phase'
import {PhaseGroup, IPhaseGroup} from './PhaseGroup'
import {GGSet, IGGSet} from './GGSet'
import {Entrant, IEntrant} from './Entrant'
import {Attendee, IAttendee} from './Attendee';

import NI from './util/NetworkInterface'
import * as queries from './scripts/eventQueries'

export class Event extends EventEmitter implements IEvent.Event{

	id: number 
	name: string
	slug: string
	state: string | null
	startAt: number | null
	numEntrants: number | null
	checkInBuffer: number | null
	checkInDuration: number | null
	checkInEnabled: boolean | null
	isOnline: boolean | null
	teamNameAllowed: boolean | null
	teamManagementDeadline: number | null

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
		super();
		
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

	static parse(data: IEvent.EventData) : Event {
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

	static parseFull(data: IEvent.Data) : Event {
		return Event.parse(data.event);
	}

	static async get(id: number)  : Promise<Event> {
		log.info('Getting Event with id %s', id)
		let data: IEvent.Data = await NI.query(queries.event, {id: id})
		return Event.parseFull(data)
	}

	static async getBySlug(slug: string) : Promise<Event> {
		log.info('Getting Event with slug "%s"', slug)
		let data: IEvent.Data = await NI.query(queries.eventSlug, {slug: slug})
		return Event.parseFull(data)
	}

	getId() : number{
		return this.id
	}

	getName() : string{
		return this.name
	}

	getSlug() : string{
		return this.slug
	}

	getState() : string | null{
		return this.state
	}

	getNumEntrants() : number | null{
		return this.numEntrants
	}

	getCheckInBuffer() : number | null{
		return this.checkInBuffer
	}

	getCheckInDuration() : number | null{
		return this.checkInDuration
	}

	getCheckInEnabled() : boolean | null{
		return this.checkInEnabled
	}

	getIsOnline() : boolean | null{
		return this.isOnline
	}

	getTeamNameAllowed() : boolean | null{
		return this.teamNameAllowed
	}

	getTeamManagementDeadline() : number | null{
		return this.teamManagementDeadline
	}

	// aggregation
	async getPhases() : Promise<Phase[]> {
		log.info('Getting Phases for Event [%s :: %s]', this.id, this.name);
		let data: IEvent.EventPhaseData = await NI.query(queries.eventPhases, {id: this.id});
		return data.event.phases.map(phaseData => Phase.parse(phaseData, this.id));
	}

	async getPhaseGroups() : Promise<PhaseGroup[]> {
		log.info('Getting Phase Groups for Event [%s :: %s]', this.id, this.name)
		let data: IEvent.EventPhaseGroupData = await NI.query(queries.eventPhaseGroups, {id: this.id})
		return data.event.phaseGroups.map(phaseGroupData => PhaseGroup.parse(phaseGroupData))
	}

	async getEntrants(options: IEntrant.EntrantOptions = IEntrant.getDefaultEntrantOptions()) : Promise<Entrant[]> {
		log.info('Getting Entrants for Event [%s :: %s]', this.id, this.name)
		let data: IEvent.EventEntrantData[] = await NI.paginatedQuery(
			`Event Entrants [${this.id} :: ${this.name}]`,
			queries.eventEntrants, {id: this.id},
			options, {}, 2
		)
		let entrantData = _.flatten(data.map(d => d.event.entrants.nodes))
		let entrants = entrantData.map(entrant => Entrant.parse(entrant))
		return entrants
	}

	async getAttendees(options: IAttendee.AttendeeOptions = IAttendee.getDefaultAttendeeOptions()) : Promise<Attendee[]> {
		log.info('Getting Attendees for Event [%s :: %s]', this.id, this.name)
		let data: IEvent.EventEntrantData[] = await NI.paginatedQuery(
			`Event Attendees [${this.id} :: ${this.name}]`,
			queries.eventAttendees, {id: this.id},
			options, {}, 3
		)
		let entrantData = _.flatten(data.map(d => d.event.entrants.nodes))
		let attendeeData = _.flatten(entrantData.map(entrant => entrant.participants))
		let attendees = attendeeData.map(attendee => Attendee.parse(attendee))
		return attendees
	}

	async getSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Sets for Event [%s :: %s]', this.id, this.name)
		let data: IEvent.EventSetData[] = await NI.paginatedQuery(
			`Event Sets [${this.id} :: ${this.name}]`,
			queries.eventSets, {id: this.id},
			options, {}, 3
		)
		let phaseGroups = _.flatten(data.map(d => d.event.phaseGroups))
		let setData = _.flatten(phaseGroups.map(pg => pg.paginatedSets.nodes))
		let sets = setData.map(set => GGSet.parse(set))
		return sets
	}

	// need coverage
	async getIncompleteSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Incomplete Sets for Event [%s :: %s]', this.id, this.name)
		let sets = await this.getSets(options)
		return GGSet.filterForIncompleteSets(sets)
	}

	// need coverage
	async getCompleteSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Completed Sets for Event [%s :: %s]', this.id, this.name)
		let sets = await this.getSets(options)		
		return GGSet.filterForCompleteSets(sets)
	}

	// need coverage
	async getSetsXMinutesBack(minutes: number, options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting sets completed %s minutes ago for Event [%s :: %s]', minutes, this.id, this.name)
		let sets = await this.getSets(options)
		return GGSet.filterForXMinutesBack(sets, minutes);
	}
}


export namespace IEvent{
	export interface Event{
		id: number 
		name: string
		slug: string
		state: string | null
		startAt: number | null
		numEntrants: number | null
		checkInBuffer: number | null
		checkInDuration: number | null
		checkInEnabled: boolean | null
		isOnline: boolean | null
		teamNameAllowed: boolean | null
		teamManagementDeadline: number | null
	
		getId() : number
		getName() : string
		getSlug() : string
		getState() : string | null
		getNumEntrants() : number | null
		getCheckInBuffer() : number | null
		getCheckInDuration() : number | null
		getCheckInEnabled() : boolean | null
		getIsOnline() : boolean | null
		getTeamNameAllowed() : boolean | null
		getTeamManagementDeadline() : number | null

		getPhases() : Promise<Phase[]>
		getPhaseGroups() : Promise<PhaseGroup[]>
		getEntrants(options: IEntrant.EntrantOptions) : Promise<Entrant[]>
		getAttendees(options: IAttendee.AttendeeOptions) : Promise<Attendee[]>
		getSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getIncompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getCompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions) : Promise<GGSet[]> 
	}

	export interface Data{
		event: EventData
	}
	
	export interface EventData{
		id: number 
		name: string
		slug: string
		state: string | null
		startAt: number | null
		numEntrants: number | null
		checkInBuffer: number | null
		checkInDuration: number | null
		checkInEnabled: boolean | null
		isOnline: boolean | null
		teamNameAllowed: boolean | null
		teamManagementDeadline: number | null
	}

	export interface EventPhaseData{
		event:{
			phases: IPhase.PhaseData[]
		}
	}

	export interface EventPhaseGroupData{
		event:{
			phaseGroups: IPhaseGroup.PhaseGroupData[]
		}
	}

	export interface EventEntrantData{
		event:{
			entrants:{
				pageInfo?: {
					totalPages: number
				},
				nodes: IEntrant.EntrantData[]
			}
		}
	}

	export interface EventAttendeeData{
		event:{
			entrants:{
				pageInfo?: {
					totalPages: number
				},
				nodes: IAttendee.AttendeeData[]
			}
		}
	}

	export interface EventSetData{
		event:{
			phaseGroups:{
				paginatedSets:{
					pageInfo?:{
						totalPages: number
					},
					nodes: IGGSet.SetData[]
				}
			}
		}
	}
}
