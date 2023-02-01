
export interface IPlayerRank{
	placement: number
	container: {  // Probably returning an Event
	    id: number,
	    name: string,
	    tournament: {
	        id: number,
            name: string
	    }
    }
}
