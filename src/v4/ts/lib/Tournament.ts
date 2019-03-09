import _ from 'lodash'
import moment from 'moment'
import log from './util/Logger'

import {Venue} from './Venue'
import {Organizer} from './Oraganizer'
import {Event, IEvent} from './Event'
import {Phase, IPhase} from './Phase'
import {PhaseGroup, IPhaseGroup} from './PhaseGroup'
import {User, IUser} from './User'
import {Entrant, IEntrant} from './Entrant'
import {Attendee, IAttendee} from './Attendee'
import {GGSet, IGGSet} from './GGSet'

import NI from './util/NetworkInterface'
import * as queries from './scripts/tournamentQueries'

export class Tournament implements ITournament.Tournament{

	id: number
	name: string
	slug: string
	startTime: Date | null
	endTime: Date | null
	timezone: string | null
	venue: Venue
	organizer: Organizer

	constructor(
		id: number,
		name: string,
		slug: string,
		startTime: Date | null,
		endTime: Date | null,
		timezone: string | null,
		venue: Venue,
		organizer: Organizer
	){
		this.id = id;
		this.name = name;
		this.slug = slug;
		this.startTime = startTime;
		this.endTime = endTime;
		this.timezone = timezone;
		this.venue = venue;
		this.organizer = organizer;
	}
	
	static parse(data: ITournament.TournamentData) : Tournament{
		let startTimeDate =  data.startAt ? moment.unix(data.startAt!).toDate() : null
		let endTimeDate = data.endAt ? moment.unix(data.endAt!).toDate() : null

		let venue = new Venue(
			data.venueName, data.venueAddress, data.city,
			data.addrState, data.countryCode, data.region,
			data.postalCode, data.lat, data.lng
		)
		
		let organizer = new Organizer(
			data.ownerId, data.contactEmail, data.contactPhone,
			data.contactTwitter, data.contactInfo
		)

		return new Tournament(
			data.id, data.name, data.slug,
			startTimeDate, endTimeDate, data.timezone,
			venue, organizer
		)
	}

	static parseFull(data: ITournament.Data) : Tournament{
		return Tournament.parse(data.tournament)
	}

	static async getById(id: number) : Promise<Tournament> {
		log.info('Getting Tournament with id %s', id)
		let data: ITournament.Data = await NI.query(queries.tournament, {id: id});
		return Tournament.parseFull(data)
	}

	static async get(slug: string) : Promise<Tournament> {
		log.info('Getting Tournament with slug "%s"', slug)
		let data: ITournament.Data = await NI.query(queries.tournamentBySlug, {slug: slug});
		return Tournament.parseFull(data)
	}

	getId() : number {
		return this.id
	}

	getName() : string  {
		return this.name
	}

	getSlug() : string {
		return this.slug
	}

	getTimezone() : string | null {
		return this.timezone
	}

	getStartTime() : Date | null {
		return this.startTime
	}

	getStartTimeString() : string | null {
		return String(this.startTime)
	}

	getEndTime() : Date | null {
		return this.endTime
	}

	getEndTimeString() : string | null {
		return String(this.endTime)
	}

	getVenue() : Venue {
		return this.venue
	}

	getVenueName() : string | null {
		return this.venue.getName()
	}

	getCity() : string | null {
		return this.venue.getCity()
	}

	getState() : string | null{
		return this.venue.getState()
	}

	getAddress() : string | null {
		return this.venue.getAddress()
	}

	getZipCode() : string | null {
		return this.venue.getPostalCode()
	}

	getOrganizer() : Organizer {
		return this.organizer
	}

	getContactInfo() : string | null {
		return this.organizer.getInfo()
	}

	getContactEmail() : string | null {
		return this.organizer.getEmail()
	}

	getContactTwitter() : string | null {
		return this.organizer.getTwitter()
	}

	getOwnerId() : number | null {
		return this.organizer.getId()
	}

	async getEvents() : Promise<Event[]> {
		log.info('Getting Events for Tournament [%s :: %s]', this.id, this.name)
		let data: ITournament.TournamentEventData = await NI.query(queries.tournamentEvents, {id: this.id})
		let events = data.tournament.events.map(event => Event.parse(event))
		return events;
	}

	async getPhases() : Promise<Phase[]> {
		log.info('Getting Phases for Tournament [%s :: %s]', this.id, this.name)
		let data: ITournament.TournamentPhaseData = await NI.query(queries.tournamentPhases, {id: this.id})
		let events = data.tournament.events
		let phases: Phase[] = _.flatten(events.map(event => event.phases.map(phase => Phase.parse(phase, event.id))))
		return phases;		
	}

	async getPhaseGroups() : Promise<PhaseGroup[]> {
		log.info('Getting Phase Groups for Tournament [%s :: %s]', this.id, this.name)
		let data: ITournament.TournamentPhaseGroupData = await NI.query(queries.tournamentPhaseGroups, {id: this.id})
		let events = data.tournament.events
		let phaseGroups: PhaseGroup[] = _.flatten(events.map(event => event.phaseGroups.map(group => PhaseGroup.parse(group))))
		return phaseGroups
	}

	/*
	async getSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Sets for Tournament [%s :: %s]', this.id, this.name)

		let pgs = await this.getPhaseGroups()
		let sets = await NI.clusterQuery(pgs, 'getSets', options)
		return _.flatten(sets)
	}

	async getEntrants(options: IEntrant.EntrantOptions = IEntrant.getDefaultEntrantOptions()) : Promise<Entrant[]> {
		log.info('Getting Entrants for Tournament [%s :: %s]', this.id, this.name)

		let pgs = await this.getPhaseGroups()
		let entrants = await NI.clusterQuery(pgs, 'getEntrants', options)
		return _.flatten(entrants)
	}

	async getAttendees(options: IAttendee.AttendeeOptions = IAttendee.getDefaultAttendeeOptions()) : Promise<Attendee[]> {
		log.info('Getting Attendees for Tournament [%s :: %s]', this.id, this.name)

		let pgs = await this.getPhaseGroups()
		let attendees = await NI.clusterQuery(pgs, 'getAttendees', options)
		return _.flatten(attendees)
	}

	async getSets2(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Sets for Tournament [%s :: %s]', this.id, this.name)
		let data: ITournament.TournamentSetData[] = await NI.paginatedQuery(
			`Tournament Sets [${this.id} :: ${this.name}]`,
			queries.tournamentSets, {id: this.id},
			options, {}, 4
		)
		let events = _.flatten(data.map(d => d.tournament.events))
		let phaseGroups = _.flatten(events.map(event => event.phaseGroups))
		let setData: IGGSet.SetData[] = _.flatten(phaseGroups.map(pg => pg.paginatedSets.nodes)) 
		let sets: GGSet[] = setData.map(set => GGSet.parse(set))
		return sets	
	}

	async getIncompleteSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Incomplete Sets for Tournament [%s :: %s]', this.id, this.name)
		let sets: GGSet[] = await this.getSets()
		return GGSet.filterForIncompleteSets(sets)
	}

	async getCompletedSets(options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Completed Sets for Tournament [%s :: %s]', this.id, this.name)
		let sets: GGSet[] = await this.getSets()
		return GGSet.filterForCompleteSets(sets)
	}

	async getSetsXMinutesBack(minutes: number, options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()) : Promise<GGSet[]> {
		log.info('Getting Sets Completed %s minutes ago for Tournament [%s :: %s]', minutes, this.id, this.name)
		let sets: GGSet[] = await this.getSets()
		return GGSet.filterForXMinutesBack(sets, minutes)
	}

	async getEntrants2(options: IEntrant.EntrantOptions = IEntrant.getDefaultEntrantOptions()) : Promise<Entrant[]> {
		log.info('Getting Entrants for Tournament [%s :: %s]', this.id, this.name)
		let data: ITournament.TournamentEntrantData[] = await NI.paginatedQuery(
			`Tournament Entrants [${this.id} :: ${this.name}]`,
			queries.tournamentEntrants, {id: this.id},
			options, {}, 3
		)
		let tournaments = _.flatten(data.map(d => d.tournament))
		let events = _.flatten(tournaments.map(tournament => tournament.events))
		let entrantData: IEntrant.EntrantData[] = _.flatten(events.map(event => event.entrant))
		let entrants: Entrant[] = entrantData.map(entrant => Entrant.parse(entrant))
		return entrants
	}

	async getAttendees2(options: IAttendee.AttendeeOptions = IAttendee.getDefaultAttendeeOptions()) : Promise<Attendee[]> {
		log.info('Getting Attendees for Tournament [%s :: %s]', this.id, this.name)
		let data: ITournament.TournamentAttendeeData[] = await NI.paginatedQuery(
			`Tournament Attendee [${this.id} :: ${this.name}]`,
			queries.tournamentAttendees, {id: this.id},
			options, {}, 3
		)
		let tournaments = _.flatten(data.map(d => d.tournament))
		let attendeeData: IAttendee.AttendeeData[] = _.flatten(tournaments.map(tournament => tournament.participants))
		let attendees: Attendee[] = attendeeData.map(attendee => Attendee.parse(attendee))
		return attendees;
	}
	*/
	
}

export namespace ITournament{
	export interface Tournament{
		id: number
		name: string
		slug: string
		startTime: Date | null
		endTime: Date | null
		timezone: string | null
		venue: Venue
		organizer: Organizer
		
		getId() : number
		getName() : string 
		getSlug() : string
		getTimezone() : string | null
		getStartTime() : Date | null
		getStartTimeString() : string | null
		getEndTime() : Date | null
		getEndTimeString() : string | null
		getVenue() : Venue
		getVenueName() : string | null
		getCity() : string | null
		getState() : string | null
		getAddress() : string | null
		getZipCode() : string | null
		getOrganizer() : Organizer
		getContactInfo() : string | null
		getContactEmail() : string | null
		getContactTwitter() : string | null
		getOwnerId() : number | null

		getEvents() : Promise<Event[]>
		getPhases() : Promise<Phase[]>
		getPhaseGroups() : Promise<PhaseGroup[]>

		/*
		getSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getIncompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getCompletedSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions) : Promise<GGSet[]>
		getEntrants(options: IEntrant.EntrantOptions) : Promise<Entrant[]>
		getAttendees(options: IAttendee.AttendeeOptions) : Promise<Attendee[]> 
		*/
	}

	export interface Data{
		tournament: TournamentData
	}

	export interface TournamentData{
		id: number
		name: string
		slug: string
		city: string | null
		postalCode: string | null
		addrState: string | null
		countryCode: string | null
		region: string | null
		venueAddress: string | null
		venueName: string | null
		gettingThere: string | null
		lat: number | null
		lng: number | null
		timezone: string | null
		startAt: number | null
		endAt: number | null
		contactInfo: string | null
		contactEmail: string | null
		contactTwitter: string | null
		contactPhone: string | null
		ownerId: number | null
	}

	export interface TournamentEventData{
		tournament: {
			events: IEvent.EventData[]
		}
	}

	export interface TournamentPhaseData{
		tournament: {
			events: {
				id: number,
				phases: IPhase.PhaseData[]
			}[]
		}
	}

	export interface TournamentPhaseGroupData{
		tournament: {
			events: {
				id: number,
				phaseGroups: IPhaseGroup.PhaseGroup[]
			}[]
		}
	}

	export interface TournamentAttendeeData{
		tournament: {
			participants: IAttendee.AttendeeData[]
		}
	}

	export interface TournamentEntrantData{
		tournament: {
			events: {
				entrant: IEntrant.EntrantData[]
			}[]
		}
	}

	export interface TournamentSetData{
		tournament: {
			events:{
				phaseGroups:{
					paginatedSets: {
						pageInfo?:{
							totalPages: number 
						},
						nodes: IGGSet.SetData[]
					}
				}[]
			}[]
		}
	}
}
