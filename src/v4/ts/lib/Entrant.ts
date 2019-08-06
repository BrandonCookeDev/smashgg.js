import {IEntrant, IEntrantData} from './interfaces/IEntrant'
import {Attendee, IAttendee} from './Attendee' // TODO later change this to internal

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

	public static parseFull(data: IEntrantData): Entrant{
		return Entrant.parse(data.entrant)
	}
	
	private id: number
	private name: string
	private eventId: number
	private skill: number
	private attendeeData: Attendee[]

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

	public getAttendeeData(): Attendee[]{
		return this.attendeeData
	}

	public getAttendee(position: number = 0): Attendee{
		return this.attendeeData[position]
	}

	public getAttendeeId(position: number = 0): number{
		return this.attendeeData[position].getId()
	}

	public getGamerTag(position: number = 0): string {
		return this.attendeeData[position].getGamerTag()
	}
	
	public getSponsor(position: number = 0): string | null{
		return this.attendeeData[position].getSponsor()
	}

	public getPhoneNumber(position: number = 0): number | null{
		return this.attendeeData[position].getPhoneNumber()
	}

	public getContactInfo(position: number = 0): IAttendee.ContactInfo | null{
		return this.attendeeData[position].getContactInfo()
	}

	public getCity(position: number = 0): string | null{
		return this.attendeeData[position].getCity()
	}

	public getState(position: number = 0): string | null{
		return this.attendeeData[position].getState()
	}

	public getStateId(position: number = 0): number | null{
		return this.attendeeData[position].getStateId()
	}

	public getCountry(position: number = 0): string | null{
		return this.attendeeData[position].getCountry()
	}

	public getCountryId(position: number = 0): number | null{
		return this.attendeeData[position].getCountryId()
	}

	public getContactName(position: number = 0): string | null{
		return this.attendeeData[position].getContactName()
	}

	public getFirstName(position: number = 0): string | null{
		return this.attendeeData[position].getFirstName()
	}

	public getLastName(position: number = 0): string | null{
		return this.attendeeData[position].getLastName()
	}

	public getZipcode(position: number = 0): string | null	{
		return this.attendeeData[position].getZipcode()
	}

	public getConnectedAccounts(position: number = 0): object | null{
		return this.attendeeData[position].getConnectedAccounts()
	}
}
