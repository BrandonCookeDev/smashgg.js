import _ from 'lodash'

export class Game implements IGame.Game{
	id : number | string
	state: number
	winnerId : number
	orderNumber : number
	selections : Selections[]

	constructor(
		id : number,
		state: number,
		winnerId : number,
		orderNumber : number,
		selections : Selections[]
	){
		this.id  = id 
		this.state = state
		this.winnerId  = winnerId 
		this.orderNumber  = orderNumber 
		this.selections  = selections
	}

	static parse(data: IGame.GameData) : Game{
		return new Game(
			+data.id,
			data.state,
			data.winnerId,
			data.orderNum,
			Selections.parseArray(data.selections)
		)
	}

	static parseFull(data: IGame.Data) : Game[]{
		return data.set.games.map(gameData => Game.parse(gameData))
	}

	getId() : number | string { 
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

	getSelections() : Selections[] { 
		return this.selections
	}

	getSelectionsForEntrantId(entrantId: number): Selections | undefined{
		return _.find(this.selections, {entrantId: entrantId});
	}
}

export class Selections implements ISelections.Selections{

	selectionType: string
	selectionValue: number
	entrantId: number
	attendeeId: number | null

	constructor(
		selectionType: string,
		selectionValue: number,
		entrantId: number,
		participantId: number | null
	){
		this.selectionType = selectionType
		this.selectionValue = selectionValue
		this.entrantId = entrantId
		this.attendeeId = participantId
	}

	static parse(data: ISelections.SelectionsData) : Selections{
		return new Selections(
			data.selectionType,
			data.selectionValue,
			data.entrantId,
			data.participantId
		)
	}

	static parseArray(data: ISelections.SelectionsData[]) : Selections[]{
		return data.map(e => Selections.parse(e));
	}

	static parseFull(data: ISelections.Data) : Selections[]{
		return data.selections.map(selectionsData => Selections.parse(selectionsData));
	}

	getSelectionType(): string{
		return this.selectionType
	}

	getSelectionValue(): number{
		return this.selectionValue
	}

	getEntrantId(): number{
		return this.entrantId
	}

	getAttendeeId(): number | null{
		return this.attendeeId
	}
}

export namespace IGame{
	export interface Game{
		id : number | string
		state: number
		winnerId : number
		orderNumber : number
		selections : Selections[]

		getId() : number | string
		getState(): number
		getWinnerId() : number
		getOrderNumber() : number
		getSelections() : Selections[]
		getSelectionsForEntrantId(entrantId: number): Selections | undefined
	}

	export interface Data{
		set: {
			games: GameData[]
		}
	}

	export interface GameData{
		id: string
		state: number,
		winnerId: number
		orderNum: number
		selections: ISelections.SelectionsData[]
	}
}

export namespace ISelections{
	export interface Selections{
		selectionType: string
		selectionValue: number
		entrantId: number
		attendeeId: number | null

		getSelectionType(): string
		getSelectionValue(): number
		getEntrantId(): number
		getAttendeeId(): number | null
	}

	export interface Data{
		"selections": SelectionsData[]
	}

	export interface SelectionsData{
		selectionType: string
		selectionValue: number
		entrantId: number
		participantId: number | null
	}
}