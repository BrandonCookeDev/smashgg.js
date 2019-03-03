import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
import * as log from '../lib/util/Logger'

import _ from 'lodash'
import moment from 'moment'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {Tournament, ITournament} from '../lib/Tournament'
import {Event, IEvent} from '../lib/Event'
import {GGSet} from '../lib/GGSet'
import {Entrant} from '../lib/Entrant'
import {Attendee} from '../lib/Attendee'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/tournament.testData'
import { Venue } from '../lib/Venue';

let tournament1: Tournament, tournament2: Tournament, tournament3: Tournament

const TOURNAMENT_ID_1 = 6620
const TOURNAMENT_SLUG_1 = 'tournament/tipped-off-12-presented-by-the-lab-gaming-center'

const TOURNAMENT_ID_2 = 63515
const TOURNAMENT_SLUG_2 = 'tournament/21xx-cameron-s-birthday-bash-1'

const TOURNAMENT_ID_3 = 1609
const TOURNAMENT_SLUG_3 = 'tournament/ceo-2016'


describe('smashgg Tournament', function(){
	this.timeout(10000)

	before(async function(){
		this.timeout(20000)

		await Initializer(process.env.API_TOKEN!)
		let ti1 = await Tournament.get(TOURNAMENT_ID_1)
		let ti2 = await Tournament.get(TOURNAMENT_ID_2)
		let ti3 = await Tournament.get(TOURNAMENT_ID_3)

		let ts1 = await Tournament.getBySlug(TOURNAMENT_SLUG_1)
		let ts2 = await Tournament.getBySlug(TOURNAMENT_SLUG_2)
		let ts3 = await Tournament.getBySlug(TOURNAMENT_SLUG_3)

		expect(ti1).to.deep.equal(ts1)
		expect(ti2).to.deep.equal(ts2)
		expect(ti3).to.deep.equal(ts3)

		tournament1 = ti1;
		tournament2 = ti2;
		tournament3 = ti3;

		return true;
	})

	// id
	it('should get the correct tournament id 1', function(){
		expect(tournament1.getId()).to.be.equal(testData.tournament1.id)
	})
	it('should get the correct tournament id 2', function(){
		expect(tournament2.getId()).to.be.equal(testData.tournament2.id)
	})
	it('should get the correct tournament id 3', function(){
		expect(tournament3.getId()).to.be.equal(testData.tournament3.id)
	})


	// name
	it('should get the correct tournament name 1', function(){
		expect(tournament1.getName()).to.be.equal(testData.tournament1.name)
	})
	it('should get the correct tournament name 2', function(){
		expect(tournament2.getName()).to.be.equal(testData.tournament2.name)
	})
	it('should get the correct tournament name 3', function(){
		expect(tournament3.getName()).to.be.equal(testData.tournament3.name)
	})

	
	// slug
	it('should get the correct tournament slug 1', function(){
		expect(tournament1.getSlug()).to.be.equal(testData.tournament1.slug)
	})
	it('should get the correct tournament slug 2', function(){
		expect(tournament2.getSlug()).to.be.equal(testData.tournament2.slug)
	})
	it('should get the correct tournament slug 3', function(){
		expect(tournament3.getSlug()).to.be.equal(testData.tournament3.slug)
	})

	
	// timezone
	it('should get the correct tournament timezone 1', function(){
		expect(tournament1.getTimezone()).to.be.equal(testData.tournament1.timezone)
	})
	it('should get the correct tournament timezone 2', function(){
		expect(tournament2.getTimezone()).to.be.equal(testData.tournament2.timezone)
	})
	it('should get the correct tournament timezone 3', function(){
		expect(tournament3.getTimezone()).to.be.equal(testData.tournament3.timezone)
	})


	// start time
	it('should get the correct tournament end time 1', function(){
		expect(moment(tournament1.getStartTime()!).isSame(moment.unix(testData.tournament1.startAt).toDate())).to.be.true
	})
	it('should get the correct tournament end time 2', function(){
		expect(moment(tournament2.getStartTime()!).isSame(moment.unix(testData.tournament2.startAt).toDate())).to.be.true
	})
	it('should get the correct tournament end time 3', function(){
		expect(moment(tournament3.getStartTime()!).isSame(moment.unix(testData.tournament3.startAt).toDate())).to.be.true
	})

	// start time string
	it('should get the correct tournament start time 1', function(){
		expect(tournament1.getStartTimeString()).to.be.equal(String(moment.unix(testData.tournament1.startAt).toDate()))
	})
	it('should get the correct tournament start time 2', function(){
		expect(tournament2.getStartTimeString()).to.be.equal(String(moment.unix(testData.tournament2.startAt).toDate()))
	})
	it('should get the correct tournament start time 3', function(){
		expect(tournament3.getStartTimeString()).to.be.equal(String(moment.unix(testData.tournament3.startAt).toDate()))
	})


	// end time
	it('should get the correct tournament end time 1', function(){
		expect(moment(tournament1.getEndTime()!).isSame(moment.unix(testData.tournament1.endAt).toDate())).to.be.true
	})
	it('should get the correct tournament end time 2', function(){
		expect(moment(tournament2.getEndTime()!).isSame(moment.unix(testData.tournament2.endAt).toDate())).to.be.true
	})
	it('should get the correct tournament end time 3', function(){
		expect(moment(tournament3.getEndTime()!).isSame(moment.unix(testData.tournament3.endAt).toDate())).to.be.true
	})

	// end time string
	it('should get the correct tournament end time 1', function(){
		expect(tournament1.getEndTimeString()).to.be.equal(String(moment.unix(testData.tournament1.endAt).toDate()))
	})
	it('should get the correct tournament end time 2', function(){
		expect(tournament2.getEndTimeString()).to.be.equal(String(moment.unix(testData.tournament2.endAt).toDate()))
	})
	it('should get the correct tournament end time 3', function(){
		expect(tournament3.getEndTimeString()).to.be.equal(String(moment.unix(testData.tournament3.endAt).toDate()))
	})


	// venue
	it('should get the correct tournament venue 1', function(){
		expect(tournament1.getVenue()).to.deep.equal(testData.venue1)
	})
	it('should get the correct tournament venue 2', function(){
		expect(tournament2.getVenue()).to.deep.equal(testData.venue2)
	})
	it('should get the correct tournament venue 3', function(){
		expect(tournament3.getVenue()).to.deep.equal(testData.venue3)
	})


	// venue name
	it('should get the correct tournament venue name 1', function(){
		expect(tournament1.getVenueName()).to.be.equal(testData.tournament1.venueName)
		expect(tournament1.getVenueName()).to.be.equal(testData.venue1.name)
	})
	it('should get the correct tournament venue name 2', function(){
		expect(tournament2.getVenueName()).to.be.equal(testData.tournament2.venueName)
		expect(tournament2.getVenueName()).to.be.equal(testData.venue2.name)
	})
	it('should get the correct tournament venue name 3', function(){
		expect(tournament3.getVenueName()).to.be.equal(testData.tournament3.venueName)
		expect(tournament3.getVenueName()).to.be.equal(testData.venue3.name)
	})


	// venue city
	it('should get the correct tournament venue city 1', function(){
		expect(tournament1.getCity()).to.be.equal(testData.tournament1.city)
		expect(tournament1.getCity()).to.be.equal(testData.venue1.city)
	})
	it('should get the correct tournament venue city 2', function(){
		expect(tournament2.getCity()).to.be.equal(testData.tournament2.city)
		expect(tournament2.getCity()).to.be.equal(testData.venue2.city)
	})
	it('should get the correct tournament venue city 3', function(){
		expect(tournament3.getCity()).to.be.equal(testData.tournament3.city)
		expect(tournament3.getCity()).to.be.equal(testData.venue3.city)
	})


	// address
	it('should get the correct tournament venue address 1', function(){
		expect(tournament1.getAddress()).to.be.equal(testData.tournament1.venueAddress)
		expect(tournament1.getAddress()).to.be.equal(testData.venue1.address)
	})
	it('should get the correct tournament venue address 2', function(){
		expect(tournament2.getAddress()).to.be.equal(testData.tournament2.venueAddress)
		expect(tournament2.getAddress()).to.be.equal(testData.venue2.address)
	})
	it('should get the correct tournament venue address 3', function(){
		expect(tournament3.getAddress()).to.be.equal(testData.tournament3.venueAddress)
		expect(tournament3.getAddress()).to.be.equal(testData.venue3.address)
	})

	// state
	it('should get the correct tournament venue state 1', function(){
		expect(tournament1.getState()).to.be.equal(testData.tournament1.addrState)
		expect(tournament1.getState()).to.be.equal(testData.venue1.state)
	})
	it('should get the correct tournament venue state 2', function(){
		expect(tournament2.getState()).to.be.equal(testData.tournament2.addrState)
		expect(tournament2.getState()).to.be.equal(testData.venue2.state)
	})
	it('should get the correct tournament venue state 3', function(){
		expect(tournament3.getState()).to.be.equal(testData.tournament3.addrState)
		expect(tournament3.getState()).to.be.equal(testData.venue3.state)
	})


	// zip code
	it('should get the correct tournament venue zip code 1', function(){
		expect(tournament1.getZipCode()).to.be.equal(testData.tournament1.postalCode)
		expect(tournament1.getZipCode()).to.be.equal(testData.venue1.postalCode)
	})
	it('should get the correct tournament venue zip code 2', function(){
		expect(tournament2.getZipCode()).to.be.equal(testData.tournament2.postalCode)
		expect(tournament2.getZipCode()).to.be.equal(testData.venue2.postalCode)
	})
	it('should get the correct tournament venue zip code 3', function(){
		expect(tournament3.getZipCode()).to.be.equal(testData.tournament3.postalCode)
		expect(tournament3.getZipCode()).to.be.equal(testData.venue3.postalCode)
	})


	// organizer
	it('should get the correct tournament organizer 1', function(){
		expect(tournament1.getOrganizer()).to.deep.equal(testData.organizer1)
	})
	it('should get the correct tournament organizer 2', function(){
		expect(tournament2.getOrganizer()).to.deep.equal(testData.organizer2)
	})
	it('should get the correct tournament organizer 3', function(){
		expect(tournament3.getOrganizer()).to.deep.equal(testData.organizer3)
	})


	// organizer id
	it('should get the correct tournament organizer id 1', function(){
		expect(tournament1.getOwnerId()).to.be.equal(testData.tournament1.ownerId)
		expect(tournament1.getOwnerId()).to.be.equal(testData.organizer1.id)
	})
	it('should get the correct tournament organizer id 2', function(){
		expect(tournament2.getOwnerId()).to.be.equal(testData.tournament2.ownerId)
		expect(tournament2.getOwnerId()).to.be.equal(testData.organizer2.id)
	})
	it('should get the correct tournament organizer id 3', function(){
		expect(tournament3.getOwnerId()).to.be.equal(testData.tournament3.ownerId)
		expect(tournament3.getOwnerId()).to.be.equal(testData.organizer3.id)
	})


	// organizer contact info
	it('should get the correct tournament organizer contact info 1', function(){
		expect(tournament1.getContactInfo()).to.be.equal(testData.tournament1.contactInfo)
		expect(tournament1.getContactInfo()).to.be.equal(testData.organizer1.info)
	})
	it('should get the correct tournament organizer contact info 2', function(){
		expect(tournament2.getContactInfo()).to.be.equal(testData.tournament2.contactInfo)
		expect(tournament2.getContactInfo()).to.be.equal(testData.organizer2.info)
	})
	it('should get the correct tournament organizer contact info 3', function(){
		expect(tournament3.getContactInfo()).to.be.equal(testData.tournament3.contactInfo)
		expect(tournament3.getContactInfo()).to.be.equal(testData.organizer3.info)
	})


	// organizer contact email
	it('should get the correct tournament organizer contact email 1', function(){
		expect(tournament1.getContactEmail()).to.be.equal(testData.tournament1.contactEmail)
		expect(tournament1.getContactEmail()).to.be.equal(testData.organizer1.email)
	})
	it('should get the correct tournament organizer contact email 2', function(){
		expect(tournament2.getContactEmail()).to.be.equal(testData.tournament2.contactEmail)
		expect(tournament2.getContactEmail()).to.be.equal(testData.organizer2.email)
	})
	it('should get the correct tournament organizer contact email 3', function(){
		expect(tournament3.getContactEmail()).to.be.equal(testData.tournament3.contactEmail)
		expect(tournament3.getContactEmail()).to.be.equal(testData.organizer3.email)
	})


	// organizer contact info
	it('should get the correct tournament organizer contact twitter 1', function(){
		expect(tournament1.getContactTwitter()).to.be.equal(testData.tournament1.contactTwitter)
		expect(tournament1.getContactTwitter()).to.be.equal(testData.organizer1.twitter)
	})
	it('should get the correct tournament organizer contact twitter 2', function(){
		expect(tournament2.getContactTwitter()).to.be.equal(testData.tournament2.contactTwitter)
		expect(tournament2.getContactTwitter()).to.be.equal(testData.organizer2.twitter)
	})
	it('should get the correct tournament organizer contact twitter 3', function(){
		expect(tournament3.getContactTwitter()).to.be.equal(testData.tournament3.contactTwitter)
		expect(tournament3.getContactTwitter()).to.be.equal(testData.organizer3.twitter)
	})

	/*
	// sets
	it('should return the correct list of Sets in the Tournament 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await tournament1.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(84);
		return true;
	})
	xit('should return the correct list of Sets in the Tournament 2', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await tournament2.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(84);
		return true;
	})
	xit('should return the correct list of Sets in the Tournament 3', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await tournament3.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(84);
		return true;
	})

	// entrants


	// attendees
	*/
})