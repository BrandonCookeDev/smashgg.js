
import {IVenue} from './IVenue'
import {IEvent, IEventData} from './IEvent'
import {IPhase, IPhaseData} from './IPhase'
import {IPhaseGroup, IPhaseGroupData} from './IPhaseGroup'
import {IEntrantData} from './IEntrant'
import {IAttendee, IAttendeePaginatedData} from './IAttendee'
import {IGGSetData} from './IGGSet'

export interface ITournament{
	// id: number
	// name: string
	// slug: string
	// startTime: Date | null
	// endTime: Date | null
	// timezone: string | null
	// venue: Venue
	
	getId(): number,
	getName(): string ,
	getSlug(): string,
	getTimezone(): string | null,
	getStartTime(): Date | null,
	getStartTimeString(): string | null,
	getEndTime(): Date | null,
	getEndTimeString(): string | null,
	getVenue(): IVenue,
	getVenueName(): string | null,
	getCity(): string | null,
	getState(): string | null,
	getAddress(): string | null,
	getZipCode(): string | null,

	getEvents(): Promise<IEvent[]>,
	getPhases(): Promise<IPhase[]>,
	getPhaseGroups(): Promise<IPhaseGroup[]>,
	searchAttendees(smashtag: string): Promise<IAttendee[] | null>,

	// Currently not available since it does not work in start.gg
	//searchAttendeesBySponsorTag(sponsorTag: string): Promise<IAttendee[] | null>

	/*
	getSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
	getIncompleteSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
	getCompletedSets(options: IGGSet.SetOptions) : Promise<GGSet[]>
	getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions) : Promise<GGSet[]>
	getEntrants(options: IEntrant.EntrantOptions) : Promise<Entrant[]>
	getAttendees(options: IAttendee.AttendeeOptions) : Promise<Attendee[]> 
	*/
}

export interface ITournamentDataFull{
	tournament: ITournamentData
}

export interface ITournamentData{
	id: number
	name: string
	slug: string
	city: string | null
	postalCode: string | null
	addrState: string | null
	countryCode: string | null
	venueAddress: string | null
	venueName: string | null
	lat: number | null
	lng: number | null
	timezone: string | null
	startAt: number | null
	endAt: number | null
}

export interface ITournamentEventData{
	tournament: {
		events: IEventData[]
	}
}

export interface ITournamentPhaseData{
	tournament: {
		events: Array<{
			id: number,
			phases: IPhaseData[]
		}>
	}
}

export interface ITournamentPhaseGroupData{
	tournament: {
		events: Array<{
			id: number,
			phaseGroups: IPhaseGroupData[]
		}>
	}
}

export interface ITournamentAttendeeData{
	tournament: {
		participants: IAttendeePaginatedData[]
	}
}

export interface ITournamentEntrantData{
	tournament: {
		events: Array<{
			entrant: IEntrantData[]
		}>
	}
}

export interface ITournamentSetData{
	tournament: {
		events: Array<{
			phaseGroups: Array<{
				paginatedSets: {
					pageInfo?: {
						totalPages: number 
					},
					nodes: IGGSetData[]
				}
			}>
		}>
	}
}
