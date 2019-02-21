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

import {Phase, IPhase} from '../lib/Phase'
import {PhaseGroup} from '../lib/PhaseGroup'
import {GGSet} from '../lib/GGSet'
import {Entrant} from '../lib/Entrant'
import {Attendee} from '../lib/Attendee'
import Initializer from '../lib/util/Initializer';
import * as testData from './data/phase.testData'

const LOG_LEVEL = log.levels.DEBUG

const ID1 = 111483
const ID2 = 45262
const ID3 = 100046
const EVENT_ID_1 = 25545
const EVENT_ID_2 = 11787
const EVENT_ID_3 = 23596

let phase1: Phase; 
let phase2: Phase; 
let phase3: Phase;
let concurrency = 4;


describe('Smash GG Phase', function(){
	this.timeout(10000)

	before(async () => {
		log.setLogLevel(LOG_LEVEL);
		await Initializer(process.env.API_TOKEN!)
		phase1 = await Phase.get(ID1, EVENT_ID_1)
		phase2 = await Phase.get(ID2, EVENT_ID_2)
		phase3 = await Phase.get(ID3, EVENT_ID_3)
		return
	})


	// id
	it('should get the correct id of the Phase 1', function(){
		expect(phase1.getId()).to.be.equal(testData.phase1.id)
	})	
	it('should get the correct id of the Phase 2', function(){
		expect(phase2.getId()).to.be.equal(testData.phase2.id)
	})
	it('should get the correct id of the Phase 3', function(){
		expect(phase3.getId()).to.be.equal(testData.phase3.id)
	})

	// name
	it('should get the name of the Phase 1', function(){
		expect(phase1.getName()).to.be.equal(testData.phase1.name)
	})
	it('should get the name of the Phase 2', function(){
		expect(phase2.getName()).to.be.equal(testData.phase2.name)
	})
	it('should get the name of the Phase 3', function(){
		expect(phase3.getName()).to.be.equal(testData.phase3.name)
	})


	// event id
	it('should get the event id 1', function(){
		expect(phase1.getEventId()).to.be.equal(EVENT_ID_1)
	})
	it('should get the event id 2', function(){
		expect(phase2.getEventId()).to.be.equal(EVENT_ID_2)
	})
	it('should get the event id 3', function(){
		expect(phase3.getEventId()).to.be.equal(EVENT_ID_3)
	})


	// num seeds
	it('should get the Phase num seeds 1', function(){
		expect(phase1.getNumSeeds()).to.be.equal(testData.phase1.numSeeds)
	})
	it('should get the Phase num seeds 2', function(){
		expect(phase2.getNumSeeds()).to.be.equal(testData.phase2.numSeeds)
	})
	it('should get the Phase num seeds 3', function(){
		expect(phase3.getNumSeeds()).to.be.equal(testData.phase3.numSeeds)
	})


	// group count
	it('should get the Phase group count 1', function(){
		expect(phase1.getGroupCount()).to.be.equal(testData.phase1.groupCount)
	})
	it('should get the Phase group count 2', function(){
		expect(phase2.getGroupCount()).to.be.equal(testData.phase2.groupCount)
	})
	it('should get the Phase group count 3', function(){
		expect(phase3.getGroupCount()).to.be.equal(testData.phase3.groupCount)
	})


	// sets
	it('should correctly get all sets 1', async function(){
		this.timeout(60000)

		let sets: GGSet[] = await phase1.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(152);
		return true;
	})

	xit('should correctly get all sets 2', async function(){
		this.timeout(120000)

		let sets: GGSet[] = await phase2.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(1164);
		return true;
	})

	xit('should correctly get all sets 3', async function(){
		this.timeout(60000)

		let sets: GGSet[] = await phase2.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(1164);
		return true;
	})


	// entrants
	it('should correctly get all entrants 1', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phase1.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(set => {
			expect(set).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(175);
		return true;
	})
	xit('should correctly get all entrants 2', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phase2.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(set => {
			expect(set).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(429);
		return true;
	})
	it('should correctly get all entrants 3', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phase3.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(set => {
			expect(set).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(250);
		return true;
	})

	
	// attendee
	it('should correctly get all attendees 1', async function(){
		this.timeout(30000)

		let attendee: Attendee[] = await phase1.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendee)).to.be.false;
		attendee.forEach(set => {
			expect(set).to.be.an.instanceof(Attendee);
		});
		expect(attendee.length).to.be.equal(175);
		return true;
	})
	xit('should correctly get all attendees 2', async function(){
		this.timeout(30000)

		let attendee: Attendee[] = await phase2.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendee)).to.be.false;
		attendee.forEach(set => {
			expect(set).to.be.an.instanceof(Attendee);
		});
		expect(attendee.length).to.be.equal(200);
		return true;
	})
	it('should correctly get all attendees 3', async function(){
		this.timeout(30000)

		let attendee: Attendee[] = await phase3.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendee)).to.be.false;
		attendee.forEach(set => {
			expect(set).to.be.an.instanceof(Attendee);
		});
		expect(attendee.length).to.be.equal(250);
		return true;
	})


	// phase groups
	it('should correctly get all phase groups 1', async function(){
		this.timeout(30000)

		let groups: PhaseGroup[] = await phase1.getPhaseGroups();
		var hasDuplicates = function(a: PhaseGroup[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups)).to.be.false;
		groups.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});
		expect(groups.length).to.be.equal(16);
		return true;
	})
	it('should correctly get all phase groups 2', async function(){
		this.timeout(30000)

		let groups: PhaseGroup[] = await phase2.getPhaseGroups();
		var hasDuplicates = function(a: PhaseGroup[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups)).to.be.false;
		groups.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});
		expect(groups.length).to.be.equal(32);
		return true;
	})
	it('should correctly get all phase groups 3', async function(){
		this.timeout(30000)

		let groups: PhaseGroup[] = await phase3.getPhaseGroups();
		var hasDuplicates = function(a: PhaseGroup[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups)).to.be.false;
		groups.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});
		expect(groups.length).to.be.equal(16);
		return true;
	})


	/*
	it('should correctly get all phase groups', async function(){
		this.timeout(45000)

		let phaseGroups1 = await phase1.getPhaseGroups({concurrency: concurrency});

		expect(phaseGroups1.length).to.be.equal(16);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phaseGroups1)).to.be.false;

		phaseGroups1.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});

		return true;
	});

	it('should correctly get all phase groups 2', async function(){
		this.timeout(45000);
		
		let phaseGroups2 = await phase2.getPhaseGroups({concurrency: concurrency});

		expect(phaseGroups2.length).to.be.equal(32);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phaseGroups2)).to.be.false;

		phaseGroups2.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});

		return true
	})

	it('should correctly get all phase groups 3', async function(){
		this.timeout(45000);
		
		let phaseGroups3 = await phase3.getPhaseGroups({concurrency: concurrency});

		expect(phaseGroups3.length).to.be.equal(16);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phaseGroups3)).to.be.false;

		phaseGroups3.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup)
		})

		return true;
	})

	it('should correctly get all sets for a phase', async function(){
		this.timeout(30000)

		let sets1 = await phase1.getSets({concurrency: concurrency});

		expect(sets1.length).to.be.equal(248);

		sets1.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	xit('should correctly get all sets for a phase 2', async function(){
		this.timeout(45000);
		
		let sets2 = await phase2.getSets({concurrency: concurrency});

		expect(sets2.length).to.be.equal(1292);

		sets2.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	it('should correctly get all sets for a phase 3', async function(){
		this.timeout(45000);
		
		let sets3 = await phase3.getSets({concurrency: concurrency});

		expect(sets3.length).to.be.equal(450);

		sets3.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true
	})

	it('should correctly get all players for a phase', async function(){
		this.timeout(30000)
		
		let players1 = await phase1.getPlayers({concurrency: concurrency});

		expect(players1.length).to.be.equal(156);

		players1.forEach(set => {
			expect(set).to.be.instanceof(Entrant)
		})

		return true;
	})

	it('should correctly get all players for a phase', async function(){
		this.timeout(30000);
		
		let players2 = await phase2.getPlayers({concurrency: concurrency});

		expect(players2.length).to.be.equal(678);

		players2.forEach(set => {
			expect(set).to.be.instanceof(Entrant)
		})

		return true
	})

	it('should correctly get sets x minutes back', async function(){
		this.timeout(30000)

		let minutesBack = 5;
		let event = await Event.getEventById(phase1.getEventId(), {});
		let eventDate = moment(event.getStartTime() as Date).add(30, 'minutes').toDate();

		let clock = sinon.useFakeTimers(eventDate)
		let sets = await phase1.getSetsXMinutesBack(minutesBack)
		expect(sets.length).to.be.equal(5)
		sets.forEach(set=> {
			expect(set).to.be.instanceof(GGSet);

			let now = moment();
			let then = moment(set.getCompletedAt() as Date);
			let diff = moment.duration(now.diff(then)).minutes();
			expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
		})
		clock.restore()
		return true
	})
	*/
})