
export namespace IGGSet{

	export interface GGSet{

	}

	export interface Data{
		entities: [Entity]
	}

	export interface Entity{
		id: number,
		eventId: number,
		fullRoundText: string,
		entrant1Score: number,
		entrant2Score: number,
		entrant1Id?: number,
		entrant2Id?: number,
		winnerId?: number,
		loserId?: number,
		startedAt?: number,
		completedAt?: number,
		[x: string]: any
	}
}