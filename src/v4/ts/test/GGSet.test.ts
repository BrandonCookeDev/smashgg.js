import sinon, { SinonSandbox } from 'sinon'
import {expect} from 'chai'
import * as data from './data/sets.testData'
import * as gameData from './data/games.testData'
import * as entrantData from './data/entrant.testData'
import * as attendeeData from './data/attendee.testData'
import GGSetMock from './mocks/GGSet.mock'

const sandbox: SinonSandbox = sinon.createSandbox()
let mockSets: GGSetMock | null = null

describe('GGSet Unit Tests', () => {
	beforeEach(() => {
		mockSets = new GGSetMock(sandbox)
		mockSets.mockQueries()
	})

	afterEach(() => {
		sandbox.restore()
		mockSets = null
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

	it('should get the entrants of a set correctly', async () => {
		const expected = [entrantData.entrant1]
		const actual = await data.ggSet1.getEntrants()

		expect(actual).to.have.deep.members(expected)
	})
})
