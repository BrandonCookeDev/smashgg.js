import _ from 'lodash'
import moment from 'moment'
import log from '../util/Logger'
import NI from '../util/NetworkInterface'
import * as queries from '../scripts/tournamentQueries'

import {
	ITournament,
	ITournamentData,
	ITournamentDataFull,
	ITournamentEventData,
	ITournamentPhaseData,
	ITournamentPhaseGroupData,
	ITournamentAttendeeData
} from '../interfaces/ITournament'
import {IVenue} from '../interfaces/IVenue'
import {IEvent} from '../interfaces/IEvent'
import {IPhase} from '../interfaces/IPhase'
import {IPhaseGroup} from '../interfaces/IPhaseGroup'
import {IGGSet, IGGSetOptions} from '../interfaces/IGGSet'
import {IEntrant, IEntrantOptions} from '../interfaces/IEntrant'
import {IAttendee, IAttendeeOptions, IAttendeeData, IAttendeePaginatedData} from '../interfaces/IAttendee'

import {Venue} from './Venue'
import {Event} from './Event'
import {Phase} from './Phase'
import {PhaseGroup} from './PhaseGroup'
import {Entrant} from './Entrant'
import {Attendee} from './Attendee'
import {GGSet} from './GGSet'

export class Tournament implements ITournament{
	
	public static parse(data: ITournamentData): ITournament{
		const startTimeDate =  data.startAt ? moment.unix(data.startAt).toDate() : null
		const endTimeDate = data.endAt ? moment.unix(data.endAt).toDate() : null

		const venue = new Venue(
			data.venueName, data.venueAddress, data.city,
			data.addrState, data.countryCode,
			data.postalCode, data.lat, data.lng
		)

		return new Tournament(
			data.id, data.name, data.slug,
			startTimeDate, endTimeDate, data.timezone,
			venue
		)
	}

	public static parseFull(data: ITournamentDataFull): ITournament{
		return Tournament.parse(data.tournament)
	}

	public static async getById(theId: number): Promise<ITournament> {
		log.info('Getting Tournament with id %s', theId)
		const data: ITournamentDataFull = await NI.query(queries.tournament, {id: theId})
		return Tournament.parseFull(data)
	}

	public static async get(theSlug: string): Promise<ITournament> {
		log.info('Getting Tournament with slug "%s"', theSlug)
		const data: ITournamentDataFull = await NI.query(queries.tournamentBySlug, {slug: theSlug})
		return Tournament.parseFull(data)
	}

	private id: number
	private name: string
	private slug: string
	private startTime: Date | null
	private endTime: Date | null
	private timezone: string | null
	private venue: IVenue

	constructor(
		id: number,
		name: string,
		slug: string,
		startTime: Date | null,
		endTime: Date | null,
		timezone: string | null,
		venue: IVenue
	){
		this.id = id
		this.name = name
		this.slug = slug
		this.startTime = startTime
		this.endTime = endTime
		this.timezone = timezone
		this.venue = venue
	}

	public getId(): number {
		return this.id
	}

	public getName(): string  {
		return this.name
	}

	public getSlug(): string {
		return this.slug
	}

	public getTimezone(): string | null {
		return this.timezone
	}

	public getStartTime(): Date | null {
		return this.startTime
	}

	public getStartTimeString(): string | null {
		return String(this.startTime)
	}

	public getEndTime(): Date | null {
		return this.endTime
	}

	public getEndTimeString(): string | null {
		return String(this.endTime)
	}

	public getVenue(): IVenue {
		return this.venue
	}

	public getVenueName(): string | null {
		return this.venue.getName()
	}

	public getCity(): string | null {
		return this.venue.getCity()
	}

	public getState(): string | null{
		return this.venue.getState()
	}

	public getAddress(): string | null {
		return this.venue.getAddress()
	}

	public getZipCode(): string | null {
		return this.venue.getPostalCode()
	}

	public async getEvents(): Promise<IEvent[]> {
		log.info('Getting Events for Tournament [%s :: %s]', this.id, this.name)
		const data: ITournamentEventData = await NI.query(queries.tournamentEvents, {id: this.id})
		const events = data.tournament.events.map(event => Event.parse(event))
		return events
	}

	public async getPhases(): Promise<IPhase[]> {
		log.info('Getting Phases for Tournament [%s :: %s]', this.id, this.name)
		const data: ITournamentPhaseData = await NI.query(queries.tournamentPhases, {id: this.id})
		const events = data.tournament.events
		const phases: IPhase[] = _.flatten(events.map(event => event.phases.map(phase => Phase.parse(phase, event.id))))
		return phases
	}

	public async getPhaseGroups(): Promise<IPhaseGroup[]> {
		log.info('Getting Phase Groups for Tournament [%s :: %s]', this.id, this.name)
		const data: ITournamentPhaseGroupData = await NI.query(queries.tournamentPhaseGroups, {id: this.id})
		const events = data.tournament.events
		const phaseGroups: IPhaseGroup[] = 
			_.flatten(events.map(event => event.phaseGroups.map(group => PhaseGroup.parse(group))))
		return phaseGroups
	}
	
	public async getSets(
		options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]> {
		log.info('Getting Sets for Tournament [%s :: %s]', this.id, this.name)

		log.warn(
			'Puilling Sets for large or massive Tournaments may ' +
			'lead to long execution times and lowered usability. It ' +
			'is recommended to pull from Event if you are targetting ' +
			'a single event\'s Sets')

		const pgs = await this.getPhaseGroups()
		const sets = await NI.clusterQuery(pgs, 'getSets', options)
		return _.uniqBy(_.flatten(sets), 'id')
	}

	public async getEntrants(
		options: IEntrantOptions = Entrant.getDefaultEntrantOptions()
	): Promise<IEntrant[]> {
		log.info('Getting Entrants for Tournament [%s :: %s]', this.id, this.name)

		log.warn(
			'Puilling Entrants for large or massive Tournaments may ' +
			'lead to long execution times and lowered usability. It is ' + 
			'recommended to pull from Event if you are targetting a ' +
			'single event\'s Entrants')
		
		const pgs = await this.getPhaseGroups()
		
		let entrants = await NI.clusterQuery(pgs, 'getEntrants', options)
		entrants = _.uniq(entrants)
		return _.uniqBy(_.flatten(entrants), 'id')
	}

	public async getAttendees2(
		options: IAttendeeOptions = Attendee.getDefaultAttendeeOptions()
	): Promise<IAttendee[]> {
		log.info('Getting Attendees for Tournament [%s :: %s]', this.id, this.name)

		log.warn(
			'Puilling Attendees for large or massive Tournaments may ' +
			'lead to long execution times and lowered usability. It is ' +
			'recommended to pull from Event if you are targetting a ' +
			'single event\'s Attendees')
		
		if(options.page != null)
			return await this.getAttendees(options)
		
		const pgs = await this.getPhaseGroups()

		let attendees = await NI.clusterQuery(pgs, 'getAttendees', options)
		attendees = _.uniqWith(attendees, (a1: Attendee, a2: Attendee) => Attendee.eq(a1, a2))
		return _.uniqBy(_.flatten(attendees), 'id')
	}

	public async searchAttendees(theSmashtag: string): Promise<IAttendee[] | null>{
		log.info('Searching Tournament [%s :: %s] with smashtag: %s', this.id, this.name, theSmashtag)

		const results = await NI.query(queries.tournamentAttendeeSearch, {id: this.id, smashtag: theSmashtag})
		try{
			const nodes: IAttendeeData[] = results.tournament.participants.nodes
			if(nodes.length === 0) {
			    console.log("No attendees found")
				return null
			}
		    const matchingAttendees: IAttendee[] = nodes.map((element: IAttendeeData) => Attendee.parse(element))
			return _.uniqBy(matchingAttendees, 'id')
		} catch {
		    console.log("Error found when searching for attendees")
			return null // bad parse, no attendee
		}
	}

// Currently does not work, even trying start.gg example returns incorrect results
// 	public async searchAttendeesBySponsorTag(sponsorTag: string): Promise<IAttendee[] | null>{
// 		log.info('Searching Tournament [%s :: %s] with smashtag: %s', this.id, this.name, sponsorTag)
//
// 		const results =
// 			await NI.query(queries.tournamentAttendeeSearchByPrefix, {id: this.id, sponsor: sponsorTag.toLowerCase()})
//
// 		try{
// 			const nodes: IAttendeeData[] = results.tournament.participants.nodes
// 			if(nodes.length === 0) {
// 				return null
// 		    }
//
// 			const matchingAttendees: IAttendee[] = nodes.map((element: IAttendeeData) => Attendee.parse(element))
// 			return _.uniqBy(matchingAttendees, 'id')
// 		} catch {
// 			return null // bad parse, no attendee
// 		}
// 	}

	/*
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

	async getSetsXMinutesBack(
		minutes: number, options: IGGSet.SetOptions = IGGSet.getDefaultSetOptions()
	): Promise<GGSet[]> {
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
	*/

	public async getAttendees(
		options: IAttendeeOptions = Attendee.getDefaultAttendeeOptions()
	): Promise<IAttendee[]> {

		// log.info('Getting Attendees for Tournament [%s :: %s]', this.id, this.name)
		const data: ITournamentAttendeeData[] = await NI.paginatedQuery(
			`Tournament Attendee [${this.id} :: ${this.name}]`,
			queries.tournamentAttendees, {id: this.id},
			options, {}, 3
		)
		
		const tournaments = _.flatten(data.map(d => d.tournament))
		const attendeeData: IAttendeePaginatedData[] = _.flatten(tournaments.map(tournament => tournament.participants))
		const attendees: IAttendee[] = 
			_.flatten(attendeeData.map(aData => aData.nodes.map(attendee => Attendee.parse(attendee))))
		return _.uniqBy(attendees, 'id')
	}
	
}
