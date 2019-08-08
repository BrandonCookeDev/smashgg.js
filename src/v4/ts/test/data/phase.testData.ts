import {IPhaseData, IPhaseDataFull} from '../../lib/interfaces/IPhase'

export const phase1: IPhaseData = {
	id: 111483,
	name: 'Pools',
	numSeeds: 156,
	groupCount: 16
}

export const phase2: IPhaseData = {
	id: 45262,
	name: 'Pools',
	numSeeds: 678,
	groupCount: 32
}

export const phase3: IPhaseData = {
	id: 100046,
	name: 'Bracket Pools',
	numSeeds: 226,
	groupCount: 16
}

// 'event id': 25545,
export const phaseData1: IPhaseDataFull = {
	phase: phase1
}

// 'event id': 11787,
export const phaseData2: IPhaseDataFull = {
	phase: phase2
}

// 'event id': 23596,
export const phaseData3: IPhaseDataFull = {
	phase: phase3
}
