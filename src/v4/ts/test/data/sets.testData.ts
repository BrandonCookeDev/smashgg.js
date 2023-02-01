import { 
	IGGSetData,
	IGGSetDataFull,
	IGGSetDataWithGames
} from '../../lib/interfaces/IGGSet'
import {IPlayerLite} from '../../lib/interfaces/IPlayerLite'

import {PlayerLite} from '../../lib/models/PlayerLite'

import * as gameData from './games.testData'

// 11186682
export const set1: IGGSetData = {
      id: "55692853",
      completedAt: 1673234312,
      displayScore: "TSM | Tweek 3 - FaZe | Sparg0 2",
      event: {
        id: 728892
      },
      fullRoundText: "Grand Final",
      identifier: "H",
      phaseGroup: {
        id: 1764699
      },
      round: 4,
      startedAt: 1673232762,
      state: 3,
      totalGames: 5,
      slots: [
        {
          id: "55692853-0",
          entrant: {
            id: 11836261,
            name: "TSM | Tweek",
            participants: [
              {
                id: 11213829
              }
            ]
          }
        },
        {
          id: "55692853-1",
          entrant: {
            id: 11848155,
            name: "FaZe | Sparg0",
            participants: [
              {
                id: 11224301
              }
            ]
          }
        }
      ],
      winnerId: 11836261
    }

export const set2: IGGSetData = {
      id: "51002303",
      completedAt: 1661139951,
      displayScore: "SSG | Zomba 1 - CM | Anathema 3",
      event: {
        id: 591286
      },
      fullRoundText: "Losers Final",
      identifier: "K",
      phaseGroup: {
        id: 1780592
      },
      round: -6,
      startedAt: null,
      state: 3,
      totalGames: 5,
      slots: [
        {
          id: "51002303-0",
          entrant: {
            id: 8910571,
            name: "SSG | Zomba",
            participants: [
              {
                id: 8549579
              }
            ]
          }
        },
        {
          id: "51002303-1",
          entrant: {
            id: 10728063,
            name: "CM | Anathema",
            participants: [
              {
                id: 10224540
              }
            ]
          }
        }
      ],
      winnerId: 10728063
    }

export const set3: IGGSetData = {
      id: "56194829",
      completedAt: 1674458741,
      displayScore: "26R | MuteAce 1 - T1 | MkLeo 3",
      event: {
        id: 769488
      },
      fullRoundText: "Grand Final",
      identifier: "D",
      phaseGroup: {
        id: 1955949
      },
      round: 3,
      startedAt: 1674457492,
      state: 3,
      totalGames: 5,
      slots: [
        {
          id: "56194829-0",
          entrant: {
            id: 11230457,
            name: "26R | MuteAce",
            participants: [
              {
                "id": 10675799
              }
            ]
          }
        },
        {
          id: "56194829-1",
          entrant: {
            id: 11947203,
            name: "T1 | MkLeo",
            participants: [
              {
                "id": 11311646
              }
            ]
          }
        }
      ],
      winnerId: 11947203
    }

export const set1WithGames: IGGSetDataWithGames = {
		set: {
			games: gameData.games1
		}
	}

export const set2WithGames: IGGSetDataWithGames = {
	set: {
		games: gameData.games2
	}
}

export const set3WithGames: IGGSetDataWithGames = {
	set: {
		games: gameData.games3
	}
}

export const set1Full: IGGSetDataFull = {
	set: set1
}
export const set2Full: IGGSetDataFull = {
	set: set2
}
export const set3Full: IGGSetDataFull = {
	set: set3
}

export const p1: IPlayerLite = new PlayerLite(
	'MVG FOX | Mew2King', 1106474, [1148324]
)

export const p2: IPlayerLite = new PlayerLite(
	'Ginger', 784069, [863946]
)

export const p3: IPlayerLite = new PlayerLite(
	'SS | Colbol', 1171874, [1207468]
)

export const p4: IPlayerLite = new PlayerLite(
	'Balance | Druggedfox', 757871, [840037]
)

export const p5: IPlayerLite = new PlayerLite(
	'Balance | Druggedfox',	789171, [868742]
)

export const p6: IPlayerLite = new PlayerLite(
	'RNG | Swedish Delight', 767565,[849572]
)

export const parsedDisplayScore1 = {
	tag1: 'MVG FOX | Mew2King',
	tag2: 'Ginger',
	score1: 3,
	score2: 0
}

export const parsedDisplayScore2 = {
	tag1: 'SS | Colbol',
	tag2: 'Balance | Druggedfox',
	score1: 3,
	score2: 0
}
export const parsedDisplayScore3 = {
	tag1: 'Balance | Druggedfox',
	tag2: 'RNG | Swedish Delight',
	score1: 3,
	score2: 1
}
