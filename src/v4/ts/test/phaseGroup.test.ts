import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import _ from 'lodash'
import moment from 'moment'
import sinon from 'sinon'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {PhaseGroup, IPhaseGroup} from '../lib/PhaseGroup'
import {Entrant} from '../lib/Entrant'
import {Attendee} from '../lib/Attendee'
import {GGSet} from '../lib/GGSet'
import {Seed} from '../lib/Seed'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/phaseGroup.testData'
import * as log from '../lib/util/Logger'


let phaseGroup1: PhaseGroup;
let phaseGroup2: PhaseGroup;
let phaseGroup3: PhaseGroup;
let phaseGroup4: PhaseGroup;

const ID1 = 301994
const ID2 = 887918 // g6 melee doubles top 6
const ID3 = 44445
const ID4 = 618443 // cameron's 21st, unfinished

const PG_1_START_AT = 1510401600 
const PG_1_DATE = moment.unix(PG_1_START_AT)
//Saturday, November 11, 2017 12:00:00 PM
//Saturday, November 11, 2017 7:00:00 AM GMT-05:00

const PG_4_START_AT = 1532210400 
const PG_4_DATE = moment.unix(PG_4_START_AT)
//Saturday, July 21, 2018 10:00:00 PM
//Saturday, July 21, 2018 6:00:00 PM GMT-04:00 DST

const LOG_LEVEL = log.levels.VERBOSE

describe('smash.gg PhaseGroup', function(){
	this.timeout(15000)

	before(async function(){
		log.setLogLevel(LOG_LEVEL)
		await Initializer(process.env.API_TOKEN!)
		phaseGroup1 = await PhaseGroup.get(ID1)
		phaseGroup2 = await PhaseGroup.get(ID2)
		phaseGroup3 = await PhaseGroup.get(ID3)
		phaseGroup4 = await PhaseGroup.get(ID4)
		return true
	})

	// id
	it('should return the correct phase group id 1', function(){
		expect(phaseGroup1.getId()).to.be.equal(testData.pg1.id)
	})
	it('should return the correct phase group id 2', function(){
		expect(phaseGroup2.getId()).to.be.equal(testData.pg2.id)
	})
	it('should return the correct phase group id 3', function(){
		expect(phaseGroup3.getId()).to.be.equal(testData.pg3.id)
	})
	it('should return the correct phase group id 4', function(){
		expect(phaseGroup4.getId()).to.be.equal(testData.pg4.id)
	})


	// phase id
	it('should return the correct phase id 1', function(){
		expect(phaseGroup1.getPhaseId()).to.be.equal(testData.pg1.phaseId)
	})
	it('should return the correct phase id 2', function(){
		expect(phaseGroup2.getPhaseId()).to.be.equal(testData.pg2.phaseId)
	})
	it('should return the correct phase id 3', function(){
		expect(phaseGroup3.getPhaseId()).to.be.equal(testData.pg3.phaseId)
	})
	it('should return the correct phase id 4', function(){
		expect(phaseGroup4.getPhaseId()).to.be.equal(testData.pg4.phaseId)
	})


	// displayIdentifier
	it('should return the correct display identifier 1', function(){
		expect(phaseGroup1.getDisplayIdentifier()).to.be.equal(testData.pg1.displayIdentifier)
	})
	it('should return the correct display identifier 2', function(){
		expect(phaseGroup2.getDisplayIdentifier()).to.be.equal(testData.pg2.displayIdentifier)
	})
	it('should return the correct display identifier 3', function(){
		expect(phaseGroup3.getDisplayIdentifier()).to.be.equal(testData.pg3.displayIdentifier)
	})
	it('should return the correct display identifier 4', function(){
		expect(phaseGroup4.getDisplayIdentifier()).to.be.equal(testData.pg4.displayIdentifier)
	})


	// firstRoundTime
	it('should return the correct first round time 1', function(){
		expect(phaseGroup1.getFirstRoundTime()).to.be.equal(testData.pg1.firstRoundTime)
	})
	it('should return the correct first round time 2', function(){
		expect(phaseGroup2.getFirstRoundTime()).to.be.equal(testData.pg2.firstRoundTime)
	})
	it('should return the correct first round time 3', function(){
		expect(phaseGroup3.getFirstRoundTime()).to.be.equal(testData.pg3.firstRoundTime)
	})
	it('should return the correct first round time 4', function(){
		expect(phaseGroup4.getFirstRoundTime()).to.be.equal(testData.pg4.firstRoundTime)
	})


	// wave id
	it('should return the correct wave id 1', function(){
		expect(phaseGroup1.getWaveId()).to.be.equal(testData.pg1.waveId)
	})
	it('should return the correct wave id 2', function(){
		expect(phaseGroup2.getWaveId()).to.be.equal(testData.pg2.waveId)
	})
	it('should return the correct wave id 3', function(){
		expect(phaseGroup3.getWaveId()).to.be.equal(testData.pg3.waveId)
	})
	it('should return the correct wave id 4', function(){
		expect(phaseGroup4.getWaveId()).to.be.equal(testData.pg4.waveId)
	})


	// tiebreaker
	it('should return the correct tiebreaker order 1', function(){
		expect(phaseGroup1.getTiebreakOrder()).to.deep.equal(testData.pg1.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 2', function(){
		expect(phaseGroup2.getTiebreakOrder()).to.deep.equal(testData.pg2.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 3', function(){
		expect(phaseGroup3.getTiebreakOrder()).to.deep.equal(testData.pg3.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 4', function(){
		expect(phaseGroup4.getTiebreakOrder()).to.deep.equal(testData.pg4.tiebreakOrder)
	})


	// seeds
	it('should return the correct seeds 1', async function(){
		this.timeout(30000)

		let seeds: Seed[] = await phaseGroup1.getSeeds();
		var hasDuplicates = function(a: Seed[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(seeds)).to.be.false;
		seeds.forEach(seed => {
			expect(seed).to.be.an.instanceof(Seed);
		});
		expect(seeds.length).to.be.equal(13);
		return true;
	})
	it('should return the correct seeds 2', async function(){
		this.timeout(30000)

		let seeds: Seed[] = await phaseGroup2.getSeeds();
		var hasDuplicates = function(a: Seed[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(seeds)).to.be.false;
		seeds.forEach(seed => {
			expect(seed).to.be.an.instanceof(Seed);
		});
		expect(seeds.length).to.be.equal(6);
		return true;
	})
	xit('should return the correct seeds 3', async function(){
		this.timeout(30000)

		let seeds: Seed[] = await phaseGroup3.getSeeds();
		var hasDuplicates = function(a: Seed[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(seeds)).to.be.false;
		seeds.forEach(seed => {
			expect(seed).to.be.an.instanceof(Seed);
		});
		expect(seeds.length).to.be.equal(23);
		return true;
	})
	it('should return the correct seeds 4', async function(){
		this.timeout(30000)

		let seeds: Seed[] = await phaseGroup4.getSeeds();
		var hasDuplicates = function(a: Seed[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(seeds)).to.be.false;
		seeds.forEach(seed => {
			expect(seed).to.be.an.instanceof(Seed);
		});
		expect(seeds.length).to.be.equal(50);
		return true;
	})

	
	// entrants
	it('should return the correct entrants 1', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup1.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(13);
		return true;
	})
	it('should return the correct entrants 2', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup2.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(6);
		return true;
	})
	xit('should return the correct entrants 3', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup3.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(23);
		return true;
	})
	it('should return the correct entrants 4', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup4.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(50);
		return true;
	})
	

	// participants
	it('should return the correct attendees 1', async function(){
		this.timeout(30000)

		let attendees: Attendee[] = await phaseGroup1.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(13);
		return true;
	})
	it('should return the correct attendees 2', async function(){
		this.timeout(30000)

		let attendees: Attendee[] = await phaseGroup2.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(12);
		return true;
	})
	xit('should return the correct attendees 3', async function(){
		this.timeout(30000)

		let attendees: Attendee[] = await phaseGroup3.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(46);
		return true;
	})
	it('should return the correct attendees 4', async function(){
		this.timeout(30000)

		let attendees: Attendee[] = await phaseGroup4.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(50);
		return true;
	})


	// set
	it('should return the correct Sets 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup1.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(28);
		return true;
	})
	it('should return the correct Sets 2', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup2.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(7);
		return true;
	})
	xit('should return the correct Sets 3', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup3.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(70);
		return true;
	})
	it('should return the correct Sets 4', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup4.getSets()
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

	
	// sets filter dq
	it('should return the correct DQ filtered Sets 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup1.getSets({filterDQs: true})
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(28);
		return true;
	})
	it('should return the correct DQ filtered Sets 2', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup2.getSets({filterDQs: true})
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(7);
		return true;
	})


	// sets filter reset
	it('should return the correct Reset filtered Sets 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup1.getSets({filterResets: true})
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(28);
		return true;
	})
	it('should return the correct Reset filtered Sets 4', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup4.getSets({filterResets: true})
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(78);
		return true;
	})

	
	// completed sets
	it('should get the correct number of completed sets 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup1.getCompleteSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(28);
		return true;
	})
	it('should get the correct number of completed sets 4', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup4.getCompleteSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(54);
		return true;
	})


	// incompleted sets
	it('should get the correct number of incomplete sets 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup1.getIncompleteSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(0);
		return true;
	})
	it('should get the correct number of incomplete sets 4', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup4.getIncompleteSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(30); // really should be 2
		return true;
	})


	// finished x minutes ago
	xit('should get the correct number of sets completed x minutes ago 1', async function(){
		this.timeout(30000)
		let fakeTime = PG_4_DATE.add(3, 'hours').toDate()
		let clock = sinon.useFakeTimers(fakeTime)

		let sets: GGSet[] = await phaseGroup1.getSetsXMinutesBack(5)
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(0);

		clock.restore()
		return true;
	})
	xit('should get the correct number of sets completed x minutes ago 4', async function(){
		this.timeout(30000)
		let fakeTime = PG_4_DATE.add(3, 'hours').toDate()
		let clock = sinon.useFakeTimers(fakeTime)

		let sets: GGSet[] = await phaseGroup4.getSetsXMinutesBack(5)
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(2);

		clock.restore()
		return true;
	})
})