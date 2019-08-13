import {IContactInfo} from '../interfaces/IContactInfo'
import {IEntrant, IEntrantData, IEntrantOptions, IEntrantDataFull} from '../interfaces/IEntrant'
import {IAttendee} from '../interfaces/IAttendee'

import {Attendee} from './Attendee' // TODO later change this to internal

import {format} from 'util'
import * as Strings from '../util/Strings'

export class Entrant implements IEntrant{
	// Statics
	public static parse(data: IEntrantData): Entrant{
		const attendeeData = data.participants.map(participant => Attendee.parse(participant))

		return new Entrant(
			data.id,
			data.name,
			data.eventId,
			data.skill,
			attendeeData
		)
	}

	public static parseFull(data: IEntrantDataFull): Entrant{
		return Entrant.parse(data.entrant)
	}

	public static getDefaultEntrantOptions(): IEntrantOptions{
		return {
			areSeedsPublished: true,
			page: null,
			perPage: 1,
			sortBy: null,
			filter: null
		}
	}

	public static validatePosition(op: string, position: number, attendeeLength: number){
		if(position >= attendeeLength || position < 0)
			throw new Error(
				format(Strings.entrantNonExistantPosition,
					op, position, attendeeLength)
			)
	}

	private id: number
	private name: string
	private eventId: number
	private skill: number
	private attendeeData: IAttendee[]

	constructor(
		id: number,
		name: string,
		eventId: number,
		skill: number,
		attendeeData: IAttendee[]
	){
		this.id = id
		this.name = name
		this.eventId = eventId
		this.skill = skill
		this.attendeeData = attendeeData
	}	

	public getId(): number{
		return this.id
	}

	public getName(): string {
		return this.name
	}

	public getEventId(): number{
		return this.eventId
	}

	public getSkill(): number{
		return this.skill
	}

	public getAttendeeData(): IAttendee[]{
		return this.attendeeData
	}

	public getAttendee(position: number = 0): IAttendee{
		Entrant.validatePosition('getAttendee', position, this.attendeeData.length)
		return this.attendeeData[position]
	}

	public getAttendeeId(position: number = 0): number{
		Entrant.validatePosition('getAttendeeId', position, this.attendeeData.length)
		return this.attendeeData[position].getId()
	}

	public getGamerTag(position: number = 0): string {
		Entrant.validatePosition('getGamerTag', position, this.attendeeData.length)
		return this.attendeeData[position].getGamerTag()
	}
	
	public getSponsor(position: number = 0): string | null{
		Entrant.validatePosition('getSponsor', position, this.attendeeData.length)
		return this.attendeeData[position].getSponsor()
	}

	public getPhoneNumber(position: number = 0): number | null{
		Entrant.validatePosition('getPhoneNumber', position, this.attendeeData.length)
		return this.attendeeData[position].getPhoneNumber()
	}

	public getContactInfo(position: number = 0): IContactInfo | null{
		Entrant.validatePosition('getContactInfo', position, this.attendeeData.length)
		return this.attendeeData[position].getContactInfo()
	}

	public getCity(position: number = 0): string | null{
		Entrant.validatePosition('getCity', position, this.attendeeData.length)
		return this.attendeeData[position].getCity()
	}

	public getState(position: number = 0): string | null{
		Entrant.validatePosition('getState', position, this.attendeeData.length)
		return this.attendeeData[position].getState()
	}

	public getStateId(position: number = 0): number | null{
		Entrant.validatePosition('getStateId', position, this.attendeeData.length)
		return this.attendeeData[position].getStateId()
	}

	public getCountry(position: number = 0): string | null{
		Entrant.validatePosition('getCountry', position, this.attendeeData.length)
		return this.attendeeData[position].getCountry()
	}

	public getCountryId(position: number = 0): number | null{
		Entrant.validatePosition('getCountryId', position, this.attendeeData.length)
		return this.attendeeData[position].getCountryId()
	}

	public getContactName(position: number = 0): string | null{
		Entrant.validatePosition('getContactName', position, this.attendeeData.length)
		return this.attendeeData[position].getContactName()
	}

	public getFirstName(position: number = 0): string | null{
		Entrant.validatePosition('getFirstName', position, this.attendeeData.length)
		return this.attendeeData[position].getFirstName()
	}

	public getLastName(position: number = 0): string | null{
		Entrant.validatePosition('getLastName', position, this.attendeeData.length)
		return this.attendeeData[position].getLastName()
	}

	public getZipcode(position: number = 0): string | null	{
		Entrant.validatePosition('getZipcode', position, this.attendeeData.length)
		return this.attendeeData[position].getZipcode()
	}

	public getConnectedAccounts(position: number = 0): object | null{
		Entrant.validatePosition('getConnectedAccounts', position, this.attendeeData.length)
		return this.attendeeData[position].getConnectedAccounts()
	}
}
