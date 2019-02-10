
import {Entrant} from './Entrant'
import {User} from './User'
import NI from './util/NetworkInterface'

export class Standings implements IStandings.Standings{
    id: number | null
    placement: number | null
    entrantId: number | null
    
    constructor(
        id: number | null, 
        placement: number | null, 
        entrantId: number | null,
        userIds: number[] | null
    ){
        this.id = id
        this.placement = placement
        this.entrantId = entrantId
    }
}

export class StandingsStats implements IStandings.Stats{
    score: IStandings.Score

    constructor(score: IStandings.Score){
        this.score = score
    }
}

export namespace IStandings{
    export interface Standings{
        id: number | null,
        placement: number | null,
        entrantId: number | null
    }

    export interface Stats{
        score: Score
    }

    export interface Score{
        label: string,
        value: number
    }

    export interface StandingsOptions{
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
}