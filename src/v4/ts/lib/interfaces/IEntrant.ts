import {IAttendee, IAttendeeData} from './IAttendee'
import {IContactInfo} from './IContactInfo'

export interface IEntrant{
	/*
	id: number,
	name: string, 
	eventId: number,
	skill: number,
	attendeeData: Attendee[]
	*/
	
	getId(): number
	getName(position: number): string | null
	getEventId(): number
	getSkill(): number
	getAttendeeData(position: number): IAttendee | IAttendee[]
	getAttendeeId(position: number): number
	getGamerTag(position: number): string
	getSponsor(position: number): string | null
	getPhoneNumber(position: number): number | null
	getContactInfo(position: number): IContactInfo | null
	getCity(position: number): string | null
	getState(position: number): string | null
	getStateId(position: number): number | null
	getCountry(position: number): string | null
	getCountryId(position: number): number | null
	getFirstName(position: number): string | null
	getLastName(position: number): string | null
	getZipcode(position: number): string | null		
	getConnectedAccounts(): object | null
}	

export interface IEntrantDataFull{
	entrant: IEntrantData
}

export interface IEntrantData{
	id: number,
	name: string,
	eventId: number,
	skill: number,
	participants: IAttendeeData[]
}

export interface IEntrantOptions{
	areSeedsPublished?: boolean,
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
