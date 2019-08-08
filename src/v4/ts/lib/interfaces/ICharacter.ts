
export interface ICharacter{
	// id: number
	// name: string
	// isCommon: boolean
	// videogameId: number

	getId(): number
	getName(): string
	getIsCommon(): boolean
	getVideoGameId(): number
}

export interface ICharacterDataFull{
	entities: ICharacterData,
	[x: string]: any
}

export interface ICharacterData{
	character: [ICharacterEntity],
	[x: string]: any
}

export interface ICharacterEntity{
	id: number,
	name: string, 
	isCommon: boolean,
	videogameId: number
}
