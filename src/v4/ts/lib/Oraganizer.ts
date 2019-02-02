import NI from './util/NetworkInterface'
import * as queries from './scripts/tournamentQueries'

export namespace IOrganizer{
	export interface Organizer{
		id: number | null
		email: string | null
		phone: string | null
		twitter: string | null
		info: string | null

		getId(): number | null
		getEmail(): string | null
		getPhone(): string | null
		getTwitter(): string | null
		getInfo(): string | null
	}

	export interface Data{
		data:{
			tournament:{
				ownerId: number
				contactEmail: string
				contactPhone: string
				contactTwitter: string
				contactInfo: string
			}
		}
	}
}

export class Organizer implements IOrganizer.Organizer{
	
	id: number | null
	email: string | null
	phone: string | null
	twitter: string | null
	info: string | null

	constructor(id: number | null, email: string | null, phone: string | null, twitter: string | null, info: string | null){
		this.id = id
		this.email = email
		this.phone = phone
		this.twitter = twitter
		this.info = info
	}

	getId() {
	  return this.id
	}

	getEmail() {
		return this.email
	}
	
	getPhone() {
	  return this.phone
	}
	
	getTwitter() {
		return this.twitter
	}

	getInfo() {
	  return this.info
	}

	static parse(data: IOrganizer.Data) : Organizer{
		let venue = new Organizer(
			data.data.tournament.ownerId, data.data.tournament.contactEmail, data.data.tournament.contactPhone,
			data.data.tournament.contactTwitter, data.data.tournament.contactInfo
		)
		return venue;
	}
	
	static async getByTournament(tournamentSlug: string) : Promise<Organizer> {
		let data = await NI.query(queries.tournamentOrganizer, {slug: tournamentSlug})
		return Organizer.parse(data);
	}

}