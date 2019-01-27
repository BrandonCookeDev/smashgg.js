
export namespace IVenue{
	export interface Venue{
		name: string
		address: string
		city: string
		state: string
		postalCode: string
		countryCode: number
		region: string
		latitude: number
		longitude: number

		getName(): string
		getAddress(): string
		getCity(): string
		getState(): string
		getPostalCode(): string
		getCountryCode(): number
		getRegion(): string
		getLatitude(): number
		getLongitude(): number
	}
}

export class Venue implements IVenue.Venue{
	
	name: string
	address: string
	city: string
	state: string
	postalCode: string
	countryCode: number
	region: string
	latitude: number
	longitude: number

	constructor(name: string, address: string, city: string, state: string, 
				countryCode: number, region: string, postalCode: string, 
				latitude: number, longitude: number){
					
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
	
}