import NI from './util/NetworkInterface'
import * as queries from './scripts/tournamentQueries'

export namespace IVenue{
	export interface Venue{
		name: string | null
		address: string | null
		city: string | null
		state: string | null
		postalCode: number | null
		countryCode: number | null
		region: string | null
		latitude: number | null
		longitude: number | null

		getName(): string | null
		getAddress(): string | null
		getCity(): string | null
		getState(): string | null
		getPostalCode(): number | null
		getCountryCode(): number | null
		getRegion(): string | null
		getLatitude(): number | null
		getLongitude(): number | null
	}

	export interface Data{
		data:{
			tournament:{
				venueName: string | null
				venueAddress: string | null
				city: string | null
				addrState: string | null
				countryCode: number | null
				region: string | null
				postalCode: number | null
				lat: number | null
				lng: number | null
			}
		}
	}
}

export class Venue implements IVenue.Venue{
	
	name: string | null
	address: string | null
	city: string | null
	state: string | null
	postalCode: number | null
	countryCode: number | null
	region: string | null
	latitude: number | null
	longitude: number | null

	constructor(name: string | null, address: string | null, city: string | null, state: string | null, 
				countryCode: number | null, region: string | null, postalCode: number | null, 
				latitude: number | null, longitude: number | null){
					
		this.name = name
		this.address = address
		this.city = city
		this.state = state
		this.countryCode = countryCode
		this.region = region
		this.postalCode = postalCode
		this.latitude = latitude
		this.longitude = longitude
	}

	getName() {
	  return this.name
	}

	getAddress() {
	  return this.address
	}

	getState() {
	  return this.state
	}
	

	getCity() {
	  return this.city
	}

	getCountryCode() {
	  return this.countryCode
	}

	getRegion() {
	  return this.region
	}

	getPostalCode() {
	  return this.postalCode
	}

	getLatitude() {
	  return this.latitude 
	}
	
	getLongitude() {
	  return this.longitude
	}

	static parse(data: IVenue.Data) : Venue{
		let venue = new Venue(
			data.data.tournament.venueName, data.data.tournament.venueAddress, data.data.tournament.city,
			data.data.tournament.addrState, data.data.tournament.countryCode, data.data.tournament.region, 
			data.data.tournament.postalCode, data.data.tournament.lat, data.data.tournament.lng
		)
		return venue;
	}
	
	static async getByTournament(tournamentSlug: string) : Promise<Venue>{
		let data = await NI.query(queries.tournamentVenue, {slug: tournamentSlug})
		return Venue.parse(data);
	}

}