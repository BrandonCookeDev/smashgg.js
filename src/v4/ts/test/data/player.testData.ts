import {IEntrant} from '../../lib/Entrant'
import Data = IEntrant.Data
import EntrantData = IEntrant.EntrantData
import * as AttendeeData from './attendee.testData'


export const player1Data: EntrantData = {
	"id": 1106474,
	"name": "MVG FOX | Mew2King",
	"eventId": 23596,
	"skill": 10,
	"participants": [AttendeeData.participant1Data]
}

export const player2Data: EntrantData = {
	"id": 889002,
	"name": "OeS | NIX",
	"eventId": 23596,
	"skill": 8,
	"participants": [AttendeeData.participant2Data]
}

export const player3Data: EntrantData = {
	"id": 1128945,
	"name": "bobby big ballz",
	"eventId": 23596,
	"skill": 6,
	"participants": [AttendeeData.participant3Data]
}

export const entrant1: Data = {
	"entrant": player1Data
}
export const entrant2: Data = {
	"entrant": player2Data
}
export const entrant3: Data = {
	"entrant": player3Data
}