import {IPrize, IPrizing} from '../interfaces/IPrize'

export class Prize implements IPrize{
	
	public static parse(data: IPrizing): Prize  | null{
		return null
	}

	private markdown: string | null
	private payoutType: string | null
	private payoutTotal: string | null
	private prizing: [IPrizing] | null

	constructor(
		markdown: string | null, 
		payoutType: string | null,
		payoutTotal: string | null, 
		prizing: [IPrizing] | null
	){
			this.markdown = markdown
			this.payoutType = payoutType
			this.payoutTotal = payoutTotal
			this.prizing = prizing
	}
	
	public getMarkdown(): string | null{
		return this.markdown
	}

	public getPayoutType(): string | null{
		return this.payoutType
	}

	public getPayoutTotal(): string | null{
		return this.payoutTotal
	}

	public getPrizing(): [IPrizing] | null{
		return this.prizing
	}

}
