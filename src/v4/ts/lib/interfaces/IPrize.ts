// No Prize model found in current Start.gg GraphQL Schemas
export interface IPrize{
	/*
	markdown: string | null
	payoutType: string | null
	payoutTotal: string | null
	prizing: [IPrizing] | null
	*/

	getMarkdown(): string | null
	getPayoutType(): string | null
	getPayoutTotal(): string | null
	getPrizing(): [IPrizing] | null
}

export interface IPrizing{
	id: number,
	placement: number,
	percent: number
}

export interface IPrizeDataFull{
	prize: {
		markdown: string | null
		payoutType: string | null
		payoutTotal: string | null
	}
}

export interface IPrizeData{
	markdown: string | null
	payoutType: string | null
	payoutTotal: string | null
}
