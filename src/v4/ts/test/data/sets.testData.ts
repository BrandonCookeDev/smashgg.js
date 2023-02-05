import { 
	IGGSetData,
	IGGSetDataFull,
	IGGSetDataWithGames
} from '../../lib/interfaces/IGGSet'
import {IPlayerLite} from '../../lib/interfaces/IPlayerLite'

import {PlayerLite} from '../../lib/models/PlayerLite'

import * as gameData from './games.testData'

export const set1: IGGSetData = {
      id: 54170233,
      completedAt: 1668401938,
      displayScore: "TSM FTX | Tweek 3 - PAR | Kurama 2",
      event: {
        id: 757796
      },
      fullRoundText: "Grand Final Reset",
      identifier: "E",
      phaseGroup: {
        id: 1909775
      },
      round: 3,
      startedAt: 1668400680,
      slots: [
        {
          id: "54170233-0",
          entrant: {
            id: 10895582,
            name: "TSM FTX | Tweek",
            participants: [
              {
                id: 10376033
              }
            ]
          }
        },
        {
          id: "54170233-1",
          entrant: {
            id: 11345520,
            name: "PAR | Kurama",
            participants: [
              {
                id: 10779782
              }
            ]
          }
        }
      ],
      state: 3,
      totalGames: 5,
      winnerId: 10895582
    }

export const set2: IGGSetData = {
      id: 51002303,
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
      id: 56194829,
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
	'TSM FTX | Tweek', 10895582, [10376033]
)

export const p2: IPlayerLite = new PlayerLite(
	'PAR | Kurama', 11345520, [10779782]
)

export const p3: IPlayerLite = new PlayerLite(
	'SSG | Zomba', 8910571, [8549579]
)

export const p4: IPlayerLite = new PlayerLite(
	'CM | Anathema', 10728063, [10224540]
)

export const p5: IPlayerLite = new PlayerLite(
	'26R | MuteAce', 11230457, [10675799]
)

export const p6: IPlayerLite = new PlayerLite(
	'T1 | MkLeo', 11947203, [11311646]
)

export const parsedDisplayScore1 = {
	tag1: 'TSM FTX | Tweek',
	tag2: 'PAR | Kurama',
	score1: 3,
	score2: 2
}

export const parsedDisplayScore2 = {
	tag1: 'SSG | Zomba',
	tag2: 'CM | Anathema',
	score1: 1,
	score2: 3
}
export const parsedDisplayScore3 = {
	tag1: '26R | MuteAce',
	tag2: 'T1 | MkLeo',
	score1: 1,
	score2: 3
}
