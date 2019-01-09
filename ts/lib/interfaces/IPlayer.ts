
export namespace IPlayer{

	export interface Player{

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
		prefix: string
	}

	export interface Options{
		isCached?: boolean,
		rawEncoding?: string
	}

	

}