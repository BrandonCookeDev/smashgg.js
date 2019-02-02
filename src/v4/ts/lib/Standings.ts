
import {Player} from './internal'

export class Standings implements IStandings.Standings{
    id: number | null
    placement: number | null
    player: Player | null
    
    constructor(id: number | null, placement: number | null, player: Player | null){
        this.id = id;
        this.placement = placement;
        this.player = player;
    }
}

export namespace IStandings{
    export interface Standings{
        id: number | null,
        placement: number | null,
        player: Player | null
    }
}