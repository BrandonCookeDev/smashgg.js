
import {Entrant, IEntrant} from './Entrant'
import {User} from './User'
import NI from './util/NetworkInterface'

export class Standings implements IStandings.Standings{
    id: number | null
    placement: number | null
    entrant: Entrant
    
    constructor(
        id: number | null, 
        placement: number | null, 
        entrant: Entrant
    ){
        this.id = id
        this.placement = placement
        this.entrant = entrant
    }

    public static parse(data: IStandings.StandingsData){
        return new Standings(
            data.id,
            data.placement,
            Entrant.parse(data.entrant)
        )
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
        entrant: Entrant
    }

    export interface StandingsData{
        id: number | null,
        placement: number | null,
        entrant: IEntrant.EntrantData
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

    export function getDefaultOptions(){
        return {
            perPage: 1,
            page: null,
            sortBy: null,
            filter: null
        }
    }
}