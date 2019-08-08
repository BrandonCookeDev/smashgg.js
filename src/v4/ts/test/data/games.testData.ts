import { IGameData, IGameDataFull, ISelectionsData } from '../../lib/interfaces/IGame'

export const selectionsS1G1P2: ISelectionsData = {
	selectionType: 'CHARACTER',
	selectionValue: 23,
	entrantId: 1106474,
	participantId: null
}

export const selectionsS1G2P2: ISelectionsData = {
	selectionType: 'CHARACTER',
	selectionValue: 23,
	entrantId: 1106474,
	participantId: null
}

export const selectionsS1G3P2: ISelectionsData = {
	selectionType: 'CHARACTER',
	selectionValue: 23,
	entrantId: 1106474,
	participantId: null
}

// set id 11186682
export const games1: IGameData[] = [
	{
		id: '783150',
		state: 3,
		winnerId: 1106474,
		orderNum: 1,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 5,
				entrantId: 784069,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 23,
				entrantId: 1106474,
				participantId: null
			}
		]
	},
	{
		id: '783151',
		state: 3,
		winnerId: 1106474,
		orderNum: 2,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 5,
				entrantId: 784069,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 23,
				entrantId: 1106474,
				participantId: null
			}
		]
	},
	{
		id: '783152',
		state: 3,
		winnerId: 1106474,
		orderNum: 3,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 5,
				entrantId: 784069,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 23,
				entrantId: 1106474,
				participantId: null
			}
		]
	}
]

export const games2: IGameData[] = [
	{
		id: '783147',
		state: 3,
		winnerId: 1171874,
		orderNum: 1,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 2,
				entrantId: 757871,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 6,
				entrantId: 1171874,
				participantId: null
			}
		]
	},
	{
		id: '783148',
		state: 3,
		winnerId: 1171874,
		orderNum: 2,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 2,
				entrantId: 757871,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 6,
				entrantId: 1171874,
				participantId: null
			}
		]
	},
	{
		id: '783149',
		state: 3,
		winnerId: 1171874,
		orderNum: 3,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 2,
				entrantId: 757871,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 6,
				entrantId: 1171874,
				participantId: null
			}
		]
	}
]

export const games3: IGameData[] = [
	{
		id: '470116',
		state: 3,
		winnerId: 767565,
		orderNum: 1,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 23,
				entrantId: 767565,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 6,
				entrantId: 789171,
				participantId: null
			}
		]
	},
	{
		id: '470117',
		state: 3,
		winnerId: 789171,
		orderNum: 2,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 23,
				entrantId: 767565,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 6,
				entrantId: 789171,
				participantId: null
			}
		]
	},
	{
		id: '470118',
		state: 3,
		winnerId: 789171,
		orderNum: 3,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 23,
				entrantId: 767565,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 6,
				entrantId: 789171,
				participantId: null
			}
		]
	},
	{
		id: '470119',
		state: 3,
		winnerId: 789171,
		orderNum: 4,
		selections: [
			{
				selectionType: 'CHARACTER',
				selectionValue: 23,
				entrantId: 767565,
				participantId: null
			},
			{
				selectionType: 'CHARACTER',
				selectionValue: 6,
				entrantId: 789171,
				participantId: null
			}
		]
	}
]

export const games1Full: IGameDataFull = {
	set: {
		games: games1
	}
}

export const games2Full: IGameDataFull = {
	set: {
		games: games2
	}
}

export const games3Full: IGameDataFull = {
	set: {
		games: games3
	}
}
