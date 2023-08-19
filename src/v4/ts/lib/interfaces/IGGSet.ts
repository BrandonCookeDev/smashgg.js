import {IPlayerLite} from './IPlayerLite'
import {IEntrant, IEntrantData} from './IEntrant'
import {IAttendee, IAttendeeData} from './IAttendee'
import {IGame, IGameData} from './IGame'

export interface IGGSet{
	
	/*
	id: number
	eventId: number | null
	phaseGroupId: number | null
	displayScore: string  | null
	fullRoundText: string  | null
	round: number | null
	startedAt: number | null
	completedAt: number | null
	winnerId: number | null
	totalGames: number | null
	state: number | null
	player1: IGGSet.PlayerLite
	player2: IGGSet.PlayerLite
	score1: number | null
	score2: number | null
	*/
	
	getId(): number | null
	getEventId(): number | null
	getPhaseGroupId(): number | null
	getStartedAt(): Date | null 
	getCompletedAt(): Date | null 
	getDisplayScore(): string | null
	getFullRoundText(): string | null
	getRound(): number | null
	getState(): number | null
	getPlayer1(): IPlayerLite | undefined | null
	getPlayer1Tag(): string | undefined | null
	getPlayer1PlayerId(): number | undefined | null
	getPlayer1AttendeeIds(): number[] | undefined | null
	getPlayer2(): IPlayerLite | undefined | null
	getPlayer2Tag(): string | undefined | null
	getPlayer2PlayerId(): number | undefined | null
	getPlayer2AttendeeIds(): number[] | undefined | null
	getWinnerId(): number | null
	getLoserId(): number | null
	getIsComplete(): boolean | null
	//getCompletedTime(): Date | null
	getPlayer1Score(): number | null
	getPlayer2Score(): number | null
	getWinner(): IPlayerLite | undefined
	getLoser(): IPlayerLite | undefined
	getBestOfCount(): number | string
	getWinnerScore(): number | string
	getLoserScore(): number | string
	getStartedAtTimestamp(): number | null
	getCompletedAtTimestamp(): number | null
	getGames(): Promise<IGame[]>
	getEntrants(): Promise<IEntrant[]> 
	getAttendees(): Promise<IAttendee[]> 

	// getBracketId() : number | string 
	// getMidsizeRoundText() : string
	// getWinnersTournamentPlacement() : number | string
	// getLosersTournamentPlacement() : number | string
}

export interface IGGSetDataFull{
	set: IGGSetData
}

export interface IGGSetDataWithGames{
	set: {
		games: IGameData[]
	}
}

export interface IGGSetData{
	id: number
	completedAt: number | null
	displayScore: string | null
	event: {
	    id: number | null
	}
	fullRoundText: string | null
	identifier: string | null
	phaseGroup: {
	    id: number | null
	}
	round: number | null
	startedAt: number | null
	slots: IGGSetSlots[]
	state: number | null
	totalGames: number | null
	winnerId: number | null
}

export interface IGGSetSlots{
	id: string
	entrant: null | {
		id: number
		name: string
		participants: Array<{
			id: number
		}>
	}
}

export interface IGGSetSlotEntrantData{
	set: {
		slots: Array<{
			entrant: IEntrantData | null
		}>
	}
}

export interface IGGSetSlotAttendeeData{
	set: {
		slots: Array<{
			entrant: {
				participants: Array<IAttendeeData | null>
			}
		}>
	}
}

/*
export interface IGGSetSlotAttendeeData{
	participants: Array<IAttendeeData | null>
}
*/

export interface IGGSetOptions{
	filterDQs?: boolean,
	filterByes?: boolean,
	filterResets?: boolean,
	page?: number | null,
	perPage?: number | null,
	sortBy?: null | 'NONE' | 'STANDARD' | 'RACE_SPECTATOR' | 'ADMIN',
	filters?: null | {
		entrantIds?: number[],
		state?: number[],
		stationIds?: number[],
		phaseIds?: number[],
		phaseGroupIds?: number[],
		roundNumber?: number
	}
}
