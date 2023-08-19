import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
import * as log from '../lib/util/Logger'

import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {IPhase} from '../lib/interfaces/IPhase'

import {Phase} from '../lib/models/Phase'
import {PhaseGroup} from '../lib/models/PhaseGroup'
import {GGSet} from '../lib/models/GGSet'
import {Entrant} from '../lib/models/Entrant'
import {Attendee} from '../lib/models/Attendee'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/phase.testData'

const LOG_LEVEL = log.levels.DEBUG

const ID1 = 1255604
const EVENT_ID_1 = 822160
const PHASE_1_PG_COUNT = 1
const PHASE_1_SET_COUNT = 61
const PHASE_1_ENTRANT_COUNT = 31
const PHASE_1_ATTENDEE_COUNT = 31

const ID2 = 1242261
const EVENT_ID_2 = 432884
const PHASE_2_PG_COUNT = 2
const PHASE_2_SET_COUNT = 1164
const PHASE_2_ENTRANT_COUNT = 429
const PHASE_2_ATTENDEE_COUNT = 200

const ID3 = 1242262
const EVENT_ID_3 = 432884
const PHASE_3_PG_COUNT = 1
const PHASE_3_SET_COUNT = 1164
const PHASE_3_ENTRANT_COUNT = 226
const PHASE_3_ATTENDEE_COUNT = 226

let phase1: IPhase 
let phase2: IPhase 
let phase3: IPhase
// let concurrency = 4

describe('startgg Phase', function() {
	this.timeout(10000)

	before(async () => {
		log.setLogLevel(LOG_LEVEL)
		Initializer(process.env.API_TOKEN!)
		phase1 = await Phase.get(ID1, EVENT_ID_1)
		phase2 = await Phase.get(ID2, EVENT_ID_2)
		phase3 = await Phase.get(ID3, EVENT_ID_3)
	})

	// id
	it('should get the correct id of the Phase 1', () => {
		expect(phase1.getId()).to.be.equal(testData.phase1.id)
	})	
	it('should get the correct id of the Phase 2', () => {
		expect(phase2.getId()).to.be.equal(testData.phase2.id)
	})
	it('should get the correct id of the Phase 3', () => {
		expect(phase3.getId()).to.be.equal(testData.phase3.id)
	})

	// name
	it('should get the name of the Phase 1', () => {
		expect(phase1.getName()).to.be.equal(testData.phase1.name)
	})
	it('should get the name of the Phase 2', () => {
		expect(phase2.getName()).to.be.equal(testData.phase2.name)
	})
	it('should get the name of the Phase 3', () => {
		expect(phase3.getName()).to.be.equal(testData.phase3.name)
	})

	// event id
	it('should get the event id 1', () => {
		expect(phase1.getEventId()).to.be.equal(EVENT_ID_1)
	})
	it('should get the event id 2', () => {
		expect(phase2.getEventId()).to.be.equal(EVENT_ID_2)
	})
	it('should get the event id 3', () => {
		expect(phase3.getEventId()).to.be.equal(EVENT_ID_3)
	})

	// num seeds
	it('should get the Phase num seeds 1', () => {
		expect(phase1.getNumSeeds()).to.be.equal(testData.phase1.numSeeds)
	})
	it('should get the Phase num seeds 2', () => {
		expect(phase2.getNumSeeds()).to.be.equal(testData.phase2.numSeeds)
	})
	it('should get the Phase num seeds 3', () => {
		expect(phase3.getNumSeeds()).to.be.equal(testData.phase3.numSeeds)
	})

	// group count
	it('should get the Phase group count 1', () => {
		expect(phase1.getGroupCount()).to.be.equal(testData.phase1.groupCount)
	})
	it('should get the Phase group count 2', () => {
		expect(phase2.getGroupCount()).to.be.equal(testData.phase2.groupCount)
	})
	it('should get the Phase group count 3', () => {
		expect(phase3.getGroupCount()).to.be.equal(testData.phase3.groupCount)
	})

	// sets
	it('should correctly get all sets 1', async function() {
		this.timeout(60000)
		await testSets(phase1, PHASE_1_SET_COUNT)
		return true
	})

	xit('should correctly get all sets 2', async function() {
		this.timeout(120000)
		await testSets(phase2, PHASE_2_SET_COUNT)
		return true
	})

	xit('should correctly get all sets 3', async function() {
		this.timeout(60000)
		await testSets(phase3, PHASE_3_SET_COUNT)
		return true
	})

	// entrants
	it('should correctly get all entrants 1', async function() {
		this.timeout(60000)
		await testEntrants(phase1, PHASE_1_ENTRANT_COUNT)
		return true
	})
	xit('should correctly get all entrants 2', async function() {
		this.timeout(30000)
		await testEntrants(phase2, PHASE_2_ENTRANT_COUNT)
		return true
	})
	it('should correctly get all entrants 3', async function() {
		this.timeout(30000)
		await testEntrants(phase3, PHASE_3_ENTRANT_COUNT)
		return true
	})
	
	// attendee
	it('should correctly get all attendees 1', async function() {
		this.timeout(30000)
		await testAttendees(phase1, PHASE_1_ATTENDEE_COUNT)
		return true
	})
	xit('should correctly get all attendees 2', async function() {
		this.timeout(30000)
		await testAttendees(phase2, PHASE_2_ATTENDEE_COUNT)
		return true
	})
	it('should correctly get all attendees 3', async function() {
		this.timeout(60000)
		await testAttendees(phase3, PHASE_3_ATTENDEE_COUNT)
		return true
	})

	// phase groups
	it('should correctly get all phase groups 1', async function() {
		this.timeout(30000)
		await testPhaseGroups(phase1, PHASE_1_PG_COUNT)
		return true
	})
	it('should correctly get all phase groups 2', async function() {
		this.timeout(30000)
		await testPhaseGroups(phase2, PHASE_2_PG_COUNT)
		return true
	})
	it('should correctly get all phase groups 3', async function() {
		this.timeout(30000)
		await testPhaseGroups(phase3, PHASE_3_PG_COUNT)
		return true
	})

	/*
	it('should correctly get all phase groups', async () => {
		this.timeout(45000)

		let phaseGroups1 = await phase1.getPhaseGroups({concurrency: concurrency})

		expect(phaseGroups1.length).to.be.equal(16)

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length
		}
		expect(hasDuplicates(phaseGroups1)).to.be.false

		phaseGroups1.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup)
		})

		return true
	})

	it('should correctly get all phase groups 2', async () => {
		this.timeout(45000)
		
		let phaseGroups2 = await phase2.getPhaseGroups({concurrency: concurrency})

		expect(phaseGroups2.length).to.be.equal(32)

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length
		}
		expect(hasDuplicates(phaseGroups2)).to.be.false

		phaseGroups2.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup)
		})

		return true
	})

	it('should correctly get all phase groups 3', async () => {
		this.timeout(45000)
		
		let phaseGroups3 = await phase3.getPhaseGroups({concurrency: concurrency})

		expect(phaseGroups3.length).to.be.equal(16)

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length
		}
		expect(hasDuplicates(phaseGroups3)).to.be.false

		phaseGroups3.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup)
		})

		return true
	})

	it('should correctly get all sets for a phase', async () => {
		this.timeout(30000)

		let sets1 = await phase1.getSets({concurrency: concurrency})

		expect(sets1.length).to.be.equal(248)

		sets1.forEach(set => {
			expect(set).to.be.instanceof(GGSet)
		})

		return true
	})

	xit('should correctly get all sets for a phase 2', async () => {
		this.timeout(45000)
		
		let sets2 = await phase2.getSets({concurrency: concurrency})

		expect(sets2.length).to.be.equal(1292)

		sets2.forEach(set => {
			expect(set).to.be.instanceof(GGSet)
		})

		return true
	})

	it('should correctly get all sets for a phase 3', async () => {
		this.timeout(45000)
		
		let sets3 = await phase3.getSets({concurrency: concurrency})

		expect(sets3.length).to.be.equal(450)

		sets3.forEach(set => {
			expect(set).to.be.instanceof(GGSet)
		})

		return true
	})

	it('should correctly get all players for a phase', async () => {
		this.timeout(30000)
		
		let players1 = await phase1.getPlayers({concurrency: concurrency})

		expect(players1.length).to.be.equal(156)

		players1.forEach(set => {
			expect(set).to.be.instanceof(Entrant)
		})

		return true
	})

	it('should correctly get all players for a phase', async () => {
		this.timeout(30000)
		
		let players2 = await phase2.getPlayers({concurrency: concurrency})

		expect(players2.length).to.be.equal(678)

		players2.forEach(set => {
			expect(set).to.be.instanceof(Entrant)
		})

		return true
	})

	it('should correctly get sets x minutes back', async () => {
		this.timeout(30000)

		let minutesBack = 5
		let event = await Event.getEventById(phase1.getEventId(), {})
		let eventDate = moment(event.getStartTime() as Date).add(30, 'minutes').toDate()

		let clock = sinon.useFakeTimers(eventDate)
		let sets = await phase1.getSetsXMinutesBack(minutesBack)
		expect(sets.length).to.be.equal(5)
		sets.forEach(set=> {
			expect(set).to.be.instanceof(GGSet)

			let now = moment()
			let then = moment(set.getCompletedAt() as Date)
			let diff = moment.duration(now.diff(then)).minutes()
			expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true
		})
		clock.restore()
		return true
	})
	*/
})

//
async function testSets(phase: IPhase, expected: number){
	const arr = await phase.getSets()

	arr.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			arr.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)

}

async function testEntrants(phase: IPhase, expected: number){
	const arr = await phase.getEntrants()

	arr.forEach(entrant => {
		expect(entrant).to.be.an.instanceof(Entrant)
		expect(
			arr.filter(x => x.getId() === entrant.getId()).length,
			'Entrant array must not have duplicates! Found: ' + entrant.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
	
}

async function testAttendees(phase: IPhase, expected: number){
	const arr = await phase.getAttendees()

	arr.forEach(attendee => {
		expect(attendee).to.be.an.instanceof(Attendee)
		expect(
			arr.filter(x => x.getId() === attendee.getId()).length,
			'Attendee array must not have duplicates! Found: ' + attendee.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testPhaseGroups(phase: IPhase, expected: number){
	const arr = await phase.getPhaseGroups()

	arr.forEach(group => {
		expect(group).to.be.an.instanceof(PhaseGroup)
		expect(
			arr.filter(x => x.getId() === group.getId()).length,
			'Phase Group array must not have duplicates! Found: ' + group.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)

}
