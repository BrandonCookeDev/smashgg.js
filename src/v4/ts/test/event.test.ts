import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
//import * as log from '../lib/util/Logger'

import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {IGGSet} from '../lib/interfaces/IGGSet'
import {IEvent} from '../lib/interfaces/IEvent'
import {IPhase} from '../lib/interfaces/IPhase'
import {IEntrant} from '../lib/interfaces/IEntrant'
import {IAttendee} from '../lib/interfaces/IAttendee'

import {Event} from '../lib/models/Event'
import {Phase} from '../lib/models/Phase'
import {PhaseGroup} from '../lib/models/PhaseGroup'
import {Entrant} from '../lib/models/Entrant'
import {Attendee} from '../lib/models/Attendee'
import {GGSet} from '../lib/models/GGSet'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/event.testData'

let event1: IEvent, event2: IEvent, event3: IEvent

const EVENT_1_ID = 822160
const EVENT_1_SLUG = 'tournament/nxt-lvl-55/event/ultimate-singles'
const EVENT_1_TOURNAMENT_SLUG='nxt-lvl-55'
const EVENT_1_EVENT_SLUG='ultimate-singles'
const EVENT_1_PHASE_COUNT = 1
const EVENT_1_PHASE_GROUP_COUNT = 1
const EVENT_1_ENTRANT_COUNT = 31
const EVENT_1_ATTENDEE_COUNT = 31
const EVENT_1_SET_COUNT = 61

const EVENT_2_ID = 23597
const EVENT_2_SLUG = 'tournament/tipped-off-12-presented-by-the-lab-gaming-center/event/melee-doubles'
const EVENT_2_TOURNAMENT_SLUG='tipped-off-12-presented-by-the-lab-gaming-center'
const EVENT_2_EVENT_SLUG='melee-doubles'
const EVENT_2_PHASE_COUNT = 2
const EVENT_2_PHASE_GROUP_COUNT = 9
const EVENT_2_ENTRANT_COUNT = 60
const EVENT_2_ATTENDEE_COUNT = 120
const EVENT_2_SET_COUNT = 121

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

describe('startgg Event', function() {
	this.timeout(10000)

	before(async function() {
		this.timeout(20000)
		Initializer(process.env.API_TOKEN!)

        console.log("Getting events by getById...")
		const ei1 = await Event.getById(EVENT_1_ID)
		const ei2 = await Event.getById(EVENT_2_ID)
		const ei3 = await Event.getById(EVENT_3_ID)

        console.log("Getting events by getBySlug...")
		const es1 = await Event.getBySlug(EVENT_1_SLUG)
		const es2 = await Event.getBySlug(EVENT_2_SLUG)
		const es3 = await Event.getBySlug(EVENT_3_SLUG)

        console.log("Getting events by get()...")
		const e1 = await Event.get(EVENT_1_TOURNAMENT_SLUG, EVENT_1_EVENT_SLUG)
		const e2 = await Event.get(EVENT_2_TOURNAMENT_SLUG, EVENT_2_EVENT_SLUG)
		const e3 = await Event.get(EVENT_3_TOURNAMENT_SLUG, EVENT_3_EVENT_SLUG)
		
		expect(ei1).to.deep.equal(es1)
		expect(ei2).to.deep.equal(es2)
		expect(ei3).to.deep.equal(es3)
		expect(e1).to.deep.equal(es1)
		expect(e2).to.deep.equal(es2)
		expect(e3).to.deep.equal(es3)

		event1 = ei1
		event2 = ei2
		event3 = ei3

		return true
	})

	// id
	it('should return the correct event id 1', () => {
		expect(event1.getId()).to.be.equal(testData.event1.id)
	})
	it('should return the correct event id 2', () => {
		expect(event2.getId()).to.be.equal(testData.event2.id)
	})
	it('should return the correct event id 3', () => {
		expect(event3.getId()).to.be.equal(testData.event3.id)
	})

	// name
	it('should return the correct event name 1', () => {
		expect(event1.getName()).to.be.equal(testData.event1.name)
	})
	it('should return the correct event name 2', () => {
		expect(event2.getName()).to.be.equal(testData.event2.name)
	})
	it('should return the correct event name 3', () => {
		expect(event3.getName()).to.be.equal(testData.event3.name)
	})

	// slug
	it('should return the correct event slug 1', () => {
		expect(event1.getSlug()).to.be.equal(testData.event1.slug)
	})
	it('should return the correct event slug 2', () => {
		expect(event2.getSlug()).to.be.equal(testData.event2.slug)
	})
	it('should return the correct event slug 3', () => {
		expect(event3.getSlug()).to.be.equal(testData.event3.slug)
	})

	// state
	it('should return the correct event state 1', () => {
		expect(event1.getState()).to.be.equal(testData.event1.state)
	})
	it('should return the correct event state 2', () => {
		expect(event2.getState()).to.be.equal(testData.event2.state)
	})
	it('should return the correct event state 3', () => {
		expect(event3.getState()).to.be.equal(testData.event3.state)
	})

	// num entrants
	it('should return the correct event number of entrants 1', () => {
		expect(event1.getNumEntrants()).to.be.equal(testData.event1.numEntrants)
	})
	it('should return the correct event number of entrants 2', () => {
		expect(event2.getNumEntrants()).to.be.equal(testData.event2.numEntrants)
	})
	it('should return the correct event number of entrants 3', () => {
		expect(event3.getNumEntrants()).to.be.equal(testData.event3.numEntrants)
	})

	// check in buffer
	it('should return the correct event check in buffer 1', () => {
		expect(event1.getCheckInBuffer()).to.be.equal(testData.event1.checkInBuffer)
	})
	it('should return the correct event check in buffer 2', () => {
		expect(event2.getCheckInBuffer()).to.be.equal(testData.event2.checkInBuffer)
	})
	it('should return the correct event check in buffer 3', () => {
		expect(event3.getCheckInBuffer()).to.be.equal(testData.event3.checkInBuffer)
	})

	// check in duration
	it('should return the correct event check in duration 1', () => {
		expect(event1.getCheckInDuration()).to.be.equal(testData.event1.checkInDuration)
	})
	it('should return the correct event check in duration 2', () => {
		expect(event2.getCheckInDuration()).to.be.equal(testData.event2.checkInDuration)
	})
	it('should return the correct event check in duration 3', () => {
		expect(event3.getCheckInDuration()).to.be.equal(testData.event3.checkInDuration)
	})

	// check in enabled
	it('should return the correct event check in enabled setting 1', () => {
		expect(event1.getCheckInEnabled()).to.be.equal(testData.event1.checkInEnabled)
	})
	it('should return the correct event check in enabled setting 2', () => {
		expect(event2.getCheckInEnabled()).to.be.equal(testData.event2.checkInEnabled)
	})
	it('should return the correct event check in enabled setting 3', () => {
		expect(event3.getCheckInEnabled()).to.be.equal(testData.event3.checkInEnabled)
	})

	// is online
	it('should return the correct event is online setting 1', () => {
		expect(event1.getIsOnline()).to.be.equal(testData.event1.isOnline)
	})
	it('should return the correct event is online setting 2', () => {
		expect(event2.getIsOnline()).to.be.equal(testData.event2.isOnline)
	})
	it('should return the correct event is online setting 3', () => {
		expect(event3.getIsOnline()).to.be.equal(testData.event3.isOnline)
	})

	// team name allowed
	it('should return the correct event team name allowed setting 1', () => {
		expect(event1.getTeamNameAllowed()).to.be.equal(testData.event1.teamNameAllowed)
	})
	it('should return the correct event team name allowed setting 2', () => {
		expect(event2.getTeamNameAllowed()).to.be.equal(testData.event2.teamNameAllowed)
	})
	it('should return the correct event team name allowed setting 3', () => {
		expect(event3.getTeamNameAllowed()).to.be.equal(testData.event3.teamNameAllowed)
	})

	// team management deadline
	it('should return the correct event team management deadline 1', () => {
		expect(event1.getTeamManagementDeadline()).to.be.equal(testData.event1.teamManagementDeadline)
	})
	it('should return the correct event team management deadline 2', () => {
		expect(event2.getTeamManagementDeadline()).to.be.equal(testData.event2.teamManagementDeadline)
	})
	it('should return the correct event team management deadline 3', () => {
		expect(event3.getTeamManagementDeadline()).to.be.equal(testData.event3.teamManagementDeadline)
	})

	// phases
	it('should return the correct list of Phases in the Event 1', async function() {
		this.timeout(30000)
		await testPhases(event1, EVENT_1_PHASE_COUNT)
		return true
	})
	it('should return the correct list of Phases in the Event 2', async function() {
		this.timeout(30000)
		await testPhases(event2, EVENT_2_PHASE_COUNT)
		return true
	})
	it('should return the correct list of Phases in the Event 3', async function() {
		this.timeout(30000)
		await testPhases(event3, EVENT_3_PHASE_COUNT)
		return true
	})

	// phase groups
	it('should return the correct list of Phase Groups in the Event 1', async function() {
		this.timeout(30000)
		await testPhaseGroups(event1, EVENT_1_PHASE_GROUP_COUNT)
		return true
	})
	it('should return the correct list of Phase Groups in the Event 2', async function() {
		this.timeout(30000)
		await testPhaseGroups(event2, EVENT_2_PHASE_GROUP_COUNT)
		return true
	})
	it('should return the correct list of Phase Groups in the Event 3', async function() {
		this.timeout(30000)
		await testPhaseGroups(event3, EVENT_3_PHASE_GROUP_COUNT)
		return true
	})

	// entrants
	it('should return the correct list of Entrants in the Event 1', async function() {
		this.timeout(30000)
		await testEntrants(event1, EVENT_1_ENTRANT_COUNT)
		return true
	})
	it('should return the correct list of Entrants in the Event 2', async function() {
		this.timeout(30000)
		await testEntrants(event2, EVENT_2_ENTRANT_COUNT)
		return true
	})
	xit('should return the correct list of Entrants in the Event 3', async function() {
		this.timeout(60000)
		await testEntrants(event3, EVENT_3_ENTRANT_COUNT)
		return true
	})

	// attendee
	it('should return the correct list of Attendees in the Event 1', async function() {
		this.timeout(30000)
		await testAttendees(event1, EVENT_1_ATTENDEE_COUNT)
		return true
	})
	it('should return the correct list of Attendees in the Event 2', async function() {
		this.timeout(30000)
		await testAttendees(event2, EVENT_2_ATTENDEE_COUNT)
		return true
	})
	xit('should return the correct list of Attendees in the Event 3', async function() {
		this.timeout(60000)
		await testAttendees(event3, EVENT_3_ATTENDEE_COUNT)
		return true
	})

	// sets
	it('should return the correct list of Sets in the Event 1', async function() {
		this.timeout(30000)
		await testSets(event1, EVENT_1_SET_COUNT)
		return true
	})
	it('should return the correct list of Sets in the Event 2', async function() {
		this.timeout(60000)
		//console.log("GONNA SEND: " + EVENT_2_SET_COUNT)
		await testSets(event2, EVENT_2_SET_COUNT)
		return true
	})
})

async function testPhases(event: IEvent, expected: number){
	const phases: IPhase[] = await event.getPhases()
	
	phases.forEach(phase => {
		expect(phase).to.be.an.instanceof(Phase)
		expect(
			phases.filter(x => x.getId() === phase.getId()).length,
			'Phase array must not have duplicates! Found: ' + phase.getId()
		).to.be.equal(1)
	})
	expect(phases.length).to.be.equal(expected)
}

async function testPhaseGroups(event: IEvent, expected: number){
	const groups = await event.getPhaseGroups()

	groups.forEach(group => {
		expect(group).to.be.an.instanceof(PhaseGroup)
		expect(
			groups.filter(x => x.getId() === group.getId()).length,
			'Phase Group array must not have duplicates! Found: ' + group.getId()
		).to.be.equal(1)
	})
	expect(groups.length).to.be.equal(expected)

	return true
}

async function testEntrants(event: IEvent, expected: number){
	const entrants: IEntrant[] = await event.getEntrants()
	
	entrants.forEach(entrant => {
		expect(entrant).to.be.an.instanceof(Entrant)
		expect(
			entrants.filter(x => x.getId() === entrant.getId()).length,
			'Entrant array must not have duplicates! Found: ' + entrant.getId()
		).to.be.equal(1)
	})
	expect(entrants.length).to.be.equal(expected)
	return true
}

async function testAttendees(event: IEvent, expected: number){
	const attendees: IAttendee[] = await event.getAttendees()

	attendees.forEach(attendee => {
		expect(attendee).to.be.an.instanceof(Attendee)
		expect(
			attendees.filter(x => x.getId() === attendee.getId()).length,
			'Attendee array must not have duplicates! Found: ' + attendee.getId()
		).to.be.equal(1)
	})
	
	expect(attendees.length).to.be.equal(expected)
	return true
}

async function testSets(event: IEvent, expected: number){
    // console.log("THE NUMBER: " + expected)
	const sets: IGGSet[] = await event.getSets()

	sets.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			sets.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(sets.length).to.be.equal(expected)
}
