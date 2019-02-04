
import {Entrant} from './Entrant'
import {Standings} from './Standings'

export class Seed implements ISeed.Seed{
	id: number
	entrantId: number
	placeholderName: string
	seedNumber: number
	placement: number
	isBye: boolean
	entrant: Entrant
	stadings: Standings

	constructor(
		id: number,
		entrantId: number,
		placeholderName: string,
		seedNumber: number,
		placement: number,
		isBye: boolean,
		entrant: Entrant,
		stadings: Standings
	){
		this.id = id
		this.entrantId = entrantId
		this.placeholderName = placeholderName
		this.seedNumber = seedNumber
		this.placement = placement
		this.isBye = isBye
		this.entrant = entrant
		this.stadings = stadings
	}

	//static parse(data: )
}

export class 

export namespace ISeed{
	export interface Seed{
		id: number,
		entrantId: number,
		placeholderName: string,
		seedNumber: number,
		placement: number,
		isBye: boolean,
		entrant: Entrant,
		stadings: Standings
		
	}
}