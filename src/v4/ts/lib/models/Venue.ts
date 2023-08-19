import NI from '../util/NetworkInterface'
import * as queries from '../scripts/tournamentQueries'

import {IVenue, IVenueData} from '../interfaces/IVenue'

export class Venue implements IVenue{
	
	public static parse(data: IVenueData): IVenue{
		const venue = new Venue(
			data.data.tournament.venueName, data.data.tournament.venueAddress, data.data.tournament.city,
			data.data.tournament.addrState, data.data.tournament.countryCode,
			data.data.tournament.postalCode, data.data.tournament.lat, data.data.tournament.lng
		)
		return venue
	}
	
	public static async getByTournament(tournamentSlug: string): Promise<IVenue>{
		const data = await NI.query(queries.tournamentVenue, {slug: tournamentSlug})
		return Venue.parse(data)
	}

	private name: string | null
	private address: string | null
	private city: string | null
	private state: string | null
	private postalCode: string | null
	private countryCode: string | null
	private latitude: number | null
	private longitude: number | null

	// SonarLint TODO: Need restructuring so we dont have as many parameters
	constructor(
		name: string | null, address: string | null, city: string | null, 
		state: string | null, countryCode: string | null,
		postalCode: string | null, latitude: number | null, longitude: number | null
	){				
		this.name = name
		this.address = address
		this.city = city
		this.state = state
		this.countryCode = countryCode
		this.postalCode = postalCode
		this.latitude = latitude
		this.longitude = longitude
	}

	public getName() {
		return this.name
	}

	public getAddress() {
		return this.address
	}

	public getState() {
		return this.state
	}
	
	public getCity() {
		return this.city
	}

	public getCountryCode() {
		return this.countryCode
	}

	public getPostalCode() {
		return this.postalCode
	}

	public getLatitude() {
		return this.latitude 
	}
	
	public getLongitude() {
		return this.longitude
	}
}
