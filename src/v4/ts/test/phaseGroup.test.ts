import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import moment from 'moment'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {IPhaseGroup} from '../lib/interfaces/IPhaseGroup'

import {PhaseGroup} from '../lib/models/PhaseGroup'
import {Entrant} from '../lib/models/Entrant'
import {Attendee} from '../lib/models/Attendee'
import {GGSet} from '../lib/models/GGSet'
import {Seed} from '../lib/models/Seed'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/phaseGroup.testData'
import * as log from '../lib/util/Logger'

let phaseGroup1: IPhaseGroup
let phaseGroup2: IPhaseGroup
let phaseGroup3: IPhaseGroup
let phaseGroup4: IPhaseGroup

const ID1 = 301994
const ID2 = 887918 // g6 melee doubles top 6
const ID3 = 44445
const ID4 = 618443 // cameron's 21st, unfinished

const PG_1_START_AT = 1510401600 
const PG_1_DATE = moment.unix(PG_1_START_AT)
// Saturday, November 11, 2017 12:00:00 PM
// Saturday, November 11, 2017 7:00:00 AM GMT-05:00

const PG_4_START_AT = 1532210400 
const PG_4_DATE = moment.unix(PG_4_START_AT)
// Saturday, July 21, 2018 10:00:00 PM
// Saturday, July 21, 2018 6:00:00 PM GMT-04:00 DST

const PG_1_SEED_COUNT = 13
const PG_1_ENTRANT_COUNT = 13
const PG_1_ATTENDEE_COUNT = 13
const PG_1_SET_COUNT = 26
const PG_1_DQ_FILTERED_SET_COUNT = 26
const PG_1_RESET_FILTERED_SET_COUNT = 26
const PG_1_COMPLETED_SET_COUNT = 26
const PG_1_INCOMPLETE_SET_COUNT = 0

const PG_2_SEED_COUNT = 6
const PG_2_ENTRANT_COUNT = 6
const PG_2_ATTENDEE_COUNT = 12
const PG_2_SET_COUNT = 7
const PG_2_DQ_FILTERED_SET_COUNT = 7
// const PG_2_RESET_FILTERED_SET_COUNT = 
// const PG_2_COMPLETED_SET_COUNT = 
// const PG_2_INCOMPLETE_SET_COUNT = 

const PG_3_SEED_COUNT = 23
const PG_3_ENTRANT_COUNT = 23
const PG_3_ATTENDEE_COUNT = 46
const PG_3_SET_COUNT = 70
// const PG_3_DQ_FILTERED_SET_COUNT = 
// const PG_3_RESET_FILTERED_SET_COUNT = 
// const PG_3_COMPLETED_SET_COUNT = 
// const PG_3_INCOMPLETE_SET_COUNT = 

const PG_4_SEED_COUNT = 39
const PG_4_ENTRANT_COUNT = 39
const PG_4_ATTENDEE_COUNT = 39
const PG_4_SET_COUNT = 77
// const PG_4_DQ_FILTERED_SET_COUNT = 28
const PG_4_RESET_FILTERED_SET_COUNT = 76
const PG_4_COMPLETED_SET_COUNT = 72
const PG_4_INCOMPLETE_SET_COUNT = 5

const LOG_LEVEL = log.levels.VERBOSE

describe('startgg PhaseGroup', function() {
	this.timeout(15000)

	before(async () => {
		log.setLogLevel(LOG_LEVEL)
		Initializer(process.env.API_TOKEN!)
		phaseGroup1 = await PhaseGroup.get(ID1)
		phaseGroup2 = await PhaseGroup.get(ID2)
		phaseGroup3 = await PhaseGroup.get(ID3)
		phaseGroup4 = await PhaseGroup.get(ID4)
		return true
	})

	// id
	it('should return the correct phase group id 1', () => {
		expect(phaseGroup1.getId()).to.be.equal(testData.pg1.id)
	})
	it('should return the correct phase group id 2', () => {
		expect(phaseGroup2.getId()).to.be.equal(testData.pg2.id)
	})
	it('should return the correct phase group id 3', () => {
		expect(phaseGroup3.getId()).to.be.equal(testData.pg3.id)
	})
	it('should return the correct phase group id 4', () => {
		expect(phaseGroup4.getId()).to.be.equal(testData.pg4.id)
	})

	// phase id
	it('should return the correct phase id 1', () => {
		expect(phaseGroup1.getPhaseId()).to.be.equal(testData.pg1.phase.id)
	})
	it('should return the correct phase id 2', () => {
		expect(phaseGroup2.getPhaseId()).to.be.equal(testData.pg2.phase.id)
	})
	it('should return the correct phase id 3', () => {
		expect(phaseGroup3.getPhaseId()).to.be.equal(testData.pg3.phase.id)
	})
	it('should return the correct phase id 4', () => {
		expect(phaseGroup4.getPhaseId()).to.be.equal(testData.pg4.phase.id)
	})

	// displayIdentifier
	it('should return the correct display identifier 1', () => {
		expect(phaseGroup1.getDisplayIdentifier()).to.be.equal(testData.pg1.displayIdentifier)
	})
	it('should return the correct display identifier 2', () => {
		expect(phaseGroup2.getDisplayIdentifier()).to.be.equal(testData.pg2.displayIdentifier)
	})
	it('should return the correct display identifier 3', () => {
		expect(phaseGroup3.getDisplayIdentifier()).to.be.equal(testData.pg3.displayIdentifier)
	})
	it('should return the correct display identifier 4', () => {
		expect(phaseGroup4.getDisplayIdentifier()).to.be.equal(testData.pg4.displayIdentifier)
	})

	// firstRoundTime
	it('should return the correct first round time 1', () => {
		expect(phaseGroup1.getFirstRoundTime()).to.be.equal(testData.pg1.firstRoundTime)
	})
	it('should return the correct first round time 2', () => {
		expect(phaseGroup2.getFirstRoundTime()).to.be.equal(testData.pg2.firstRoundTime)
	})
	it('should return the correct first round time 3', () => {
		expect(phaseGroup3.getFirstRoundTime()).to.be.equal(testData.pg3.firstRoundTime)
	})
	it('should return the correct first round time 4', () => {
		expect(phaseGroup4.getFirstRoundTime()).to.be.equal(testData.pg4.firstRoundTime)
	})

	// wave idddd
	it('should return the correct wave id 1', () => {
		expect(phaseGroup1.getWaveId()).to.be.equal(testData.pg1.wave!.id)
	})
	it('should return the correct wave id 2', () => {
		expect(phaseGroup2.getWaveId()).to.be.equal(testData.pg2.wave!.id)
	})
	it('should return the correct wave id 3', () => {
		expect(phaseGroup3.getWaveId()).to.be.equal(testData.pg3.wave!.id)
	})
	it('should return the correct wave id 4', () => {
		expect(phaseGroup4.getWaveId()).to.be.equal(null)
	})

	// tiebreaker
	it('should return the correct tiebreaker order 1', () => {
		expect(phaseGroup1.getTiebreakOrder()).to.deep.equal(testData.pg1.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 2', () => {
		expect(phaseGroup2.getTiebreakOrder()).to.deep.equal(testData.pg2.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 3', () => {
		expect(phaseGroup3.getTiebreakOrder()).to.deep.equal(testData.pg3.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 4', () => {
		expect(phaseGroup4.getTiebreakOrder()).to.deep.equal(testData.pg4.tiebreakOrder)
	})

	// seeds
	it('should return the correct seeds 1', async function() {
		this.timeout(30000)
		await testSeeds(phaseGroup1, PG_1_SEED_COUNT)
		return true
	})
	it('should return the correct seeds 2', async function() {
		this.timeout(30000)
		await testSeeds(phaseGroup2, PG_2_SEED_COUNT)
		return true
	})
	xit('should return the correct seeds 3', async function() {
		this.timeout(30000)
		await testSeeds(phaseGroup3, PG_3_SEED_COUNT)
		return true
	})
	// Bracket was deleted? Might wanna change to different test case in the future
	xit('should return the correct seeds 4', async function() {
		this.timeout(30000)
		await testSeeds(phaseGroup4, PG_4_SEED_COUNT)
		return true
	})

	// entrants
	it('should return the correct entrants 1', async function() {
		this.timeout(30000)
		await testEntrants(phaseGroup1, PG_1_ENTRANT_COUNT)
		return true
	})
	it('should return the correct entrants 2', async function() {
		this.timeout(30000)
		await testEntrants(phaseGroup2, PG_2_ENTRANT_COUNT)
		return true
	})
	xit('should return the correct entrants 3', async function() {
		this.timeout(30000)
		await testEntrants(phaseGroup3, PG_3_ENTRANT_COUNT)
		return true
	})
	// Bracket was deleted? Might wanna change to different test case in the future
	xit('should return the correct entrants 4', async function() {
		this.timeout(30000)
		await testEntrants(phaseGroup4, PG_4_ENTRANT_COUNT)
		return true
	})
	
	// participants
	it('should return the correct attendees 1', async function() {
		this.timeout(30000)
		await testAttendees(phaseGroup1, PG_1_ATTENDEE_COUNT)
		return true
	})
	it('should return the correct attendees 2', async function() {
		this.timeout(30000)
		await testAttendees(phaseGroup2, PG_2_ATTENDEE_COUNT)
		return true
	})
	xit('should return the correct attendees 3', async function() {
		this.timeout(30000)
		await testAttendees(phaseGroup3, PG_3_ATTENDEE_COUNT)
		return true
	})
	// Bracket was deleted? Might wanna change to different test case in the future
	xit('should return the correct attendees 4', async function() {
		this.timeout(30000)
		await testAttendees(phaseGroup4, PG_4_ATTENDEE_COUNT)
		return true
	})

	// set
	it('should return the correct Sets 1', async function() {
		this.timeout(30000)
		await testSets(phaseGroup1, PG_1_SET_COUNT)
		return true
	})
	it('should return the correct Sets 2', async function() {
		this.timeout(30000)
		await testSets(phaseGroup2, PG_2_SET_COUNT)
		return true
	})
	xit('should return the correct Sets 3', async function() {
		this.timeout(30000)
		await testSets(phaseGroup3, PG_3_SET_COUNT)
		return true
	})
	// Bracket was deleted? Might wanna change to different test case in the future
	xit('should return the correct Sets 4', async function() {
		this.timeout(30000)
		await testSets(phaseGroup4, PG_4_SET_COUNT)
		return true
	})

	// sets filter dq
	it('should return the correct DQ filtered Sets 1', async function() {
		this.timeout(30000)
		await testSetsFilterDQ(phaseGroup1, PG_1_DQ_FILTERED_SET_COUNT)
		return true
	})
	it('should return the correct DQ filtered Sets 2', async function() {
		this.timeout(30000)
		await testSetsFilterDQ(phaseGroup2, PG_2_DQ_FILTERED_SET_COUNT)
		return true
	})

	// sets filter reset
	it('should return the correct Reset filtered Sets 1', async function() {
		this.timeout(30000)
		await testSetsFilterResets(phaseGroup1, PG_1_RESET_FILTERED_SET_COUNT)
		return true
	})
	// Bracket was deleted? Might wanna change to different test case in the future
	xit('should return the correct Reset filtered Sets 4', async function() {
		this.timeout(30000)
		await testSetsFilterResets(phaseGroup4, PG_4_RESET_FILTERED_SET_COUNT)
		return true
	})
	
	// completed sets
	it('should get the correct number of completed sets 1', async function() {
		this.timeout(30000)
		await testSetsCompleted(phaseGroup1, PG_1_COMPLETED_SET_COUNT)
		return true
	})
	// Bracket was deleted? Might wanna change to different test case in the future
	xit('should get the correct number of completed sets 4', async function() {
		this.timeout(30000)
		await testSetsCompleted(phaseGroup4, PG_4_COMPLETED_SET_COUNT)
		return true
	})

	// incompleted sets
	it('should get the correct number of incomplete sets 1', async function() {
		this.timeout(30000)
		await testSetsIncomplete(phaseGroup1, PG_1_INCOMPLETE_SET_COUNT)
		return true
	})
	// Bracket was deleted? Might wanna change to different test case in the future
	xit('should get the correct number of incomplete sets 4', async function() {
		this.timeout(30000)
		await testSetsIncomplete(phaseGroup4, PG_4_INCOMPLETE_SET_COUNT)
		return true
	})

	// finished x minutes ago
	/*
	xit('should get the correct number of sets completed x minutes ago 1', async function() => {
		this.timeout(30000)
		const fakeTime = PG_4_DATE.add(3, 'hours').toDate()
		const clock = sinon.useFakeTimers(fakeTime)

		const sets: IGGSet[] = await phaseGroup1.getSetsXMinutesBack(5)
		const hasDuplicates = function(a: IGGSet[]) {
			return _.uniq(a).length !== a.length
		}
		expect(hasDuplicates(sets)).to.be.false
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet)
		})
		expect(sets.length).to.be.equal(0)

		clock.restore()
		return true
	})
	xit('should get the correct number of sets completed x minutes ago 4', async function() => {
		this.timeout(30000)
		const fakeTime = PG_4_DATE.add(3, 'hours').toDate()
		const clock = sinon.useFakeTimers(fakeTime)

		const sets: IGGSet[] = await phaseGroup4.getSetsXMinutesBack(5)
		const hasDuplicates = (a: IGGSet[]) => {
			return _.uniq(a).length !== a.length
		}

		expect(hasDuplicates(sets)).to.be.equal(false)
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet)
		})
		expect(sets.length).to.be.equal(2)

		clock.restore()
		return true
	})
	*/
})

async function testSeeds(phaseGroup: IPhaseGroup, expected: number){  //# = 39
	const arr = await phaseGroup.getSeeds()

	arr.forEach(seed => {
		expect(seed).to.be.an.instanceof(Seed)
		expect(
			arr.filter(x => x.getId() === seed.getId()).length,
			'Seed array must not have duplicates! Found: ' + seed.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testSets(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getSets()

	arr.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			arr.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testSetsFilterDQ(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getSets({filterDQs: true})

	arr.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			arr.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testSetsFilterResets(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getSets({filterResets: true})

	arr.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			arr.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testSetsFilterByes(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getSets({filterByes: true})

	arr.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			arr.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testSetsCompleted(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getCompleteSets()

	arr.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			arr.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testSetsIncomplete(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getIncompleteSets()

	arr.forEach(set => {
		expect(set).to.be.an.instanceof(GGSet)
		expect(
			arr.filter(x => x.getId() === set.getId()).length,
			'Set array must not have duplicates! Found: ' + set.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testEntrants(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getEntrants()

	arr.forEach(entrant => {
		expect(entrant).to.be.an.instanceof(Entrant)
		expect(
			arr.filter(x => x.getId() === entrant.getId()).length,
			'Entrant array must not have duplicates! Found: ' + entrant.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}

async function testAttendees(phaseGroup: IPhaseGroup, expected: number){
	const arr = await phaseGroup.getAttendees()

	arr.forEach(attendee => {
		expect(attendee).to.be.an.instanceof(Attendee)
		expect(
			arr.filter(x => x.getId() === attendee.getId()).length,
			'Attendee array must not have duplicates! Found: ' + attendee.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(expected)
}
