import { IGameData, IGameDataFull, ISelectionsData, IGame } from '../../lib/interfaces/IGame'
import { Game } from '../../lib/models/Game'
import { Selections } from '../../lib/models/Selections'

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

export const set1Game1: IGameData = {
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
}

export const set1Game2: IGameData = {
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
}

export const set1Game3: IGameData = {
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

export const set2Game1: IGameData = {
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
}

export const set2Game2: IGameData = 
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
}

export const set2Game3: IGameData = 
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

export const set3Game1: IGameData = {
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
}

export const set3Game2: IGameData = 
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
}

export const set3Game3: IGameData = 
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
}

export const set3Game4: IGameData = 
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

// set id 11186682
export const games1Data: IGameData[] = [
	set1Game1, set1Game2, set1Game3
]

export const games2Data: IGameData[] = [
	set2Game1, set2Game2, set2Game3
]

export const games3Data: IGameData[] = [
	set3Game1, set3Game2, set3Game3, set3Game4
]

export const games1Full: IGameDataFull = {
	set: {
		games: games1Data
	}
}

export const games2Full: IGameDataFull = {
	set: {
		games: games2Data
	}
}

export const games3Full: IGameDataFull = {
	set: {
		games: games3Data
	}
}

export const Set1Game1: Game = new Game(
	parseInt(set1Game1.id),
	set1Game1.state,
	set1Game1.winnerId,
	set1Game1.orderNum,
	set1Game1.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set1Game2: Game = new Game(
	parseInt(set1Game2.id),
	set1Game2.state,
	set1Game2.winnerId,
	set1Game2.orderNum,
	set1Game2.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set1Game3: Game = new Game(
	parseInt(set1Game3.id),
	set1Game3.state,
	set1Game3.winnerId,
	set1Game3.orderNum,
	set1Game3.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set2Game1: Game = new Game(
	parseInt(set2Game1.id),
	set2Game1.state,
	set2Game1.winnerId,
	set2Game1.orderNum,
	set2Game1.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set2Game2: Game = new Game(
	parseInt(set2Game2.id),
	set2Game2.state,
	set2Game2.winnerId,
	set2Game2.orderNum,
	set2Game2.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set2Game3: Game = new Game(
	parseInt(set2Game3.id),
	set2Game3.state,
	set2Game3.winnerId,
	set2Game3.orderNum,
	set2Game3.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set3Game1: Game = new Game(
	parseInt(set3Game1.id),
	set3Game1.state,
	set3Game1.winnerId,
	set3Game1.orderNum,
	set3Game1.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set3Game2: Game = new Game(
	parseInt(set3Game2.id),
	set3Game2.state,
	set3Game2.winnerId,
	set3Game2.orderNum,
	set3Game2.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set3Game3: Game = new Game(
	parseInt(set3Game3.id),
	set3Game3.state,
	set3Game3.winnerId,
	set3Game3.orderNum,
	set3Game3.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)
export const Set3Game4: Game = new Game(
	parseInt(set3Game4.id),
	set3Game4.state,
	set3Game4.winnerId,
	set3Game4.orderNum,
	set3Game4.selections.map(s => new Selections(
		s.selectionType,
		s.selectionValue,
		s.entrantId,
		s.participantId
	))
)

export const games1: IGame[] = [
	Set1Game1, Set1Game2, Set1Game3
]

export const games2: IGame[] = [
	Set2Game1, Set2Game2, Set2Game3
]

export const games3: IGame[] = [
	Set3Game1, Set3Game2, Set3Game3, Set3Game4
]
