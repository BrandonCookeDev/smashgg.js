import sinon, { SinonSandbox } from 'sinon'
import NI from '../../lib/util/NetworkInterface'

import * as setData from '../data/sets.testData'
import * as gameData from '../data/games.testData'
import * as entrantData from '../data/entrant.testData'
import * as attendeeData from '../data/attendee.testData'

import * as setQueries from '../../lib/scripts/setQueries'
import * as phaseGroupQueries from '../../lib/scripts/phaseGroupQueries'

export function phaseGroupQueryMock(q: string, a: object): Promise<object>{
	const parsed: IQueryArgs = a as IQueryArgs
	const id = parsed.id

	let ret: any = null
	switch(q){
		case phaseGroupQueries.phaseGroupAttendees:
			switch(id){
				case attendeeData.attendee1DataFull.participant.id:
					ret = [attendeeData.attendee1DataFull, attendeeData.attendee2DataFull, attendeeData.attendee3DataFull]
					break
			}
			break
		case phaseGroupQueries.phaseGroupEntrants:
			switch(id){
				case attendeeData.attendee1DataFull.participant.id:
					ret = [entrantData.entrantData1, entrantData.entrantData2]
					break
			}
		case phaseGroupQueries.phaseGroupSets:
			switch(id){
				case attendeeData.attendee1DataFull.participant.id:
					ret = [setData.set1Full, setData.set2Full]
					break
			}
		default: 
			throw new Error('Stub error: unknown query encountered: \n' + q)
	}

	return Promise.resolve(ret)
}

export function ggSetsQueryMock(q: string, a: object): Promise<object>{
	const parsed: IQueryArgs = a as IQueryArgs
	const id = parsed.id

	let ret: any = null
	switch(q){
		case setQueries.games:
			switch(id){
				case parseInt(setData.set1.id):
					ret = gameData.games1Full
					break
			}
			break
		case setQueries.attendees:
			switch(id){
				case parseInt(setData.set1.id):
					ret = attendeeData.slotAttendees1
					break
			}
			break
		case setQueries.entrants:
			switch(id){
				case parseInt(setData.set1.id):
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
