import {
	ISeed,
	ISeedData,
	ISeedOptions,
	ISeedDataFull
} from '../interfaces/ISeed'

import {IEntrantData} from '../interfaces/IEntrant'

export class Seed implements ISeed{

	public static parse(data: ISeedData): Seed {
		return new Seed(
			data.id,
			data.entrant,
			data.isBye,
			data.placeholderName,
			data.placement,
			data.seedNum
		)
	}

	public static parseFull(data: ISeedDataFull): Seed[]{
		return data.seed.map(seedData => Seed.parse(seedData))
	}

	public static getDefaultSeedOptions(): ISeedOptions{
		return {
			page: null,
			perPage: 1,
			sortBy: null,
			filter: null
		}
	}
	
	private id: number
	private entrant: IEntrantData | null
	private placeholderName: string | null
	private seedNum: number | null
	private placement: number | null
	private isBye: boolean | null

	constructor(
		id: number,
		entrant: IEntrantData | null,
		isBye: boolean | null,
		placeholderName: string | null,
		placement: number | null,
		seedNum: number | null
	){
		this.id = id
		this.isBye = isBye
		this.entrant = entrant
		this.placeholderName = placeholderName
		this.placement = placement
		this.seedNum = seedNum
	}

	public getId(): number {
		return this.id
	}

	public getEntrant(): IEntrantData | null {
		return this.entrant
	}

	public getIsBye(): boolean | null{
		return this.isBye
	}

	public getPlaceholderName(): string | null{
		return this.placeholderName
	}

	public getPlacement(): number | null{
		return this.placement
	}

	public getSeedNum(): number | null{
		return this.seedNum
	}

	// TODO get entrant.... somehow
}
