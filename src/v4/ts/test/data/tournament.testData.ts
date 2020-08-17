
import {IVenue, IVenueData} from '../../lib/interfaces/IVenue'
import {IOrganizer, IOrganizerData} from '../../lib/interfaces/IOrganizer'
import {ITournamentData} from '../../lib/interfaces/ITournament'
// import {   } from '../../lib/scripts/schema'

import {Organizer} from '../../lib/models/Organizer'
import {Venue} from '../../lib/models/Venue'

export const tournament1: ITournamentData = {
	id: 6620,
	name: 'Tipped Off 12 , Presented by The Lab Gaming Center!',
	slug: 'tournament/tipped-off-12-presented-by-the-lab-gaming-center',
	city: 'Atlanta',
	postalCode: '30339',
	addrState: 'GA',
	countryCode: 'US',
	region: '11',
	venueAddress: '2 Galleria Pkwy SE, Atlanta, GA 30339, USA',
	venueName: 'The Cobb Galleria',
	gettingThere: null,
	lat: 33.8835141,
	lng: -84.4655017,
	timezone: 'America/New_York',
	startAt: 1510401600,
	endAt: 1510549140,
	contactInfo: null,
	contactEmail: 'thelabgaminginc@gmail.com',
	contactTwitter: 'TheLabGamingCtr',
	contactPhone: '404-368-5274',
	ownerId: 11259
}

export const tournament2: ITournamentData = {
	id: 63515,
	name: '21XX: cameron\'s birthday bash',
	slug: 'tournament/21xx-cameron-s-birthday-bash-1',
	city: 'Marietta',
	postalCode: '30062',
	addrState: 'GA',
	countryCode: 'US',
	region: '11',
	venueAddress: '2860 Meadow Dr, Marietta, GA 30062, USA',
	venueName: null,
	gettingThere: '',
	lat: 34.0219068,
	lng: -84.445532,
	timezone: 'America/New_York',
	startAt: 1532210400,
	endAt: 1532231940,
	contactInfo: null,
	contactEmail: null,
	contactTwitter: 'dontcallmeslips',
	contactPhone: null,
	ownerId: 91767
}

export const tournament3: ITournamentData = {
	id: 1609,
	name: 'CEO 2016',
	slug: 'tournament/ceo-2016',
	city: 'Orlando',
	postalCode: '32819',
	addrState: 'FL',
	countryCode: 'US',
	region: '10',
	venueAddress: '8001 International Dr, Orlando, FL 32819, USA',
	venueName: 'Wyndham Orlando Resort',
	gettingThere: 
		'For information on how to get to the venue, food options and more please ' +
		'visit http://www.ceogaming.org/ceohotel\n\nCEO at the Wyndham Orlando Resort ' +
		'is located less than 20 minutes from the Orlando International Airport (MCO). ' +
		'\n\nHotel Rooms will sell out fast for CEO 2016 at the Wyndham Orlando Resort so book now!',
	lat: 28.448578,
	lng: -81.4682618,
	timezone: 'America/New_York',
	startAt: 1466740800,
	endAt: 1467000000,
	contactInfo: 'For Media inquiries or Sponsorship/Partnership Opportunities please contact CEOGaming@gmail.com',
	contactEmail: 'ceogaming@gmail.com',
	contactTwitter: 'ceogaming',
	contactPhone: null,
	ownerId: 3431
}

export const tournamentData1 = {
	tournament: tournament1
}

export const tournamentData2 = {
	tournament: tournament2
}

export const tournamentData3 = {
	tournament: tournament3
}

// venues
export const venue1: IVenue = new Venue(
	tournament1.venueName, tournament1.venueAddress,
	tournament1.city, tournament1.addrState,
	tournament1.countryCode,
	tournament1.postalCode, tournament1.lat, tournament1.lng
)

export const venue2: IVenue = new Venue(
	tournament2.venueName, tournament2.venueAddress,
	tournament2.city, tournament2.addrState,
	tournament2.countryCode,
	tournament2.postalCode, tournament2.lat, tournament2.lng
)

export const venue3: IVenue = new Venue(
	tournament3.venueName, tournament3.venueAddress,
	tournament3.city, tournament3.addrState,
	tournament3.countryCode,
	tournament3.postalCode, tournament3.lat, tournament3.lng
)
