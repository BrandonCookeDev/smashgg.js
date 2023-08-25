import { IGameData, IGameDataFull, ISelectionsData } from '../../lib/interfaces/IGame'

export const selectionsS1G1P2: ISelectionsData = {
    id: 20784933,
    selectionType: "CHARACTER",
    selectionValue: 1279,
    entrant: {
        id: 10895582
    },
    participant: null
}

export const selectionsS1G2P2: ISelectionsData = {
    id: 20784945,
    selectionType: "CHARACTER",
    selectionValue: 1302,
    entrant: {
        id: 11345520
    },
    participant: null
}

export const selectionsS1G3P2: ISelectionsData = {
    id: 20784970,
    selectionType: "CHARACTER",
    selectionValue: 1279,
    entrant: {
        id: 10895582
    },
    participant: null
}

// set id 11186682
export const games1: IGameData[] = [
        {
          id: 14802311,
          orderNum: 1,
          selections: [
            {
              id: 20784932,
              selectionType: "CHARACTER",
              selectionValue: 1279,
              entrant: {
                id: 10895582
              },
              participant: null
            },
            {
              id: 20784933,
              selectionType: "CHARACTER",
              selectionValue: 1302,
              entrant: {
                id: 11345520
              },
              participant: null
            }
          ],
          state: 3,
          winnerId: 10895582
        },
        {
          id: 14802320,
          orderNum: 2,
          selections: [
            {
              id: 20784944,
              selectionType: "CHARACTER",
              selectionValue: 1279,
              entrant: {
                id: 10895582
              },
              participant: null
            },
            {
              id: 20784945,
              selectionType: "CHARACTER",
              selectionValue: 1302,
              entrant: {
                id: 11345520
              },
              participant: null
            }
          ],
          state: 3,
          winnerId: 11345520
        },
        {
          id: 14802333,
          orderNum: 3,
          selections: [
            {
              id: 20784970,
              selectionType: "CHARACTER",
              selectionValue: 1279,
              entrant: {
                id: 10895582
              },
              participant: null
            },
            {
              id: 20784971,
              selectionType: "CHARACTER",
              selectionValue: 1302,
              entrant: {
                id: 11345520
              },
              participant: null
            }
          ],
          state: 3,
          winnerId: 10895582
        },
        {
          id: 14802348,
          orderNum: 4,
          selections: [
            {
              id: 20784996,
              selectionType: "CHARACTER",
              selectionValue: 1279,
              entrant: {
                id: 10895582
              },
              participant: null
            },
            {
              id: 20784997,
              selectionType: "CHARACTER",
              selectionValue: 1302,
              entrant: {
                id: 11345520
              },
              participant: null
            }
          ],
          state: 3,
          winnerId: 11345520
        },
        {
          id: 14802359,
          orderNum: 5,
          selections: [
            {
              id: 20785014,
              selectionType: "CHARACTER",
              selectionValue: 1279,
              entrant: {
                id: 10895582
              },
              participant: null
            },
            {
              id: 20785015,
              selectionType: "CHARACTER",
              selectionValue: 1302,
              entrant: {
                id: 11345520
              },
              participant: null
            }
          ],
          state: 3,
          winnerId: 10895582
        }
      ]

export const games2: IGameData[] = [
        {
          "id": 13786918,
          "orderNum": 1,
          "selections": [
            {
              "id": 19205800,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 8910571
              },
              "participant": null
            },
            {
              "id": 19205801,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 10728063
              },
              "participant": null
            }
          ],
          "state": 3,
          "winnerId": 10728063
        },
        {
          "id": 13786919,
          "orderNum": 2,
          "selections": [
            {
              "id": 19205802,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 8910571
              },
              "participant": null
            },
            {
              "id": 19205803,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 10728063
              },
              "participant": null
            }
          ],
          "state": 3,
          "winnerId": 8910571
        },
        {
          "id": 13786920,
          "orderNum": 3,
          "selections": [
            {
              "id": 19205804,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 8910571
              },
              "participant": null
            },
            {
              "id": 19205805,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 10728063
              },
              "participant": null
            }
          ],
          "state": 3,
          "winnerId": 10728063
        },
        {
          "id": 13786921,
          "orderNum": 4,
          "selections": [
            {
              "id": 19205806,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 8910571
              },
              "participant": null
            },
            {
              "id": 19205807,
              "selectionType": "CHARACTER",
              "selectionValue": 1323,
              "entrant": {
                "id": 10728063
              },
              "participant": null
            }
          ],
          "state": 3,
          "winnerId": 10728063
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
