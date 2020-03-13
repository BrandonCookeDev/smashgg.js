import sinon, { SinonSandbox } from 'sinon'
import NI from '../../lib/util/NetworkInterface'
import {ggSetsQueryMock} from './Queries.mock'
import * as data from '../data/sets.testData'
import * as gameData from '../data/games.testData'
import * as entrantData from '../data/entrant.testData'
import * as attendeeData from '../data/attendee.testData'
import * as queries from '../../lib/scripts/setQueries'
import Mock from './Mock'

export default class GGSetMock extends Mock{
	
	constructor(sandbox: SinonSandbox){
		super(sandbox)
	}

	public mock(): void {
		this.sandbox.stub(data.ggSet1, 'getGames').resolves(gameData.games1)
		this.sandbox.stub(data.ggSet2, 'getGames').resolves(gameData.games2)
		this.sandbox.stub(data.ggSet3, 'getGames').resolves(gameData.games3)
	
		this.sandbox.stub(data.ggSet1, 'getAttendees').resolves([attendeeData.attendee1])
		this.sandbox.stub(data.ggSet2, 'getAttendees').resolves([attendeeData.attendee2])
		this.sandbox.stub(data.ggSet3, 'getAttendees').resolves([attendeeData.attendee3])
	
		this.sandbox.stub(data.ggSet1, 'getEntrants').resolves([entrantData.entrant1])
		this.sandbox.stub(data.ggSet2, 'getEntrants').resolves([entrantData.entrant2])
		this.sandbox.stub(data.ggSet3, 'getEntrants').resolves([entrantData.entrant1])
	}

	public mockQueries(): void{
		this.sandbox.stub(NI, 'query')
			.callsFake(ggSetsQueryMock)
	}
}
