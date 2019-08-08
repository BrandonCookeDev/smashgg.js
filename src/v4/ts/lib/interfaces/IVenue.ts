
export interface IVenue{
	/*
	name: string | null
	address: string | null
	city: string | null
	state: string | null
	postalCode: string | null
	countryCode: string | null
	region: string | null
	latitude: number | null
	longitude: number | null
	*/

	getName(): string | null
	getAddress(): string | null
	getCity(): string | null
	getState(): string | null
	getPostalCode(): string | null
	getCountryCode(): string | null
	getRegion(): string | null
	getLatitude(): number | null
	getLongitude(): number | null
}

export interface IVenueData{
	data: {
		tournament: {
			venueName: string | null
			venueAddress: string | null
			city: string | null
			addrState: string | null
			countryCode: string | null
			region: string | null
			postalCode: string | null
			lat: number | null
			lng: number | null
		}
	}
}
