import {IEntrantData} from '../interfaces/IEntrant'
export interface ISeed{
	/*
	id: number,
	entrantId: number,
	placeholderName: string,
	seedNumber: number,
	placement: number,
	isBye: boolean
	*/

	getId(): number,
	getEntrant(): IEntrantData | null,
	getIsBye(): boolean | null,
	getPlaceholderName(): string | null,
	getPlacement(): number | null,
	getSeedNum(): number | null
}

export interface ISeedDataFull{
	seed: ISeedData[]
}

export interface ISeedData{
	id: number,
	entrant: IEntrantData | null,
	isBye: boolean | null,
	placeholderName: string | null,
	placement: number | null,
	seedNum: number | null
}

export interface ISeedOptions{
	page?: number | null,
	perPage?: number | null,
	sortBy?: string | null,
	filter?: null | {
		id?: number
		entrantName?: string
		checkInState?: number
		phaseGroupId?: number[]
		phaseId?: number[]
		eventId?: number
		search?: {
			fieldsToSearch: string[]
			searchString: string
		}
	}
}
