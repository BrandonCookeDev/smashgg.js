import {IEntrant, IEntrantOptions, IEntrantData} from './IEntrant'
import {IGGSet, IGGSetOptions, IGGSetData} from './IGGSet'
import {IPhaseGroup, IPhaseGroupData} from './IPhaseGroup'
import {IAttendeeData} from './IAttendee'
import {ISeedData} from './ISeed'

export interface IPhase{
	/*
	id: number
	name: string
	eventId: number
	numSeeds: number
	groupCount: number
	*/

	getId(): number
	getEventId(): number
	getName(): string
	getNumSeeds(): number
	getGroupCount(): number	
	getPhaseGroups(): Promise<IPhaseGroup[]>
	getSets(options: IGGSetOptions): Promise<IGGSet[]>
	getEntrants(options: IEntrantOptions): Promise<IEntrant[]>
	getIncompleteSets(options: IGGSetOptions): Promise<IGGSet[]>
	getCompleteSets(options: IGGSetOptions): Promise<IGGSet[]>
	getSetsXMinutesBack(minutesBack: number, options: IGGSetOptions): Promise<IGGSet[]>

}

export interface IPhaseDataFull{
	phase: IPhaseData 
}

export interface IPhaseDataSeeds{
	event: IPhaseSeedData
}

export interface IPhaseDataSets{
	event: IPhaseSetData
}

export interface IPhaseDataEntrants{
	event: IPhaseEntrantData
}

export interface IPhasePaginatedData{
	phase: {
		phaseGroups: {
			nodes: IPhaseGroupData[]
		}
	}
}

export interface IPhaseData{
	id: number,
	name: string,
	numSeeds: number,
	groupCount: number
}

export interface IPhaseSeedData{
	phase: {
		paginatedSeeds: {
			pageInfo?: {
				totalPages: number
			}
			nodes: ISeedData[]
		} 
	}
}

export interface IPhaseSetData{
	id: number,
	phaseGroups: {
		paginatedSets: {
			pageInfo?: { totalPages: number }
			nodes: IGGSetData[]
		}
	}
}

export interface IPhaseEntrantData{
	phase: {
		paginatedSeeds: {
			pageInfo?: {
				totalPages: number
			}
			nodes: IEntrantData[]
		} 
	}
}

export interface IPhasePhaseGroupData{
	event: {
		phaseGroups: IPhaseGroupData[]
	}
}

export interface IPhaseAttendeeData{
	phase: {
		paginatedSeeds: Array<{
			pageInfo?: {
				totalPages: number
			}
			nodes: {
				entrant: {
					participants: IAttendeeData[]
				}
			}
		}>
	}
}
