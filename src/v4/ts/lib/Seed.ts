
import {Entrant} from './Entrant'
import {Standings} from './Standings'

export class Seed implements ISeed.Seed{
	id: number
	entrantId: number
	placeholderName: string
	seedNumber: number
	placement: number
	isBye: boolean

	constructor(
		id: number,
		entrantId: number,
		placeholderName: string,
		seedNumber: number,
		placement: number,
		isBye: boolean
	){
		this.id = id
		this.entrantId = entrantId
		this.placeholderName = placeholderName
		this.seedNumber = seedNumber
		this.placement = placement
		this.isBye = isBye
	}

	static parse(data: ISeed.SeedData) : Seed {
		return new Seed(
			data.id,
			data.entrantId,
			data.placeholderName,
			data.seedNumber,
			data.placement,
			data.isBye
		)
	}

	static parseFull(data: ISeed.Data) : Seed[]{
		return data.seed.map(seedData => Seed.parse(seedData))
	}

	// TODO get entrant.... somehow
}


export namespace ISeed{
	export interface Seed{
		id: number,
		entrantId: number,
		placeholderName: string,
		seedNumber: number,
		placement: number,
		isBye: boolean
	}

	export interface Data{
		seed: SeedData[]
	}

	export interface SeedData{
		id: number,
		entrantId: number,
		placeholderName: string,
		seedNumber: number,
		placement: number,
		isBye: boolean
	}
}