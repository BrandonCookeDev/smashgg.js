import sinon, { SinonSandbox } from 'sinon'
import NI from '../../lib/util/NetworkInterface'
import * as data from '../data/sets.testData'
import * as gameData from '../data/games.testData'
import * as entrantData from '../data/entrant.testData'
import * as attendeeData from '../data/attendee.testData'
import * as queries from '../../lib/scripts/setQueries'

export default function setup(sandbox: SinonSandbox){
	sandbox.stub(NI, 'query')
		.callsFake(queryMock)
}

function queryMock(q: string, a: object): Promise<object>{
	const parsed: IQueryArgs = a as IQueryArgs
	const id = parsed.id

	let ret: any = null
	switch(q){
		case queries.games:
			switch(id){
				case parseInt(data.set1.id):
					ret = gameData.games1Full
					break
			}
			break
		case queries.attendees:
			switch(id){
				case parseInt(data.set1.id):
					ret = attendeeData.slotAttendees1
					break
			}
			break
		case queries.entrants:
			switch(id){
				case parseInt(data.set1.id):
					ret = entrantData.slot1EntrantData
					break
			}
			break
		default: 
			throw new Error('Stub error: unknown query encountered: \n' + q)
	}

	return Promise.resolve(ret)
}

interface IQueryArgs {
	id: number | string
}
