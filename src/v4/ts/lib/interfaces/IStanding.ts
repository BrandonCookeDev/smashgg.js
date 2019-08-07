import {IEntrant, IEntrantData} from './IEntrant'

export interface IStanding{
	/*
	id: number | null,
	placement: number | null,
	entrant: IEntrant,
	*/

	getId(): number | null,
	getPlacement(): number | null,
	getEntrant(): IEntrant | null,
	getGamerTag(): string | null
}

export interface IStandingData{
	id: number | null,
	placement: number | null,
	entrant: IEntrantData
}

export interface IStandingStats{
	//score: IStandingScore

	getScore(): IStandingScore
}

export interface IStandingScore{
	label: string,
	value: number
}

export interface IStandingOptions{
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

