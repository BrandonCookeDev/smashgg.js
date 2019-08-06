import {ISeed, ISeedData, ISeedDataFull} from './interfaces/ISeed'

export class Seed implements ISeed{

	public static parse(data: ISeedData): Seed {
		return new Seed(
			data.id,
			data.entrantId,
			data.placeholderName,
			data.seedNumber,
			data.placement,
			data.isBye
		)
	}

	public static parseFull(data: ISeedDataFull): Seed[]{
		return data.seed.map(seedData => Seed.parse(seedData))
	}

	private id: number
	private entrantId: number
	private placeholderName: string
	private seedNumber: number
	private placement: number
	private isBye: boolean

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

	public getId(): number {
		return this.id
	}

	public getEntrantId(): number {
		return this.entrantId
	}

	public getPlaceholderName(): string {
		return this.placeholderName
	}

	public getSeedNumber(): number {
		return this.seedNumber
	}

	public getPlacement(): number {
		return this.placement
	}

	public getIsBye(): boolean {
		return this.isBye
	}

	// TODO get entrant.... somehow
}
