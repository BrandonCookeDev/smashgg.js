import {IPhaseData, IPhaseDataFull} from '../../lib/interfaces/IPhase'

// NXT LVL 55
export const phase1: IPhaseData = {
    id: 1255604,
    name: "Bracket",
    numSeeds: 31,
    groupCount: 1,
}

// Port Priority 7 - Top 128
export const phase2: IPhaseData = {
    id: 1242261,
    name: "Top 128",
    numSeeds: 128,
    groupCount: 2
}

// Port Priority 7 - Top 8
export const phase3: IPhaseData = {
    id: 1242262,
    name: "Top 8",
    numSeeds: 8,
    groupCount: 1
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
