
import {
	ISelections,
	ISelectionsData,
	ISelectionsDataFull
} from '../interfaces/IGame'

export class Selections implements ISelections{

	public static parse(data: ISelectionsData): ISelections{
		return new Selections(
			data.selectionType,
			data.selectionValue,
			data.entrant ? data.entrant.id : null,
			data.participant ? data.participant.id : null
		)
	}

	public static parseArray(data: ISelectionsData[]): ISelections[]{
		return data.map(e => Selections.parse(e))
	}

	public static parseFull(data: ISelectionsDataFull): ISelections[]{
		return data.selections.map(selectionsData => Selections.parse(selectionsData))
	}

	private selectionType: string
	private selectionValue: number
	private entrantId: number | null
	private participantId: number | null

	constructor(
		selectionType: string,
		selectionValue: number,
		entrantId: number | null,
		participantId: number | null
	){
		this.selectionType = selectionType
		this.selectionValue = selectionValue
		this.entrantId = entrantId
		this.participantId = participantId
	}

	public getSelectionType(): string{
		return this.selectionType
	}

	public getSelectionValue(): number{
		return this.selectionValue
	}

	public getEntrantId(): number | null{
		return this.entrantId
	}

	public getParticipantId(): number | null{
		return this.participantId
	}
}
