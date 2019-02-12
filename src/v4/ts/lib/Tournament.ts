
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
import PaginatedQuery from './util/PaginatedQuery'
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

	static async get(id: number) : Promise<Tournament> {
		log.info('Getting Tournament with id %s', id)
		let data: ITournament.Data = await NI.query(queries.tournament, {id: id});
		return Tournament.parseFull(data)
	}

	static async getBySlug(slug: string) : Promise<Tournament> {
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

		getSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getEvents() : Promise<Event[]>
		getPhases() : Promise<Phase[]>
		getPhaseGroups() : Promise<PhaseGroup[]>
		getIncompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getCompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions) : Promise<GGSet[]>
		getEntrants(options: IEntrant.EntrantOptions) : Promise<Entrant[]>
		getAttendees(options: IAttendee.AttendeeOptions) : Promise<Attendee[]> 
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

}
