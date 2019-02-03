export class Game implements IGame.Game{
	id : number
	state: number
	winnerId : number
	orderNumber : number
	selections : IGame.Selections[]

	constructor(
		id : number,
		state: number,
		winnerId : number,
		orderNumber : number,
		selections : IGame.Selections[]
	){
		this.id  = id 
		this.state = state
		this.winnerId  = winnerId 
		this.orderNumber  = orderNumber 
		this.selections  = selections
	}

	static parse(data: IGame.GameData) : Game{
		return new Game(
			data.id,
			data.state,
			data.winnerId,
			data.orderNum,
			data.selections
		)
	}

	static parseFull(data: IGame.Data) : Game[]{
		return data.set.games.map(gameData => Game.parse(gameData))
	}

	getId() : number { 
		return this.id
	}

	getState(): number { 
		return this.state
	}

	getWinnerId() : number { 
		return this.winnerId
	}

	getOrderNumber() : number { 
		return this.orderNumber
	}

	getSelections() : IGame.Selections[] { 
		return this.selections
	}

}

export namespace IGame{
	export interface Game{
		id : number
		state: number
		winnerId : number
		orderNumber : number
		selections : Selections[]

		getId() : number
		getState(): number
		getWinnerId() : number
		getOrderNumber() : number
		getSelections() : Selections[]
	}

	export interface Data{
		set: {
			games: GameData[]
		}
	}

	export interface GameData{
		id: number
		state: number,
		winnerId: number
		orderNum: number
		selections: Selections[]
	}

	export interface Selections{
		selectionType: string
		selectionValue: string
		entrantId: number
		participantId: number
	}
}