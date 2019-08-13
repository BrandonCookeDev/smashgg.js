
import {IVenue} from './IVenue'
import {IOrganizer} from './IOrganizer'
import {IEvent, IEventData} from './IEvent'
import {IPhase, IPhaseData} from './IPhase'
import {IPhaseGroup, IPhaseGroupData} from './IPhaseGroup'
import {IEntrant, IEntrantOptions, IEntrantData} from './IEntrant'
import {IAttendee, IAttendeeOptions, IAttendeePaginatedData} from './IAttendee'
import {IGGSet, IGGSetOptions, IGGSetData} from './IGGSet'

export interface ITournament{	
	getId(): number
	getName(): string 
	getSlug(): string
	getTimezone(): string | null
	getStartTime(): Date | null
	getStartTimeString(): string | null
	getEndTime(): Date | null
	getEndTimeString(): string | null
	getVenue(): IVenue
	getVenueName(): string | null
	getCity(): string | null
	getState(): string | null
	getAddress(): string | null
	getZipCode(): string | null
	getOrganizer(): IOrganizer
	getContactInfo(): string | null
	getContactEmail(): string | null
	getContactTwitter(): string | null
	getOwnerId(): number | null

	getEvents(): Promise<IEvent[]>
	getPhases(): Promise<IPhase[]>
	getPhaseGroups(): Promise<IPhaseGroup[]>
	getSets(options?: IGGSetOptions): Promise<IGGSet[]>
	getEntrants(options?: IEntrantOptions): Promise<IEntrant[]>
	getAttendees(options?: IAttendeeOptions): Promise<IAttendee[]>
	searchAttendees(smashtag: string): Promise<IAttendee[] | null>
	searchAttendeesBySponsorTag(sponsorTag: string): Promise<IAttendee[] | null>
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
