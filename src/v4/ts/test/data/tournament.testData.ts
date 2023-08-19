
import {IVenue} from '../../lib/interfaces/IVenue'
import {IOrganizerData} from '../../lib/interfaces/IOrganizer'
import {ITournamentData} from '../../lib/interfaces/ITournament'
// import {   } from '../../lib/scripts/schema'

import {Venue} from '../../lib/models/Venue'

// Organizers test data not related to tournament test data
export const organizer1: IOrganizerData = {
        tournament: {
            owner: {
                id: 26459,
                bio: "wa to / port priority lead / wga smash founder / satellite smash founder / rob main",
                email: null,
                genderPronoun: "he/him",
                player: {
                    gamerTag: "Gyromight!"
                }
            }
    }
}

export const organizer2: IOrganizerData = {
        tournament: {
            owner: {
                id: 39,
                bio: "Lead TO/co-owner of Genesis, MIOM co-founder, researcher USC Price CID",
                email: null,
                genderPronoun: null,
                player: {
                    gamerTag: "Dr. Z"
                }
            }
    }
}

export const organizer3: IOrganizerData = {
        tournament: {
            owner: {
                id: 531994,
                bio: null,
                email: null,
                genderPronoun: null,
                player: {
                    gamerTag: "Mr. Gamer"
                }
            }
    }
}


// ----



export const tournament1: ITournamentData = {
    id: 432884,
    name: "Port Priority 7",
    slug: "tournament/port-priority-7",
    city: "Auburn",
    postalCode: "98002",
    addrState: "WA",
    countryCode: "US",
    venueAddress: "2402 Auburn Way S, Auburn, WA 98002, USA",
    venueName: null,
    lat: 47.291025,
    lng: -122.1951867,
//     primaryContact: "https://discord.gg/PEmUtBygdH",
    timezone: "America/Los_Angeles",
    startAt: 1668276000,
    endAt: 1668400200
}

export const tournament2: ITournamentData = {
    id: 438800,
    name: "Genesis 9",
    slug: "tournament/genesis-9-1",
    city: "San Jose",
    postalCode: "95113",
    addrState: "CA",
    countryCode: "US",
    venueAddress: "150 W San Carlos St, San Jose, CA 95113, USA",
    venueName: null,
    lat: 37.3290778,
    lng: -121.888984,
    timezone: "America/Los_Angeles",
    startAt: 1674234000,
    endAt: 1674457200
}

export const tournament3: ITournamentData = {
    id: 449011,
    name: "Let's Make BIG Moves 2023",
    slug: "tournament/let-s-make-big-moves-2023",
    city: "New York",
    postalCode: "10001",
    addrState: "NY",
    countryCode: "US",
    venueAddress: "481 8th Ave, New York, NY 10001, USA",
    venueName: "Eternal Life Community Center",
    lat: 40.7526434,
    lng: -73.99341570000001,
    timezone: "America/New_York",
    startAt: 1673024400,
    endAt: 1673236800
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