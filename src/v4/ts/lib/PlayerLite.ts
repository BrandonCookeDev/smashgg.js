import {IPlayerLite} from './interfaces/IPlayerLite'
import {IGGSetSlots} from './interfaces/IGGSet'

export class PlayerLite implements IPlayerLite{
	
	public static parse(tag: string | null, slot: IGGSetSlots){

		const entrantId = slot.entrant ? slot.entrant.id : null
		const attendeeIds = slot.entrant ? slot.entrant.participants.map(p => p.id) : []

		return new PlayerLite(
			tag,
			entrantId,
			attendeeIds
		)
	}

	public tag: string | null
	public entrantId: number | null
	public attendeeIds: number[]
	
	constructor(tag: string | null, entrantId: number | null, attendeeIds: number[] | []){
		this.tag = tag
		this.entrantId = entrantId
		this.attendeeIds = attendeeIds
	}
	
}
