
export interface IVideoGame{
	// id: number
	// data: Entity | string

	loadData(data: IVideoGameData, encoding: string): IVideoGameData | string,
	getData(data: IVideoGameData, encoding: string): IVideoGameData,

	getId(): number | undefined,
	getAbbrev(): string | undefined,
    getName(): string | undefined,
	getDisplayName(): string | undefined,
	getSlug(): string | undefined,
}

export interface IVideoGameDataFull {
	entities: {
		videogame: [IVideoGameData]
	}
}

export interface IVideoGameData{
	id: number
    abbrev: string 
	name: string
    displayName: string
	slug: string
	[x: string]: any
}

export interface IVideoGameOptions{
	isCached?: boolean,
}
