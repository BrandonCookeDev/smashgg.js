import {IPhaseGroupData, IPhaseGroupDataFull} from '../../lib/interfaces/IPhaseGroup'

export const pg1: IPhaseGroupData = {
	id: 301994,
	displayIdentifier: 'A1',
	firstRoundTime: null,
	state: 3,
	phase: {
	    id: 100046,
	    name: "pools"
	},
	wave: {
	    id: 17271,
        identifier: "A",
        startAt: 1510416000
	},
	tiebreakOrder: null
}

export const pg2: IPhaseGroupData = {
	id: 887918,
	displayIdentifier: 'F16',
	firstRoundTime: null,
	state: 3,
	phase: {
	    id: 519506,
	    name: "pools"
	},
	wave: {
        id: 30123,
        identifier: "F",
        startAt: 1549080000
    },
	tiebreakOrder: []
}

export const pg3: IPhaseGroupData = {
	id: 44445,
	displayIdentifier: 'A7',
	firstRoundTime: null,
	state: 3,
	phase: {
	    id: 12883,
	    name: "pools"
	},
	wave: {
        id: 7330,
        identifier: "A",
        startAt: 1466776800
    },
	tiebreakOrder: null
}

export const pg4: IPhaseGroupData = {
	id: 618443,
	displayIdentifier: '1',
	firstRoundTime: null,
	state: 2,
	phase: {
	    id: 291494,
	    name: "bracket"
	},
	wave: null,
	tiebreakOrder: []
}

export const phaseGroupData1: IPhaseGroupDataFull = {
	phaseGroup: pg1
}

export const phaseGroupData2: IPhaseGroupDataFull = {
	phaseGroup: pg2
}

export const phaseGroupData3: IPhaseGroupDataFull = {
	phaseGroup: pg3
}

export const phaseGroupData4: IPhaseGroupDataFull = {
	phaseGroup: pg4
}
