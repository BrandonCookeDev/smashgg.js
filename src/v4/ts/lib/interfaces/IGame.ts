
export interface IGame{
	/*
	id : number | string
	state: number
	winnerId : number
	orderNumber : number
	selections : Selections[]
	*/
	
	getId(): number | string
	getOrderNum(): number
	getSelections(): ISelections[]
	getSelectionsForEntrantId(entrantId: number): ISelections | undefined
	getState(): number
	getWinnerId(): number
}

export interface IGameDataFull{
	set: {
		games: IGameData[]
	}
}

export interface IGameData{
	id: string
	orderNum: number
	selections: ISelectionsData[]
	state: number,
	winnerId: number
}

export interface ISelections{
	// selectionType: string
	// selectionValue: number
	// entrantId: number
	// attendeeId: number | null

	getParticipantId(): number | null
	getEntrantId(): number
	getSelectionType(): string
	getSelectionValue(): number
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
