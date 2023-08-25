import NI from '../util/NetworkInterface'
import * as queries from '../scripts/tournamentQueries'

import {IOrganizer, IOrganizerData} from '../interfaces/IOrganizer'

export class Organizer implements IOrganizer{

	public static parse(data: IOrganizerData): IOrganizer{
		const organizer = new Organizer(
			data.tournament.owner.id, data.tournament.owner.bio,
			data.tournament.owner.genderPronoun, data.tournament.owner.player.gamerTag
		)
		return organizer
	}
	
	public static async getByTournament(tournamentSlug: string): Promise<IOrganizer> {
	    console.log('Getting organizer data for tournament with slug: %s', tournamentSlug)
		const data = await NI.query(queries.tournamentOrganizer, {slug: tournamentSlug})
		return Organizer.parse(data)
	}

	private id: number | null
	private bio: string | null
	private genderPronoun: string | null
	private gamerTag: string | null

	constructor(
		id: number | null, 
		bio: string | null,
		genderPronoun: string | null,
		gamerTag: string | null
	){
		this.id = id
		this.bio = bio
		this.genderPronoun = genderPronoun
		this.gamerTag = gamerTag
	}

	public getId() {
		return this.id
	}

	public getBio() {
		return this.bio
	}
	
	public getGenderPronoun() {
		return this.genderPronoun
	}

	public getGamerTag() {
		return this.gamerTag
	}
}
