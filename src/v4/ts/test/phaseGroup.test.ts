import sinon, { SinonSandbox } from 'sinon'
import {expect} from 'chai'
import * as data from './data/phaseGroup.testData'
import * as setData from './data/sets.testData'
import * as gameData from './data/games.testData'
import * as entrantData from './data/entrant.testData'
import * as attendeeData from './data/attendee.testData'
import GGSetMock from './mocks/GGSet.mock'
import PhaseGroupMock from './mocks/PhaseGroup.mock'

const sandbox: SinonSandbox = sinon.createSandbox()
let mockPhaseGroups: PhaseGroupMock | null
let mockSets: GGSetMock | null

describe('Phase Group Unit Tests', () => {

	beforeEach(() => {
		mockSets = new GGSetMock(sandbox)
		mockPhaseGroups = new PhaseGroupMock(sandbox)
	})

	afterEach(() => {
		sandbox.restore()
		mockSets = null
		mockPhaseGroups = null
	})

	// Getters
	it('should get the id from its getter', () => {
		expect(data.phaseGroup1.getId()).to.be.equal(data.phaseGroupData1.phaseGroup.id)
	})

	// Aggregation
	it('should parse the set of attendees in the phase group', async () => {
		const expected = attendeeData.attendees
		const actual = await data.phaseGroup1.getAttendees()

		expect(actual).to.have.deep.members(expected)
	})
})
