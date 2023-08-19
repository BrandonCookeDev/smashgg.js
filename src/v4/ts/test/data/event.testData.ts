import {
	IEventData,
	IEventDataFull
} from '../../lib/interfaces/IEvent'

// NXT-LVL-55
export const event1: IEventData = {
    id: 822160,
    name: "Ultimate Singles",
    slug: "tournament/nxt-lvl-55/event/ultimate-singles",
    state: "COMPLETED",
    startAt: 1669424400,
    numEntrants: 31,
    checkInBuffer: 900,
    checkInDuration: 0,
    checkInEnabled: false,
    isOnline: false,
    teamNameAllowed: false,
    teamManagementDeadline: null
}

export const event2: IEventData = {
	id: 23597,
	name: 'Melee Doubles',
	slug: 'tournament/tipped-off-12-presented-by-the-lab-gaming-center/event/melee-doubles',
	state: 'COMPLETED',
	startAt: 1510401600,
	numEntrants: 61,
	checkInBuffer: 900,
	checkInDuration: 0,
	checkInEnabled: false,
	isOnline: false,
	teamNameAllowed: false,
	teamManagementDeadline: null
}

export const event3: IEventData = {
	id: 11787,
	name: 'Melee Singles',
	slug: 'tournament/ceo-2016/event/melee-singles',
	state: 'COMPLETED',
	startAt: 1466776800,
	numEntrants: 678,
	checkInBuffer: 900,
	checkInDuration: 0,
	checkInEnabled: false,
	isOnline: false,
	teamNameAllowed: null,
	teamManagementDeadline: null
}

export const eventData1: IEventDataFull = {
	event: event1
}

export const eventData2: IEventDataFull = {
	event: event2
}

export const eventData3: IEventDataFull = {
	event: event3
}
