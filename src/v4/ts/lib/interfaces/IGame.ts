
export interface IGame{
	/*
	id : number | string
	state: number
	winnerId : number
	orderNumber : number
	selections : Selections[]
	*/
	
	getId(): number | string
	getState(): number
	getWinnerId(): number
	getOrderNumber(): number
	getSelections(): ISelections[]
	getSelectionsForEntrantId(entrantId: number): ISelections | undefined
}

export interface IGameDataFull{
	set: {
		games: IGameData[]
	}
}

export interface IGameData{
	id: string
	state: number,
	winnerId: number
	orderNum: number
	selections: ISelectionsData[]
}

export interface ISelections{
	selectionType: string
	selectionValue: number
	entrantId: number
	attendeeId: number | null

	getSelectionType(): string
	getSelectionValue(): number
	getEntrantId(): number
	getAttendeeId(): number | null
}

export interface ISelectionsDataFull{
	selections: ISelectionsData[]
}

export interface ISelectionsData{
	selectionType: string
	selectionValue: number
	entrantId: number
	participantId: number | null
}
