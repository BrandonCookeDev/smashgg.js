
export namespace IPlayer{

	export interface Player{
		id: number
		tag: string
		name?: string
		country?: string
		state?: string
		sponsor?: string
		participantId?: number
		data?: Data

		loadData(data: Entity) : void
		getPlayer(id: number, options: Options) : Promise<Player>
		resolveEntities(player: Entity) : Player
		resolve(data: Entity) : Player
		getId() : number
		getTag(): string 
		getName(): string | undefined
		getCountry(): string | undefined
		getState(): string | undefined
		getSponsor(): string | undefined
		getParticipantId() : number | undefined
		getFinalPlacement() : number | undefined
		nullValueString(prop: string) : string
	}

	export interface Data{
		entities:[Entity]
	}

	export interface Entity{
		id: number,
		gamerTag: string,
		name: string,
		country: string,
		state: string,
		prefix: string,
		[x: string]: any
	}

	export interface Options{
		isCached?: boolean,
		rawEncoding?: string
	}

	

}