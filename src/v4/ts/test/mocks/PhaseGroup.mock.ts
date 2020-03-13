import NI from '../../lib/util/NetworkInterface'
import { SinonSandbox } from 'sinon'
import {phaseGroupQueryMock} from './Queries.mock'
import GGSetsMock from './GGSet.mock'
import Mock from './Mock'
import * as queries from '../../lib/scripts/phaseGroupQueries'
import * as data from '../data/phaseGroup.testData'
import * as setData from '../data/sets.testData'
import * as entrantData from '../data/entrant.testData'
import * as attendeeData from '../data/attendee.testData'

export default class PhaseGroupMock extends Mock {

	protected setsMock: GGSetsMock

	constructor(sandbox: SinonSandbox){
		super(sandbox)
		this.setsMock = new GGSetsMock(this.sandbox)
	}

	public mock(): void{
		throw new Error('not implemented')
	}

	public mockQueries(): void{
		this.setsMock.mockQueries()
		this.sandbox.stub(NI, 'query')
			.callsFake(phaseGroupQueryMock)
	}
}
