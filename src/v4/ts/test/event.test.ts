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

import {Event} from '../lib/Event'
import {Phase} from '../lib/Phase'
import {PhaseGroup} from '../lib/PhaseGroup'
import {Entrant} from '../lib/Entrant'
import {Attendee} from '../lib/Attendee'
import {GGSet} from '../lib/GGSet'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/event.testData'

let event1: Event, event2: Event, event3: Event

const EVENT_ID_1 = 133902
const EVENT_SLUG_1 = 'tournament/21xx-cameron-s-birthday-bash-1/event/melee-singles'

const EVENT_ID_2 = 23597
const EVENT_SLUG_2 = 'tournament/tipped-off-12-presented-by-the-lab-gaming-center/event/melee-doubles'

const EVENT_ID_3 = 11787
const EVENT_SLUG_3 = 'tournament/ceo-2016/event/melee-singles'

describe('smashgg Event', function(){
	this.timeout(10000)

	before(async function(){
		this.timeout(20000)
		await Initializer(process.env.API_TOKEN!)

		let ei1 = await Event.get(EVENT_ID_1)
		let ei2 = await Event.get(EVENT_ID_2)
		let ei3 = await Event.get(EVENT_ID_3)

		let es1 = await Event.getBySlug(EVENT_SLUG_1)
		let es2 = await Event.getBySlug(EVENT_SLUG_2)
		let es3 = await Event.getBySlug(EVENT_SLUG_3)

		expect(ei1).to.deep.equal(es1)
		expect(ei2).to.deep.equal(es2)
		expect(ei3).to.deep.equal(es3)

		event1 = ei1;
		event2 = ei2;
		event3 = ei3;

		return true;
	})

	// id
	it('should return the correct event id 1', function(){
		expect(event1.getId()).to.be.equal(testData.event1.id)
	})
	it('should return the correct event id 2', function(){
		expect(event2.getId()).to.be.equal(testData.event2.id)
	})
	it('should return the correct event id 3', function(){
		expect(event3.getId()).to.be.equal(testData.event3.id)
	})

	// name
	it('should return the correct event name 1', function(){
		expect(event1.getName()).to.be.equal(testData.event1.name)
	})
	it('should return the correct event name 2', function(){
		expect(event2.getName()).to.be.equal(testData.event2.name)
	})
	it('should return the correct event name 3', function(){
		expect(event3.getName()).to.be.equal(testData.event3.name)
	})

	// slug
	it('should return the correct event slug 1', function(){
		expect(event1.getSlug()).to.be.equal(testData.event1.slug)
	})
	it('should return the correct event slug 2', function(){
		expect(event2.getSlug()).to.be.equal(testData.event2.slug)
	})
	it('should return the correct event slug 3', function(){
		expect(event3.getSlug()).to.be.equal(testData.event3.slug)
	})

	// state
	it('should return the correct event state 1', function(){
		expect(event1.getState()).to.be.equal(testData.event1.state)
	})
	it('should return the correct event state 2', function(){
		expect(event2.getState()).to.be.equal(testData.event2.state)
	})
	it('should return the correct event state 3', function(){
		expect(event3.getState()).to.be.equal(testData.event3.state)
	})

	// num entrants
	it('should return the correct event number of entrants 1', function(){
		expect(event1.getNumEntrants()).to.be.equal(testData.event1.numEntrants)
	})
	it('should return the correct event number of entrants 2', function(){
		expect(event2.getNumEntrants()).to.be.equal(testData.event2.numEntrants)
	})
	it('should return the correct event number of entrants 3', function(){
		expect(event3.getNumEntrants()).to.be.equal(testData.event3.numEntrants)
	})

	// check in buffer
	it('should return the correct event check in buffer 1', function(){
		expect(event1.getCheckInBuffer()).to.be.equal(testData.event1.checkInBuffer)
	})
	it('should return the correct event check in buffer 2', function(){
		expect(event2.getCheckInBuffer()).to.be.equal(testData.event2.checkInBuffer)
	})
	it('should return the correct event check in buffer 3', function(){
		expect(event3.getCheckInBuffer()).to.be.equal(testData.event3.checkInBuffer)
	})

	// check in duration
	it('should return the correct event check in duration 1', function(){
		expect(event1.getCheckInDuration()).to.be.equal(testData.event1.checkInDuration)
	})
	it('should return the correct event check in duration 2', function(){
		expect(event2.getCheckInDuration()).to.be.equal(testData.event2.checkInDuration)
	})
	it('should return the correct event check in duration 3', function(){
		expect(event3.getCheckInDuration()).to.be.equal(testData.event3.checkInDuration)
	})

	// check in enabled
	it('should return the correct event check in enabled setting 1', function(){
		expect(event1.getCheckInEnabled()).to.be.equal(testData.event1.checkInEnabled)
	})
	it('should return the correct event check in enabled setting 2', function(){
		expect(event2.getCheckInEnabled()).to.be.equal(testData.event2.checkInEnabled)
	})
	it('should return the correct event check in enabled setting 3', function(){
		expect(event3.getCheckInEnabled()).to.be.equal(testData.event3.checkInEnabled)
	})

	// is online
	it('should return the correct event is online setting 1', function(){
		expect(event1.getIsOnline()).to.be.equal(testData.event1.isOnline)
	})
	it('should return the correct event is online setting 2', function(){
		expect(event2.getIsOnline()).to.be.equal(testData.event2.isOnline)
	})
	it('should return the correct event is online setting 3', function(){
		expect(event3.getIsOnline()).to.be.equal(testData.event3.isOnline)
	})

	// team name allowed
	it('should return the correct event team name allowed setting 1', function(){
		expect(event1.getTeamNameAllowed()).to.be.equal(testData.event1.teamNameAllowed)
	})
	it('should return the correct event team name allowed setting 2', function(){
		expect(event2.getTeamNameAllowed()).to.be.equal(testData.event2.teamNameAllowed)
	})
	it('should return the correct event team name allowed setting 3', function(){
		expect(event3.getTeamNameAllowed()).to.be.equal(testData.event3.teamNameAllowed)
	})

	// team management deadline
	it('should return the correct event team management deadline 1', function(){
		expect(event1.getTeamManagementDeadline()).to.be.equal(testData.event1.teamManagementDeadline)
	})
	it('should return the correct event team management deadline 2', function(){
		expect(event2.getTeamManagementDeadline()).to.be.equal(testData.event2.teamManagementDeadline)
	})
	it('should return the correct event team management deadline 3', function(){
		expect(event3.getTeamManagementDeadline()).to.be.equal(testData.event3.teamManagementDeadline)
	})


	// phases
	it('should return the correct list of Phases in the Event 1', async function(){
		this.timeout(30000)

		let phases: Phase[] = await event1.getPhases();
		var hasDuplicates = function(a: Phase[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phases)).to.be.false;
		phases.forEach(phase => {
			expect(phase).to.be.an.instanceof(Phase);
		});
		expect(phases.length).to.be.equal(1);
		return true;
	})
	it('should return the correct list of Phases in the Event 2', async function(){
		this.timeout(30000)

		let phases: Phase[] = await event2.getPhases();
		var hasDuplicates = function(a: Phase[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phases)).to.be.false;
		phases.forEach(phase => {
			expect(phase).to.be.an.instanceof(Phase);
		});
		expect(phases.length).to.be.equal(2);
		return true;
	})
	it('should return the correct list of Phases in the Event 3', async function(){
		this.timeout(30000)

		let phases: Phase[] = await event3.getPhases();
		var hasDuplicates = function(a: Phase[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phases)).to.be.false;
		phases.forEach(phase => {
			expect(phase).to.be.an.instanceof(Phase);
		});
		expect(phases.length).to.be.equal(2);
		return true;
	})


	// phase groups
	it('should return the correct list of Phase Groups in the Event 1', async function(){
		this.timeout(30000)

		let groups: PhaseGroup[] = await event1.getPhaseGroups();
		var hasDuplicates = function(a: PhaseGroup[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups)).to.be.false;
		groups.forEach(group => {
			expect(group).to.be.an.instanceof(PhaseGroup);
		});
		expect(groups.length).to.be.equal(1);
		return true;
	})
	it('should return the correct list of Phase Groups in the Event 2', async function(){
		this.timeout(30000)

		let groups: PhaseGroup[] = await event2.getPhaseGroups();
		var hasDuplicates = function(a: PhaseGroup[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups)).to.be.false;
		groups.forEach(group => {
			expect(group).to.be.an.instanceof(PhaseGroup);
		});
		expect(groups.length).to.be.equal(9);
		return true;
	})
	it('should return the correct list of Phase Groups in the Event 3', async function(){
		this.timeout(30000)

		let groups: PhaseGroup[] = await event3.getPhaseGroups();
		var hasDuplicates = function(a: PhaseGroup[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups)).to.be.false;
		groups.forEach(group => {
			expect(group).to.be.an.instanceof(PhaseGroup);
		});
		expect(groups.length).to.be.equal(33);
		return true;
	})


	// entrants
	it('should return the correct list of Entrants in the Event 1', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await event1.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(75);
		return true;
	})
	xit('should return the correct list of Entrants in the Event 2', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await event2.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(100);
		return true;
	})
	xit('should return the correct list of Entrants in the Event 3', async function(){
		this.timeout(60000)

		let entrants: Entrant[] = await event3.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(725);
		return true;
	})


	// attendee
	it('should return the correct list of Attendees in the Event 1', async function(){
		this.timeout(30000)

		let attendees: Attendee[] = await event1.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(75);
		return true;
	})
	xit('should return the correct list of Attendees in the Event 2', async function(){
		this.timeout(30000)

		let attendees: Attendee[] = await event2.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(200);
		return true;
	})
	xit('should return the correct list of Attendees in the Event 3', async function(){
		this.timeout(60000)

		let attendees: Attendee[] = await event3.getAttendees();
		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(725);
		return true;
	})


	// sets
	it('should return the correct list of Sets in the Event 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await event1.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(98);
		return true;
	})
	xit('should return the correct list of Sets in the Event 2', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await event2.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(75);
		return true;
	})
	xit('should return the correct list of Sets in the Event 3', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await event3.getSets();
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(75);
		return true;
	})
})