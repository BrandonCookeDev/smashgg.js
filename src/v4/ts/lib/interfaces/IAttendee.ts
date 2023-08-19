import {IPhaseGroup, IPhaseGroupData} from './IPhaseGroup'
import {IPhase, IPhaseData} from './IPhase'
import {IContactInfo} from './IContactInfo'
import {IUser} from './IUser'

export interface IAttendee{
	/*
	id: number
	gamerTag: string,
	prefix: string | null
	createdAt: number | null
	claimed: boolean | null
	verified: boolean | null
	playerId: number | null
	phoneNumber: number | null
	contactInfo: ContactInfo | null
	connectedAccounts: object | null
	*/
	
	getId(): number
	getGamerTag(): string
	getSponsor(): string | null
	getCreatedAt(): number | null
	getClaimed(): boolean | null
	getVerified(): boolean | null
	getPlayerId(): number | null
	getPhoneNumber(): number | null
	getContactInfo(): IContactInfo | null
	getCity(): string | null
	getState(): string | null
	getStateId(): number | null
	getCountry(): string | null
	getCountryId(): number | null
	getContactName(): string | null
	getFirstName(): string | null
	getLastName(): string | null
	getZipcode(): string | null
	getConnectedAccounts(): object | null

	// getEvents(): Promise<IEvent[]>
	getUserAccount(): Promise<IUser>
	getEnteredPhases(): Promise<IPhase[]>
	getEnteredPhaseGroups(): Promise<IPhaseGroup[]>

}

export interface IAttendeeDataFull{
	participant: IAttendeeData
}

export interface IAttendeePaginatedData{
	nodes: IAttendeeData[],
	pageInfo?: {
		totalPages: number
	}
}

export interface IAttendeeData{
	id: number
	gamerTag: string,
	prefix: string | null
	createdAt: number | null
	claimed: boolean | null
	verified: boolean | null
	playerId: number | null
	phoneNumber: number | null
	contactInfo: IContactInfo | null
	connectedAccounts: object | null
	events: Array<{id: number}>
}

export interface IAttendeeWithPhasesData{
	participant: {
		entrants: Array<{
			seeds: Array<{
				id: string
				phase: IPhaseData[]
			}>
		}>
	}
} 

export interface IAttendeeWithPhaseGroupsData{
	participant: {
		entrants: Array<{
			seeds: Array<{
				id: string
				phaseGroup: IPhaseGroupData[]
			}>
		}>
	}
}

export interface IAttendeeOptions{
	areSeedsPublished?: boolean,
	isVerified?: boolean,
	page?: number | null,
	perPage?: number | null,
	sortBy?: string | null,
	filter?: null | {
		id?: number,
		entrantName?: string,
		checkInState?: number,
		phaseGroupId?: number[],
		phaseId?: number[],
		eventId?: number,
		seach?: {
			fieldsToSearch: string[],
			searchString: string
		}
	}
}
