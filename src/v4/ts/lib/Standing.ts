
import { IStanding, IStandingData } from './interfaces/IStanding'
import { IEntrant } from './interfaces/IEntrant'

import { Entrant } from './Entrant'

export class Standing implements IStanding {

	public static getDefaultOptions() {
		return {
			perPage: 1,
			page: null,
			sortBy: null,
			filter: null
		}
	}

	public static parse(data: IStandingData) {
		return new Standing(
			data.id,
			data.placement,
			Entrant.parse(data.entrant)
		)
	}

	private id: number | null
	private placement: number | null
	private entrant: Entrant

	constructor(
		id: number | null,
		placement: number | null,
		entrant: Entrant
	) {
		this.id = id
		this.placement = placement
		this.entrant = entrant
	}



	public getId(): number | null {
		return this.id
	}

	public getPlacement(): number | null {
		return this.placement
	}

	public getEntrant(): IEntrant | null {
		return this.entrant
	}

	public getGamerTag(): string | null {
		if (this.entrant)
			return this.entrant.getAttendee().getGamerTag()
		return null
	}
}
