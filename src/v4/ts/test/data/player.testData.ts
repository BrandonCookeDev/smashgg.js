import {IEntrantData, IEntrantDataFull} from '../../lib/interfaces/IEntrant'
import * as AttendeeData from './attendee.testData'

export const player1Data: IEntrantData = {
	id: 1106474,
	name: 'MVG FOX | Mew2King',
	eventId: 23596,
	skill: 10,
	participants: [AttendeeData.attendee1Data]
}

export const player2Data: IEntrantData = {
	id: 889002,
	name: 'OeS | NIX',
	eventId: 23596,
	skill: 8,
	participants: [AttendeeData.attendee2Data]
}

export const player3Data: IEntrantData = {
	id: 1128945,
	name: 'bobby big ballz',
	eventId: 23596,
	skill: 6,
	participants: [AttendeeData.attendee3Data]
}

export const entrant1: IEntrantDataFull = {
	entrant: player1Data
}
export const entrant2: IEntrantDataFull = {
	entrant: player2Data
}
export const entrant3: IEntrantDataFull = {
	entrant: player3Data
}
