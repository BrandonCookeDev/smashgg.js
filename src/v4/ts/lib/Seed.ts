
import {Entrant} from './internal'

export class Seed implements ISeed.Seed{
	constructor(){
		
	}
}

export namespace ISeed{
	export interface Seed{
		id: number,
		entrant: Entrant,
		placeholderName: string,
		entrantId: number,

	}
}