
export namespace IVideoGame{

	export interface VideoGame{
		id: number
		data: Entity | string
		name: string
		abbrev: string
		displayName: string
		minPerEntry: number
		maxPerEntry: number
		approved: boolean
		slug: string 
		isCardGame: boolean
		rawEncoding: string

		encode(data: Entity, encoding: string) : Entity | string
		decode(data: Entity, encoding: string) : Entity
		getId() : number | undefined
		getName() : string | undefined
		getAbbreviation() : string | undefined
		getDisplayName() : string | undefined
		getMinPerEntry() : number | undefined
		getMaxPerEntry() : number | undefined
		getApproved() : boolean | undefined
		getSlug() : string | undefined
		getIsCardGame() : boolean | undefined
	}

	export interface Data{
		entities: {
			videogame: [Entity]
		}
	}

	export interface Entity{
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

}