import NI from './util/NetworkInterface'
import * as queries from './scripts/tournamentQueries'

import {IOrganizer, IOrganizerData} from './interfaces/IOrganizer'

export class Organizer implements IOrganizer{

	public static parse(data: IOrganizerData): IOrganizer{
		const organizer = new Organizer(
			data.data.tournament.ownerId, data.data.tournament.contactEmail, data.data.tournament.contactPhone,
			data.data.tournament.contactTwitter, data.data.tournament.contactInfo
		)
		return organizer
	}
	
	public static async getByTournament(tournamentSlug: string): Promise<IOrganizer> {
		const data = await NI.query(queries.tournamentOrganizer, {slug: tournamentSlug})
		return Organizer.parse(data)
	}

	private id: number | null
	private email: string | null
	private phone: string | null
	private twitter: string | null
	private info: string | null

	constructor(
		id: number | null, 
		email: string | null, 
		phone: string | null, 
		twitter: string | null, 
		info: string | null
	){
		this.id = id
		this.email = email
		this.phone = phone
		this.twitter = twitter
		this.info = info
	}

	public getId() {
		return this.id
	}

	public getEmail() {
		return this.email
	}
	
	public getPhone() {
		return this.phone
	}
	
	public getTwitter() {
		return this.twitter
	}

	public getInfo() {
		return this.info
	}

}
