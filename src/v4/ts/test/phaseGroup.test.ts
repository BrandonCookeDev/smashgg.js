import sinon, { SinonSandbox } from 'sinon'
import {expect} from 'chai'
import mockSets from './mocks/GGSet.mock'
import * as data from './data/sets.testData'
import * as gameData from './data/games.testData'
import * as attendeeData from './data/attendee.testData'

const sandbox: SinonSandbox = sinon.createSandbox()

describe('Phase Group Unit Tests', () => {
	beforeEach(() => {
		mockSets(sandbox)
	})

	afterEach(() => {
		sandbox.restore()
	})

	it('should get the games of a set correctly', async () => {
		const expected = gameData.games1
		const actual = await data.ggSet1.getGames()

		expect(actual).to.have.deep.members(expected)
	})

	it('should get the attendees of a set correctly', async () => {
		const expected = attendeeData.attendees
		const actual = await data.ggSet1.getAttendees()

		expect(actual).to.have.deep.members(expected)
	})
})
