import {IPhaseGroupData, IPhaseGroupDataFull} from '../../lib/interfaces/IPhaseGroup'
import { PhaseGroup } from '../../lib/models/PhaseGroup'

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

export const phaseGroup1: PhaseGroup = new PhaseGroup(
	phaseGroupData1.phaseGroup.id,
	phaseGroupData1.phaseGroup.phaseId,
	phaseGroupData1.phaseGroup.displayIdentifier,
	phaseGroupData1.phaseGroup.firstRoundTime,
	phaseGroupData1.phaseGroup.state,
	phaseGroupData1.phaseGroup.waveId,
	phaseGroupData1.phaseGroup.tiebreakOrder
)

export const phaseGroup2: PhaseGroup = new PhaseGroup(
	phaseGroupData2.phaseGroup.id,
	phaseGroupData2.phaseGroup.phaseId,
	phaseGroupData2.phaseGroup.displayIdentifier,
	phaseGroupData2.phaseGroup.firstRoundTime,
	phaseGroupData2.phaseGroup.state,
	phaseGroupData2.phaseGroup.waveId,
	phaseGroupData2.phaseGroup.tiebreakOrder
)

export const phaseGroup3: PhaseGroup = new PhaseGroup(
	phaseGroupData3.phaseGroup.id,
	phaseGroupData3.phaseGroup.phaseId,
	phaseGroupData3.phaseGroup.displayIdentifier,
	phaseGroupData3.phaseGroup.firstRoundTime,
	phaseGroupData3.phaseGroup.state,
	phaseGroupData3.phaseGroup.waveId,
	phaseGroupData3.phaseGroup.tiebreakOrder
)

export const phaseGroup4: PhaseGroup = new PhaseGroup(
	phaseGroupData4.phaseGroup.id,
	phaseGroupData4.phaseGroup.phaseId,
	phaseGroupData4.phaseGroup.displayIdentifier,
	phaseGroupData4.phaseGroup.firstRoundTime,
	phaseGroupData4.phaseGroup.state,
	phaseGroupData4.phaseGroup.waveId,
	phaseGroupData4.phaseGroup.tiebreakOrder
)