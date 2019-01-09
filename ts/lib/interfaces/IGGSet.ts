
import { IPlayer } from './IPlayer'
import { ICommon } from './ICommon'

export namespace IGGSet{

	export interface GGSet{
		id: number
		eventId: number
		round: string
		player1?: IPlayer.Player
		player2?: IPlayer.Player
		isComplete: boolean
		score1?: number
		score2?: number
		winnerId?: number
		loserId?: number
		data?: Entity

		//getSet(id: number, options: ICommon.Options) : Promise<GGSet>
		//resolve(data: Entity) : Promise<GGSet>
		
		getRound() : string
		getPlayer1() : IPlayer.Player | null
		getPlayer2() : IPlayer.Player | null
		getWinnerId() : number | null
		getLoserId() : number | null
		getIsComplete() : boolean | string
		getPlayer1Score() : number | null
		getPlayer2Score() : number | null
		getWinner() : IPlayer.Player | undefined
		getLoser() : IPlayer.Player | undefined
		getGames() : number | string
		getBestOfCount() : number | string
		getWinnerScore() : number | string
		getLoserScore() : number | string
		getBracketId() : number | string 
		getMidsizeRoundText() : string
		getPhaseGroupId() : number | string
		getWinnersTournamentPlacement() : number | string
		getLosersTournamentPlacement() : number | string
		getStartedAt() : Date | null 
		getCompletedAt() : Date | null 
		nullValueString(prop: string) : string
	}

	export interface Data{
		entities: [Entity]
	}

	export interface Entity{
		id: number,
		eventId: number,
		fullRoundText: string,
		entrant1Score: number,
		entrant2Score: number,
		entrant1Id?: number,
		entrant2Id?: number,
		winnerId?: number,
		loserId?: number,
		startedAt?: number,
		completedAt?: number,
		[x: string]: any
	}
}