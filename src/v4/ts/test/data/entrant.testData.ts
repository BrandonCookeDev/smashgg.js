import { Entrant } from '../../lib/models/Entrant'
import { IEntrant, IEntrantData } from '../../lib/interfaces/IEntrant'
import { IGGSetSlotEntrantData } from '../../lib/interfaces/IGGSet'
import * as attendeeData from './attendee.testData'

export const entrantData1: IEntrantData = {
	id: 90839,
	name: 'player1',
	eventId: 23596,
	skill: 1,
	participants: [
		attendeeData.attendee1Data
	]
}

export const entrantData2: IEntrantData = {
	id: 102938,
	name: 'player2',
	eventId: 23599,
	skill: 2,
	participants: [
		attendeeData.attendee2Data
	]
}

export const entrant1: IEntrant = new Entrant(
	entrantData1.id,
	entrantData1.name,
	entrantData1.eventId,
	entrantData1.skill,
	[attendeeData.attendee1]
)

export const entrant2: IEntrant = new Entrant(
	entrantData2.id,
	entrantData2.name,
	entrantData2.eventId,
	entrantData2.skill,
	[attendeeData.attendee2]
)

export const slot1EntrantData: IGGSetSlotEntrantData = {
	set: {
		slots: [{
			entrant: entrantData1	
		}]
	}
}

export const entrants = [ entrant1, entrant2 ]
