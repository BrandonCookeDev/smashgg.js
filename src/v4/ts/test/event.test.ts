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

const EVENT_1_ID = 133902
const EVENT_1_SLUG = 'tournament/21xx-cameron-s-birthday-bash-1/event/melee-singles'
const EVENT_1_TOURNAMENT_SLUG='21xx-cameron-s-birthday-bash-1'
const EVENT_1_EVENT_SLUG='melee-singles'
const EVENT_1_PHASE_COUNT = 1
const EVENT_1_PHASE_GROUP_COUNT = 1
const EVENT_1_ENTRANT_COUNT = 39
const EVENT_1_ATTENDEE_COUNT = 39
const EVENT_1_SET_COUNT = 77

const EVENT_2_ID = 23597
const EVENT_2_SLUG = 'tournament/tipped-off-12-presented-by-the-lab-gaming-center/event/melee-doubles'
const EVENT_2_TOURNAMENT_SLUG='tipped-off-12-presented-by-the-lab-gaming-center'
const EVENT_2_EVENT_SLUG='melee-doubles'
const EVENT_2_PHASE_COUNT = 2
const EVENT_2_PHASE_GROUP_COUNT = 9
const EVENT_2_ENTRANT_COUNT = 60
const EVENT_2_ATTENDEE_COUNT = 120
const EVENT_2_SET_COUNT = 77

const EVENT_3_ID = 11787
const EVENT_3_SLUG = 'tournament/ceo-2016/event/melee-singles'
const EVENT_3_TOURNAMENT_SLUG='ceo-2016'
const EVENT_3_EVENT_SLUG='melee-singles'
const EVENT_3_PHASE_COUNT = 2
const EVENT_3_PHASE_GROUP_COUNT = 33
const EVENT_3_ENTRANT_COUNT = 725
const EVENT_3_ATTENDEE_COUNT = 725

const TOP_8_LABELS = [
	'Losers Quarter-Final', 'Losers Quarter-Final', 
	'Losers Semi-Final', 'Losers Semi-Final', 
	'Winners Semi-Final', 'Winners Semi-Final',
	'Winners Final', 'Grand Final', 'Losers Final'
]
const GRAND_FINAL_RESET_TOKEN = 'Grand Final Reset'

describe('smashgg Event', function(){
	this.timeout(10000)

	before(async function(){
		this.timeout(20000)
		await Initializer(process.env.API_TOKEN!)

		let ei1 = await Event.getById(EVENT_1_ID)
		let ei2 = await Event.getById(EVENT_2_ID)
		let ei3 = await Event.getById(EVENT_3_ID)

		let es1 = await Event.getBySlug(EVENT_1_SLUG)
		let es2 = await Event.getBySlug(EVENT_2_SLUG)
		let es3 = await Event.getBySlug(EVENT_3_SLUG)

		let e1 = await Event.get(EVENT_1_TOURNAMENT_SLUG, EVENT_1_EVENT_SLUG)
		let e2 = await Event.get(EVENT_2_TOURNAMENT_SLUG, EVENT_2_EVENT_SLUG)
		let e3 = await Event.get(EVENT_3_TOURNAMENT_SLUG, EVENT_3_EVENT_SLUG)
		
		expect(ei1).to.deep.equal(es1)
		expect(ei2).to.deep.equal(es2)
		expect(ei3).to.deep.equal(es3)
		expect(e1).to.deep.equal(es1)
		expect(e2).to.deep.equal(es2)
		expect(e3).to.deep.equal(es3)

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
		await testPhases(event1, EVENT_1_PHASE_COUNT)
		return true;
	})
	it('should return the correct list of Phases in the Event 2', async function(){
		this.timeout(30000)
		await testPhases(event2, EVENT_2_PHASE_COUNT)
		return true;
	})
	it('should return the correct list of Phases in the Event 3', async function(){
		this.timeout(30000)
		await testPhases(event3, EVENT_3_PHASE_COUNT)
		return true;
	})


	// phase groups
	it('should return the correct list of Phase Groups in the Event 1', async function(){
		this.timeout(30000)
		await testPhaseGroups(event1, EVENT_1_PHASE_GROUP_COUNT)
		return true;
	})
	it('should return the correct list of Phase Groups in the Event 2', async function(){
		this.timeout(30000)
		await testPhaseGroups(event2, EVENT_2_PHASE_GROUP_COUNT)
		return true;
	})
	it('should return the correct list of Phase Groups in the Event 3', async function(){
		this.timeout(30000)
		await testPhaseGroups(event3, EVENT_3_PHASE_GROUP_COUNT)
		return true;
	})


	// entrants
	it('should return the correct list of Entrants in the Event 1', async function(){
		this.timeout(30000)
		await testEntrants(event1, EVENT_1_ENTRANT_COUNT)
		return true;
	})
	it('should return the correct list of Entrants in the Event 2', async function(){
		this.timeout(30000)
		await testEntrants(event2, EVENT_2_ENTRANT_COUNT)
		return true;
	})
	xit('should return the correct list of Entrants in the Event 3', async function(){
		this.timeout(60000)
		await testEntrants(event3, EVENT_3_ENTRANT_COUNT)
		return true;
	})

	// attendee
	it('should return the correct list of Attendees in the Event 1', async function(){
		this.timeout(30000)
		await testAttendees(event1, EVENT_1_ATTENDEE_COUNT)
		return true;
	})
	it('should return the correct list of Attendees in the Event 2', async function(){
		this.timeout(30000)
		await testAttendees(event2, EVENT_2_ATTENDEE_COUNT)
		return true;
	})
	xit('should return the correct list of Attendees in the Event 3', async function(){
		this.timeout(60000)
		await testAttendees(event3, EVENT_3_ATTENDEE_COUNT)
		return true;
	})


	// sets
	it('should return the correct list of Sets in the Event 1', async function(){
		this.timeout(30000)
		await testSets(event1, EVENT_1_SET_COUNT)
		return true;
	})
	it('should return the correct list of Sets in the Event 2', async function(){
		this.timeout(60000)
		await testSets(event2, EVENT_2_SET_COUNT)
		return true;
	})
})

async function testPhases(event: Event, expected: number){
	let phases: Phase[] = await event.getPhases();
	
	phases.forEach(phase => {
		expect(phase).to.be.an.instanceof(Phase);
		expect(
			phases.filter(x => x.id == phase.id).length,
			'Phase array must not have duplicates! Found: ' + phase.id
		).to.be.equal(1);
	});
	expect(phases.length).to.be.equal(expected);
}

async function testPhaseGroups(event: Event, expected: number){
	let groups = await event.getPhaseGroups()

	groups.forEach(group => {
		expect(group).to.be.an.instanceof(PhaseGroup);
		expect(
			groups.filter(x => x.id == group.id).length,
			'Phase Group array must not have duplicates! Found: ' + group.id
		).to.be.equal(1);
	});
	expect(groups.length).to.be.equal(expected);

	return true
}

async function testEntrants(event: Event, expected: number){
	let entrants: Entrant[] = await event.getEntrants();
	
	entrants.forEach(entrant => {
		expect(entrant).to.be.an.instanceof(Entrant);
		expect(
			entrants.filter(x => x.id == entrant.id).length,
			'Entrant array must not have duplicates! Found: ' + entrant.id
		).to.be.equal(1);
	});
	expect(entrants.length).to.be.equal(expected);
	return true;
}

async function testAttendees(event: Event, expected: number){
	let attendees: Attendee[] = await event.getAttendees();

	attendees.forEach(attendee => {
		expect(attendee).to.be.an.instanceof(Attendee);
		expect(
			attendees.filter(x => x.id == attendee.id).length,
			'Attendee array must not have duplicates! Found: ' + attendee.id
		).to.be.equal(1);
	});
	
	expect(attendees.length).to.be.equal(expected);
	return true;
}

async function testSets(event: Event, expected: number){
	let sets: GGSet[] = await event.getSets();

	sets.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet);
		expect(
			sets.filter(x => x.id == set.id).length,
			'Set array must not have duplicates! Found: ' + set.id
		).to.be.equal(1);
	});
	expect(sets.length).to.be.equal(EVENT_1_SET_COUNT);
}