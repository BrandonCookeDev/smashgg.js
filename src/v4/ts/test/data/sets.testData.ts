import {IGGSet} from '../../lib/GGSet'
import Data = IGGSet.Data
import PlayerData = IGGSet.SetData
import * as gameData from './games.testData'

//11186682
export const set1 = {
	"id": "11186682",
	"round": 2,
	"fullRoundText": "Winners Quarter-Final",
	"startedAt": null,
	"completedAt": 1510527738,
	"winnerId": 1106474,
	"totalGames": 5,
	"state": 3,
	"slots": [
		{
		"id": "11186682-0",
		"entrant": {
			"id": 1106474,
			"name": "MVG FOX | Mew2King",
			"participants": [
			{
				"id": 1148324,
				"gamerTag": "Mew2King"
			}
			]
		}
		},
		{
		"id": "11186682-1",
		"entrant": {
			"id": 784069,
			"name": "Ginger",
			"participants": [
			{
				"id": 863946,
				"gamerTag": "Ginger"
			}
			]
		}
		}
	]
}


export const set2 = {
	"id": "11186683",
	"round": 2,
	"fullRoundText": "Winners Quarter-Final",
	"startedAt": 1510527562,
	"completedAt": 1510527677,
	"winnerId": 1171874,
	"totalGames": 5,
	"state": 3,
	"slots": [
		{
		"id": "11186683-0",
		"entrant": {
			"id": 1171874,
			"name": "SS | Colbol",
			"participants": [
			{
				"id": 1207468,
				"gamerTag": "Colbol"
			}
			]
		}
		},
		{
		"id": "11186683-1",
		"entrant": {
			"id": 757871,
			"name": "Balance | Druggedfox",
			"participants": [
			{
				"id": 840037,
				"gamerTag": "Druggedfox"
			}
			]
		}
		}
	]
	
}

export const set3 = {
	"id": "11186682",
	"round": 2,
	"fullRoundText": "Winners Quarter-Final",
	"startedAt": null,
	"completedAt": 1510527738,
	"winnerId": 1106474,
	"totalGames": 5,
	"state": 3,
	"slots": [
		{
		"id": "11186682-0",
		"entrant": {
			"id": 1106474,
			"name": "MVG FOX | Mew2King",
			"participants": [
			{
				"id": 1148324,
				"gamerTag": "Mew2King"
			}
			]
		}
		},
		{
		"id": "11186682-1",
		"entrant": {
			"id": 784069,
			"name": "Ginger",
			"participants": [
			{
				"id": 863946,
				"gamerTag": "Ginger"
			}
			]
		}
		}
	]
}

export const set1WithGames = {
	"set": {
		"games": gameData.games1
	}
}

export const set2WithGames = {
	"set": {
		"games": gameData.games2
	}
}

export const set3WithGames = {
	"set": {
		"games": gameData.games3
	}
}

