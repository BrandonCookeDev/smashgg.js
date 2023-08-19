import {IEntrant, IEntrantDataFull, IEntrantOptions} from './IEntrant'
import {IAttendee, IAttendeeData, IAttendeeOptions} from './IAttendee'
import {IGGSet, IGGSetData, IGGSetOptions} from './IGGSet'
import {ISeed, ISeedData, ISeedOptions} from './ISeed'

export interface IPhaseGroup{
	/*
	id: number
	phaseId: number
	displayIdentifier: string | null
	firstRoundTime: number | null
	state: number | null
	waveId: number | null
	tiebreakOrder: object | null
	*/

	getId(): number
	getPhaseId(): number | null
	getPhaseName(): string | null
	getDisplayIdentifier(): string | null
	getFirstRoundTime(): number | null
	getState(): number | null
	getWaveId(): number | null
	getWaveIdentifier(): string | null
	getWaveStartAt(): number | null
	getTiebreakOrder(): object | null
	getSeeds(options?: ISeedOptions): Promise<ISeed[]>
	getEntrants(options?: IEntrantOptions): Promise<IEntrant[]>
	getAttendees(options?: IAttendeeOptions): Promise<IAttendee[]>
	getSets(options?: IGGSetOptions): Promise<IGGSet[]>
	getCompleteSets(options?: IGGSetOptions): Promise<IGGSet[]>
	getIncompleteSets(options?: IGGSetOptions): Promise<IGGSet[]>
	getSetsXMinutesBack(minutes: number, options: IGGSetOptions): Promise<IGGSet[]>
}

export interface IPhaseGroupDataFull{
	phaseGroup: IPhaseGroupData
}

export interface IPhaseGroupEventData{
	event: {
		phaseGroups: IPhaseGroupData[]
	}
}

export interface IPhaseGroupData{
	id: number
	phase: {
	    id: number | null
	    name: string | null
	}
	displayIdentifier: string | null
	firstRoundTime: number | null
	state: number | null
	wave: {
	    id: number | null
	    identifier: string | null
	    startAt: number | null
	} | null
	tiebreakOrder: object | null
}

export interface IPhaseGroupEntrantData{
	phaseGroup: {
		paginatedSeeds: {
			pageInfo?: {
				totalPages: number
			},
			nodes: IEntrantDataFull[]
		}
	}
}

export interface IPhaseGroupAttendeeData{
	phaseGroup: {
		paginatedSeeds: {
			pageInfo?: {
				totalPages: number
			},
			nodes: {
				entrant: {
					participants: IAttendeeData[]
				}
			}
		}
	}
}

export interface IPhaseGroupSetData{
	phaseGroup: {
		paginatedSets: {
			pageInfo?: {
				totalPages: number
			},
			nodes: IGGSetData[]
		}
	}
}

export interface IPhaseGroupSeedData{
	phaseGroup: {
		paginatedSeeds: {
			pageInfo?: {
				totalPages: number
			},
			nodes: ISeedData[]
		}
	}
}
