
export interface IVideoGame{
	// id: number
	// data: Entity | string
	// name: string
	// abbrev: string
	// displayName: string
	// minPerEntry: number
	// maxPerEntry: number
	// approved: boolean
	// slug: string 
	// isCardGame: boolean
	// rawEncoding: string

	loadData(data: IVideoGameData, encoding: string): IVideoGameData | string
	getData(data: IVideoGameData, encoding: string): IVideoGameData

	getId(): number | undefined
	getName(): string | undefined
	getAbbreviation(): string | undefined
	getDisplayName(): string | undefined
	getMinPerEntry(): number | undefined
	getMaxPerEntry(): number | undefined
	getApproved(): boolean | undefined
	getSlug(): string | undefined
	getIsCardGame(): boolean | undefined
	getRawEncoding(): string | undefined
}

export interface IVideoGameDataFull {
	entities: {
		videogame: [IVideoGameData]
	}
}

export interface IVideoGameData{
	id: number,
	name: string,
	abbrev: string,
	displayName: string,
	minPerEntry: number,
	maxPerEntry: number,
	approved: boolean,
	slug: string,
	isCardGame: boolean,
	[x: string]: any
}

export interface IVideoGameOptions{
	isCached?: boolean,
}
