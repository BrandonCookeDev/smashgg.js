
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
			data.entrantId,
			data.participantId
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
	private entrantId: number
	private attendeeId: number | null

	constructor(
		selectionType: string,
		selectionValue: number,
		entrantId: number,
		participantId: number | null
	){
		this.selectionType = selectionType
		this.selectionValue = selectionValue
		this.entrantId = entrantId
		this.attendeeId = participantId
	}

	public getSelectionType(): string{
		return this.selectionType
	}

	public getSelectionValue(): number{
		return this.selectionValue
	}

	public getEntrantId(): number{
		return this.entrantId
	}

	public getAttendeeId(): number | null{
		return this.attendeeId
	}
}
