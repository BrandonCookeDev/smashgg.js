import _ from 'lodash'

import {IGame, IGameData, IGameDataFull, ISelections} from '../interfaces/IGame'

import {Selections} from './Selections'

export class Game implements IGame{

	public static parse(data: IGameData): IGame{
		return new Game(
			+data.id,
			data.state,
			data.winnerId,
			data.orderNum,
			Selections.parseArray(data.selections)
		)
	}

	public static parseFull(data: IGameDataFull): IGame[]{
		return data.set.games.map(gameData => Game.parse(gameData))
	}

	private id: number | string
	private state: number
	private winnerId: number
	private orderNum: number
	private selections: ISelections[]

	constructor(
		id: number,
		state: number,
		winnerId: number,
		orderNum: number,
		selections: ISelections[]
	){
		this.id  = id 
		this.state = state
		this.winnerId  = winnerId 
		this.orderNum  = orderNum
		this.selections  = selections
	}

	public getId(): number | string { 
		return this.id
	}

	public getState(): number { 
		return this.state
	}

	public getWinnerId(): number { 
		return this.winnerId
	}

	public getOrderNum(): number {
		return this.orderNum
	}

	public getSelections(): ISelections[] { 
		return this.selections
	}

	public getSelectionsForEntrantId(theEntrantId: number): ISelections | undefined{
		return _.find(this.selections, {entrantId: theEntrantId}) as ISelections | undefined
	}
}
