/** aka Entrant **/
import {Attendee, IAttendee} from './Attendee' // TODO later change this to internal

export class Player implements IPlayer.Player{
	id: number
	name: string
	eventId: number
	skill: number
	attendeeData: Attendee

	constructor(
		id: number,
		name: string, 
		eventId: number,
		skill: number,
		attendeeData: Attendee
	){
		this.id = id
		this.name = name
		this.eventId = eventId
		this.skill = skill
		this.attendeeData = attendeeData
	}

	static parse(data: IPlayer.PlayerData) : Player | Player[]{
		let attendeeData = data.participants.map(attendeeData => Attendee.parse(attendeeData))
		
		if(attendeeData.length == 1)
			return new Player(
				data.id,
				data.name,
				data.eventId,
				data.skill,
				attendeeData[0]
			)
		else if(attendeeData.length > 1)
			return attendeeData.map(attendee => {
				return new Player(
					data.id,
					data.name,
					data.eventId,
					data.skill,
					attendee
				) 
			})
		else throw new Error('No attendee data')
	}

	static parseFull(data: IPlayer.Data) : Player | Player[]{
		return Player.parse(data.entrant)
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

	getAttendeeData(): Attendee{
		return this.attendeeData
	}

	getAttendeeId(): number{
		return this.attendeeData.getId()
	}

	getGamerTag(): string {
		return this.attendeeData.getGamerTag()
	}
	
	getSponsor(): string | null{
		return this.attendeeData.getSponsor()
	}

	getPhoneNumber(): number | null{
		return this.attendeeData.getPhoneNumber()
	}

	getContactInfo(): IAttendee.ContactInfo | null{
		return this.attendeeData.getContactInfo()
	}

	getCity(): string | null{
		return this.attendeeData.getCity()
	}

	getState(): string | null{
		return this.attendeeData.getState()
	}

	getStateId(): number | null{
		return this.attendeeData.getStateId()
	}

	getCountry(): string | null{
		return this.attendeeData.getCountry()
	}

	getCountryId(): number | null{
		return this.attendeeData.getCountryId()
	}

	getContactName(): string | null{
		return this.attendeeData.getContactName()
	}

	getFirstName(): string | null{
		return this.attendeeData.getFirstName()
	}

	getLastName(): string | null{
		return this.attendeeData.getLastName()
	}

	getZipcode(): string | null	{
		return this.attendeeData.getZipcode()
	}

	getConnectedAccounts(): object | null{
		return this.attendeeData.getConnectedAccounts()
	}
}

export namespace IPlayer{
	export interface Player{
		id: number,
		name: string, 
		eventId: number,
		skill: number,
		attendeeData: Attendee

		getId(): number
		getName(): string 
		getEventId(): number
		getSkill(): number
		getAttendeeData(): Attendee
		getAttendeeId(): number
		getGamerTag(): string
		getSponsor(): string | null
		getPhoneNumber(): number | null
		getContactInfo(): IAttendee.ContactInfo | null
		getCity(): string | null
		getState(): string | null
		getStateId(): number | null
		getCountry(): string | null
		getCountryId(): number | null
		getName(): string | null
		getFirstName(): string | null
		getLastName(): string | null
		getZipcode(): string | null		
		getConnectedAccounts(): object | null
	}	

	export interface Data{
		"entrant": PlayerData
	}

	export interface PlayerData{
		"id": number,
		"name": string,
		"eventId": number,
		"skill": number,
		"participants": IAttendee.AttendeeData[]
	}
}