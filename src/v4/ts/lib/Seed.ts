
import {Player} from './internal'

export class Seed implements ISeed.Seed{
	constructor(){
		
	}
}

export namespace ISeed{
	export interface Seed{
		id: number,
		entrant: Player,
		placeholderName: string,
		entrantId: number,

	}
}