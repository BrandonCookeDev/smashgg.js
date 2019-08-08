import {IPhaseGroupData, IPhaseGroupDataFull} from '../../lib/interfaces/IPhaseGroup'

export const pg1: IPhaseGroupData = {
	id: 301994,
	displayIdentifier: 'A1',
	firstRoundTime: null,
	state: 3,
	phaseId: 100046,
	waveId: 17271,
	tiebreakOrder: null
}

export const pg2: IPhaseGroupData = {
	id: 887918,
	displayIdentifier: 'F16',
	firstRoundTime: null,
	state: 3,
	phaseId: 519506,
	waveId: 30123,
	tiebreakOrder: []
}

export const pg3: IPhaseGroupData = {
	id: 44445,
	displayIdentifier: 'A7',
	firstRoundTime: null,
	state: 3,
	phaseId: 12883,
	waveId: 7330,
	tiebreakOrder: null
}

export const pg4: IPhaseGroupData = {
	id: 618443,
	displayIdentifier: '1',
	firstRoundTime: null,
	state: 2,
	phaseId: 291494,
	waveId: null,
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
