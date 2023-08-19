import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
//import * as log from '../lib/util/Logger'

import moment from 'moment'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {ITournament} from '../lib/interfaces/ITournament'
import {IAttendee} from '../lib/interfaces/IAttendee'

import {Tournament} from '../lib/models/Tournament'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/tournament.testData'

let tournament1: ITournament, tournament2: ITournament, tournament3: ITournament

const TOURNAMENT_ID_1 = 432884
const TOURNAMENT_SLUG_1 = 'tournament/port-priority-7'

const TOURNAMENT_ID_2 = 438800
const TOURNAMENT_SLUG_2 = 'tournament/genesis-9-1'

const TOURNAMENT_ID_3 = 449011
const TOURNAMENT_SLUG_3 = 'tournament/let-s-make-big-moves-2023'

describe('startgg Tournament', function() {
	this.timeout(10000)

	before(async function() {
		this.timeout(20000)

		Initializer(process.env.API_TOKEN!)
		console.log("Getting tourneys by id...")
		const ti1 = await Tournament.getById(TOURNAMENT_ID_1)
		const ti2 = await Tournament.getById(TOURNAMENT_ID_2)
		const ti3 = await Tournament.getById(TOURNAMENT_ID_3)
		console.log("Getting tourneys by slug...")
		const ts1 = await Tournament.get(TOURNAMENT_SLUG_1)
		const ts2 = await Tournament.get(TOURNAMENT_SLUG_2)
		const ts3 = await Tournament.get(TOURNAMENT_SLUG_3)

		expect(ti1).to.deep.equal(ts1)
		expect(ti2).to.deep.equal(ts2)
		expect(ti3).to.deep.equal(ts3)

		tournament1 = ti1
		tournament2 = ti2
		tournament3 = ti3

		return true
	})

	// id
	it('should get the correct tournament id 1', () => {
		expect(tournament1.getId()).to.be.equal(testData.tournament1.id)
	})
	it('should get the correct tournament id 2', () => {
		expect(tournament2.getId()).to.be.equal(testData.tournament2.id)
	})
	it('should get the correct tournament id 3', () => {
		expect(tournament3.getId()).to.be.equal(testData.tournament3.id)
	})

	// name
	it('should get the correct tournament name 1', () => {
		expect(tournament1.getName()).to.be.equal(testData.tournament1.name)
	})
	it('should get the correct tournament name 2', () => {
		expect(tournament2.getName()).to.be.equal(testData.tournament2.name)
	})
	it('should get the correct tournament name 3', () => {
		expect(tournament3.getName()).to.be.equal(testData.tournament3.name)
	})
	
	// slug
	it('should get the correct tournament slug 1', () => {
		expect(tournament1.getSlug()).to.be.equal(testData.tournament1.slug)
	})
	it('should get the correct tournament slug 2', () => {
		expect(tournament2.getSlug()).to.be.equal(testData.tournament2.slug)
	})
	it('should get the correct tournament slug 3', () => {
		expect(tournament3.getSlug()).to.be.equal(testData.tournament3.slug)
	})
	
	// timezone
	it('should get the correct tournament timezone 1', () => {
		expect(tournament1.getTimezone()).to.be.equal(testData.tournament1.timezone)
	})
	it('should get the correct tournament timezone 2', () => {
		expect(tournament2.getTimezone()).to.be.equal(testData.tournament2.timezone)
	})
	it('should get the correct tournament timezone 3', () => {
		expect(tournament3.getTimezone()).to.be.equal(testData.tournament3.timezone)
	})

	// start time
	it('should get the correct tournament end time 1', () => {
		expect(moment(tournament1.getStartTime()).isSame(moment.unix(testData.tournament1.startAt!).toDate())).to.be.true
	})
	it('should get the correct tournament end time 2', () => {
		expect(moment(tournament2.getStartTime()).isSame(moment.unix(testData.tournament2.startAt!).toDate())).to.be.true
	})
	it('should get the correct tournament end time 3', () => {
		expect(moment(tournament3.getStartTime()).isSame(moment.unix(testData.tournament3.startAt!).toDate())).to.be.true
	})

	// start time string
	it('should get the correct tournament start time 1', () => {
		expect(tournament1.getStartTimeString()).to.be.equal(String(moment.unix(testData.tournament1.startAt!).toDate()))
	})
	it('should get the correct tournament start time 2', () => {
		expect(tournament2.getStartTimeString()).to.be.equal(String(moment.unix(testData.tournament2.startAt!).toDate()))
	})
	it('should get the correct tournament start time 3', () => {
		expect(tournament3.getStartTimeString()).to.be.equal(String(moment.unix(testData.tournament3.startAt!).toDate()))
	})

	// end time
	it('should get the correct tournament end time 1', () => {
		expect(moment(tournament1.getEndTime()).isSame(moment.unix(testData.tournament1.endAt!).toDate())).to.be.true
	})
	it('should get the correct tournament end time 2', () => {
		expect(moment(tournament2.getEndTime()).isSame(moment.unix(testData.tournament2.endAt!).toDate())).to.be.true
	})
	it('should get the correct tournament end time 3', () => {
		expect(moment(tournament3.getEndTime()).isSame(moment.unix(testData.tournament3.endAt!).toDate())).to.be.true
	})

	// end time string
	it('should get the correct tournament end time 1', () => {
		expect(tournament1.getEndTimeString()).to.be.equal(String(moment.unix(testData.tournament1.endAt!).toDate()))
	})
	it('should get the correct tournament end time 2', () => {
		expect(tournament2.getEndTimeString()).to.be.equal(String(moment.unix(testData.tournament2.endAt!).toDate()))
	})
	it('should get the correct tournament end time 3', () => {
		expect(tournament3.getEndTimeString()).to.be.equal(String(moment.unix(testData.tournament3.endAt!).toDate()))
	})

	// venue
	it('should get the correct tournament venue 1', () => {
		expect(tournament1.getVenue()).to.deep.equal(testData.venue1)
	})
	it('should get the correct tournament venue 2', () => {
		expect(tournament2.getVenue()).to.deep.equal(testData.venue2)
	})
	it('should get the correct tournament venue 3', () => {
		expect(tournament3.getVenue()).to.deep.equal(testData.venue3)
	})

	// venue name
	it('should get the correct tournament venue name 1', () => {
		expect(tournament1.getVenueName()).to.be.equal(testData.tournament1.venueName)
		expect(tournament1.getVenueName()).to.be.equal(testData.venue1.getName())
	})
	it('should get the correct tournament venue name 2', () => {
		expect(tournament2.getVenueName()).to.be.equal(testData.tournament2.venueName)
		expect(tournament2.getVenueName()).to.be.equal(testData.venue2.getName())
	})
	it('should get the correct tournament venue name 3', () => {
		expect(tournament3.getVenueName()).to.be.equal(testData.tournament3.venueName)
		expect(tournament3.getVenueName()).to.be.equal(testData.venue3.getName())
	})

	// venue city
	it('should get the correct tournament venue city 1', () => {
		expect(tournament1.getCity()).to.be.equal(testData.tournament1.city)
		expect(tournament1.getCity()).to.be.equal(testData.venue1.getCity())
	})
	it('should get the correct tournament venue city 2', () => {
		expect(tournament2.getCity()).to.be.equal(testData.tournament2.city)
		expect(tournament2.getCity()).to.be.equal(testData.venue2.getCity())
	})
	it('should get the correct tournament venue city 3', () => {
		expect(tournament3.getCity()).to.be.equal(testData.tournament3.city)
		expect(tournament3.getCity()).to.be.equal(testData.venue3.getCity())
	})

	// address
	it('should get the correct tournament venue address 1', () => {
		expect(tournament1.getAddress()).to.be.equal(testData.tournament1.venueAddress)
		expect(tournament1.getAddress()).to.be.equal(testData.venue1.getAddress())
	})
	it('should get the correct tournament venue address 2', () => {
		expect(tournament2.getAddress()).to.be.equal(testData.tournament2.venueAddress)
		expect(tournament2.getAddress()).to.be.equal(testData.venue2.getAddress())
	})
	it('should get the correct tournament venue address 3', () => {
		expect(tournament3.getAddress()).to.be.equal(testData.tournament3.venueAddress)
		expect(tournament3.getAddress()).to.be.equal(testData.venue3.getAddress())
	})

	// state
	it('should get the correct tournament venue state 1', () => {
		expect(tournament1.getState()).to.be.equal(testData.tournament1.addrState)
		expect(tournament1.getState()).to.be.equal(testData.venue1.getState())
	})
	it('should get the correct tournament venue state 2', () => {
		expect(tournament2.getState()).to.be.equal(testData.tournament2.addrState)
		expect(tournament2.getState()).to.be.equal(testData.venue2.getState())
	})
	it('should get the correct tournament venue state 3', () => {
		expect(tournament3.getState()).to.be.equal(testData.tournament3.addrState)
		expect(tournament3.getState()).to.be.equal(testData.venue3.getState())
	})

	// zip code
	it('should get the correct tournament venue zip code 1', () => {
		expect(tournament1.getZipCode()).to.be.equal(testData.tournament1.postalCode)
		expect(tournament1.getZipCode()).to.be.equal(testData.venue1.getPostalCode())
	})
	it('should get the correct tournament venue zip code 2', () => {
		expect(tournament2.getZipCode()).to.be.equal(testData.tournament2.postalCode)
		expect(tournament2.getZipCode()).to.be.equal(testData.venue2.getPostalCode())
	})
	it('should get the correct tournament venue zip code 3', () => {
		expect(tournament3.getZipCode()).to.be.equal(testData.tournament3.postalCode)
		expect(tournament3.getZipCode()).to.be.equal(testData.venue3.getPostalCode())
	})

	/*attendee search*/
	it('should correctly search attendees and find a match', async () => {
		const searched: IAttendee[] | null = await tournament1.searchAttendees('Tweek')
		expect(searched).to.not.be.null
		expect(searched!.length).to.be.greaterThan(0)
		expect(searched![0].getGamerTag()).to.be.equal('Tweek')
	})

	it('should correctly search attendees and find no match', async () => {
		const searched: IAttendee[] | null = await tournament1.searchAttendees('GAwes2')
		expect(searched).to.be.null
	})

	it('should correctly search attendees and find multiple matches', async () => {
		const searched: IAttendee[] | null = await tournament1.searchAttendees('GA')
		expect(searched).to.not.be.null
		expect(searched!.length).to.be.greaterThan(0)
		expect(searched![0].getGamerTag()).to.be.equal('GatoDelFuego')
		expect(searched![1].getGamerTag()).to.be.equal('Gackt')
		expect(searched![2].getGamerTag()).to.be.equal('Game 3')
	})

    // Tests commented due to filtering by sponsors not working properly on start.gg
// 	it('should correctly search attendees by prefix and find no match', async () => {
// 		const searched: IAttendee[] | null = await tournament1.searchAttendeesBySponsorTag('faketaglol')
// 		expect(searched).to.be.null
// 	})
//
// 	it('should lower case an upper case prefix on sponsor tag search', async () => {
// 		const searched: IAttendee[] | null = await tournament1.searchAttendeesBySponsorTag('TSM')
// 		expect(searched).to.not.be.null
// 		expect(searched!.length).to.be.greaterThan(0)
// 		expect(searched![0].getGamerTag()).to.be.equal('Tweek')
// 	})
//
// 	it('should correctly search attendees by prefix and find a match', async () => {
// 		const searched: IAttendee[] | null = await tournament1.searchAttendeesBySponsorTag('rcs')
// 		expect(searched).to.not.be.null
// 		expect(searched!.length).to.be.greaterThan(0)
// 		expect(searched![0].getGamerTag()).to.be.equal('KPAN')
// 	})
//
// 	it('should correctly search attendees by prefix and find more than one match', async () => {
// 		const searched: IAttendee[] | null = await tournament1.searchAttendeesBySponsorTag('ss')
// 		expect(searched).to.not.be.null
// 		expect(searched!.length).to.be.greaterThan(0)
// 		expect(searched![0].getGamerTag()).to.be.equal('FullMetal')
// 		expect(searched![1].getGamerTag()).to.be.equal('Stango')
// 		expect(searched![2].getGamerTag()).to.be.equal('Colbol')
// 		expect(searched![3].getGamerTag()).to.be.equal('Flow')
// 	})

	/*
	// sets
	it('should return the correct list of Sets in the Tournament 1', async () => {
		this.timeout(30000)

		let sets: GGSet[] = await tournament1.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length
		}
		expect(hasDuplicates(sets)).to.be.false
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet)
		})
		expect(sets.length).to.be.equal(84)
		return true
	})
	xit('should return the correct list of Sets in the Tournament 2', async () => {
		this.timeout(30000)

		let sets: GGSet[] = await tournament2.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length
		}
		expect(hasDuplicates(sets)).to.be.false
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet)
		})
		expect(sets.length).to.be.equal(84)
		return true
	})
	xit('should return the correct list of Sets in the Tournament 3', async () => {
		this.timeout(30000)

		let sets: GGSet[] = await tournament3.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length
		}
		expect(hasDuplicates(sets)).to.be.false
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet)
		})
		expect(sets.length).to.be.equal(84)
		return true
	})

	// entrants

	// attendees
	*/
})
