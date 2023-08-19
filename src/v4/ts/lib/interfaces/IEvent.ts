
import {IPhase, IPhaseData} from './IPhase'
import {IPhaseGroup, IPhaseGroupData} from './IPhaseGroup'
import {IGGSet, IGGSetOptions, IGGSetData} from './IGGSet'
import {IEntrant, IEntrantOptions, IEntrantData} from './IEntrant'
import {IAttendee, IAttendeeOptions, IAttendeeData} from './IAttendee'
import {IStandingData} from './IStanding'

export interface IEvent{
	// id: number 
	// name: string
	// slug: string
	// state: string | null
	// startAt: number | null
	// numEntrants: number | null
	// checkInBuffer: number | null
	// checkInDuration: number | null
	// checkInEnabled: boolean | null
	// isOnline: boolean | null
	// teamNameAllowed: boolean | null
	// teamManagementDeadline: number | null

	getId(): number
	getName(): string
	getSlug(): string
	getState(): string | null
	getNumEntrants(): number | null
	getCheckInBuffer(): number | null
	getCheckInDuration(): number | null
	getCheckInEnabled(): boolean | null
	getIsOnline(): boolean | null
	getTeamNameAllowed(): boolean | null
	getTeamManagementDeadline(): number | null

	getPhases(): Promise<IPhase[]>
	getPhaseGroups(): Promise<IPhaseGroup[]>
	getEntrants(options?: IEntrantOptions): Promise<IEntrant[]>
	getAttendees(options?: IAttendeeOptions): Promise<IAttendee[]>
	getSets(options?: IGGSetOptions): Promise<IGGSet[]>
	getIncompleteSets(options?: IGGSetOptions): Promise<IGGSet[]>
	getCompleteSets(options?: IGGSetOptions): Promise<IGGSet[]>
	getSetsXMinutesBack(minutesBack: number, options: IGGSetOptions): Promise<IGGSet[]> 
}

export interface IEventDataFull{
	event: IEventData
}

export interface IEventData{
	id: number 
	name: string
	slug: string
	state: string | null
	startAt: number | null
	numEntrants: number | null
	checkInBuffer: number | null
	checkInDuration: number | null
	checkInEnabled: boolean | null
	isOnline: boolean | null
	teamNameAllowed: boolean | null
	teamManagementDeadline: number | null
}

export interface IEventPhaseData{
	event: {
		phases: IPhaseData[]
	}
}

export interface IEventPhaseGroupData{
	event: {
		phaseGroups: IPhaseGroupData[]
	}
}

export interface IEventEntrantData{
	event: {
		entrants: {
			pageInfo?: {
				totalPages: number
			},
			nodes: IEntrantData[]
		}
	}
}

export interface IEventAttendeeData{
	event: {
		tournament: {
			participants: {
				pageInfo?: {
					totalPages: number
				}
				nodes: IAttendeeData[]
			}
		}
	}
}

export interface IEventAttendeeData2{
	event: {
		entrants: {
			pageInfo?: {
				totalPages: number
			},
			nodes: IAttendeeData[]
		}
	}
}

export interface IEventSetData{
	event: {
		phaseGroups: {
			paginatedSets: {
				pageInfo?: {
					totalPages: number
				},
				nodes: IGGSetData[]
			}
		}
	}
}

export interface IEventStandings{
	event: {
		standings: {
			nodes: IStandingData[],
			pageInfo?: {
				totalPages: number
			}
		}
	}
}
