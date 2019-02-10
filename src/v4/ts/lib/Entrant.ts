/** aka Entrant **/
import {Attendee, IAttendee} from './Attendee' // TODO later change this to internal

export class Entrant implements IEntrant.Entrant{
	id: number
	name: string
	eventId: number
	skill: number
	attendeeData: Attendee[]

	constructor(
		id: number,
		name: string, 
		eventId: number,
		skill: number,
		attendeeData: Attendee[]
	){
		this.id = id
		this.name = name
		this.eventId = eventId
		this.skill = skill
		this.attendeeData = attendeeData
	}

	static parse(data: IEntrant.EntrantData) : Entrant{
		let attendeeData = data.participants.map(attendeeData => Attendee.parse(attendeeData))
		
		return new Entrant(
			data.id,
			data.name,
			data.eventId,
			data.skill,
			attendeeData
		)
	}

	static parseFull(data: IEntrant.Data) : Entrant{
		return Entrant.parse(data.entrant)
	}

	getId(): number{
		return this.id
	}

	getName(): string {
		return this.name
	}

	getEventId(): number{
		return this.eventId
	}

	getSkill(): number{
		return this.skill
	}

	getAttendeeData(): Attendee[]{
		return this.attendeeData
	}

	getAttendee(position: number = 0): Attendee{
		return this.attendeeData[position]
	}

	getAttendeeId(position: number = 0): number{
		return this.attendeeData[position].getId()
	}

	getGamerTag(position: number = 0): string {
		return this.attendeeData[position].getGamerTag()
	}
	
	getSponsor(position: number = 0): string | null{
		return this.attendeeData[position].getSponsor()
	}

	getPhoneNumber(position: number = 0): number | null{
		return this.attendeeData[position].getPhoneNumber()
	}

	getContactInfo(position: number = 0): IAttendee.ContactInfo | null{
		return this.attendeeData[position].getContactInfo()
	}

	getCity(position: number = 0): string | null{
		return this.attendeeData[position].getCity()
	}

	getState(position: number = 0): string | null{
		return this.attendeeData[position].getState()
	}

	getStateId(position: number = 0): number | null{
		return this.attendeeData[position].getStateId()
	}

	getCountry(position: number = 0): string | null{
		return this.attendeeData[position].getCountry()
	}

	getCountryId(position: number = 0): number | null{
		return this.attendeeData[position].getCountryId()
	}

	getContactName(position: number = 0): string | null{
		return this.attendeeData[position].getContactName()
	}

	getFirstName(position: number = 0): string | null{
		return this.attendeeData[position].getFirstName()
	}

	getLastName(position: number = 0): string | null{
		return this.attendeeData[position].getLastName()
	}

	getZipcode(position: number = 0): string | null	{
		return this.attendeeData[position].getZipcode()
	}

	getConnectedAccounts(position: number = 0): object | null{
		return this.attendeeData[position].getConnectedAccounts()
	}
}

export namespace IEntrant{
	export interface Entrant{
		id: number,
		name: string, 
		eventId: number,
		skill: number,
		attendeeData: Attendee[]

		getId(): number
		getName(): string 
		getEventId(): number
		getSkill(): number
		getAttendeeData(position: number): Attendee | Attendee[]
		getAttendeeId(position: number): number
		getGamerTag(position: number): string
		getSponsor(position: number): string | null
		getPhoneNumber(position: number): number | null
		getContactInfo(position: number): IAttendee.ContactInfo | null
		getCity(position: number): string | null
		getState(position: number): string | null
		getStateId(position: number): number | null
		getCountry(position: number): string | null
		getCountryId(position: number): number | null
		getName(position: number): string | null
		getFirstName(position: number): string | null
		getLastName(position: number): string | null
		getZipcode(position: number): string | null		
		getConnectedAccounts(): object | null
	}	

	export interface Data{
		"entrant": EntrantData
	}

	export interface EntrantData{
		id: number,
		name: string,
		eventId: number,
		skill: number,
		participants: IAttendee.AttendeeData[]
	}

	export interface EntrantOptions{
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
			seach?:{
				fieldsToSearch: string[],
				searchString: string
			}
		}
	}

	export function getDefaultEntrantOptions() : EntrantOptions{
		return {
			page: 1,
			perPage: 1,
			sortBy: null,
			filter: null
		}
	}
}