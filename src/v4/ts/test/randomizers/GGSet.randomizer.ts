import moment from 'moment'
import {IGGSet} from '../../lib/interfaces/IGGSet'
import {GGSet} from '../../lib/models/GGSet'
import IRandomizer from './IRandomizer'
import { IPlayerLite } from '../../lib/interfaces/IPlayerLite'
import { PlayerLite } from '../../lib/models/PlayerLite'
import {format} from 'util'

export default class GGSetRandomizer implements IRandomizer<IGGSet>{
	private static upperLimit = 5000
	private static displayScoreTemplate = '%s %d - %d %s'
	private static alphabet = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ']
	private static numbers = ['123456789']
	private static names: string[] = [
		'cookie', 'brandon', 'andrew', 'deems', 'camron', 'silver',
		'brian', 'sleepyk', 'cardd', 'jarrod', 'crispix'
	]
	private static namesInUse: string[] = []
	private static rounds: string[] = [
		'pools', 'winners r1', 'losers r1', 'winners r2', 'losers r2',
		'winners quarter-finals', 'losers quarter-finals', 'winners semi-finals',
		'losers semi-finals', 'winners finals', 'losers finals', 'grand finals'
	]
	private static states: string[] = [
		'GA', 'AL', 'CA', 'NE', 'NY'
	]

	private static rng(num?: number): number {
		return Math.floor(Math.random() * (num ? num : GGSetRandomizer.upperLimit))
	}

	private static resetNames(): void{
		GGSetRandomizer.names.forEach(name => {GGSetRandomizer.names.push(name)})
		GGSetRandomizer.namesInUse = []
	}

	private static determineState(): string{
		return GGSetRandomizer.states[GGSetRandomizer.rng(GGSetRandomizer.states.length-1)]
	}

	private static determineName(): string{
		const name = GGSetRandomizer.names[GGSetRandomizer.rng(GGSetRandomizer.names.length-1)]
		GGSetRandomizer.names.splice(GGSetRandomizer.names.indexOf(name), 1)
		GGSetRandomizer.namesInUse.push(name)
		return name
	}

	private static determineRound(): string {
		return GGSetRandomizer.rounds[GGSetRandomizer.rng(GGSetRandomizer.rounds.length-1)]
	}

	private static determineRoundShortText(): number {
		return parseInt(GGSetRandomizer.numbers[GGSetRandomizer.rng(GGSetRandomizer.numbers.length-1)])
	}

	private static determineBestOf(): 1|3|5 {
		const rng: number = GGSetRandomizer.rng(5)
		switch(rng){
			case 0:
				return 1
			case 2:
				return 3
			case 4:
				return 5
			default:
				return rng as 1|3|5
		}
	}

	private static determineScore(bo: 1|3|5): number {
		switch(bo){
			case 1:
				return GGSetRandomizer.rng(1)
			case 3:
				return GGSetRandomizer.rng(2)
			case 5:
				return GGSetRandomizer.rng(3)
		}
	}

	private static determineWinner(p1: IPlayerLite, s1: number, p2: IPlayerLite, s2: number): IPlayerLite | null {
		if(s1 > s2) return p1
		if(s1 < s2) return p2
		return null
	}

	private static determineDisplayScore(p1: IPlayerLite, s1: number, p2: IPlayerLite, s2: number): string{
		return format(
			GGSetRandomizer.displayScoreTemplate, 
			p1.tag, s1, s2, p2.tag
		)
	}

	private static reset(): void{
		GGSetRandomizer.resetNames()
	}
	
	public randomize(): IGGSet{
		const randomId: number = GGSetRandomizer.rng()
		const randomEventId: number = GGSetRandomizer.rng()
		const randomPhaseGroupId: number = GGSetRandomizer.rng()
		const randomStartedAt: number = moment().unix()
		const randomCompletedAt: number = moment(randomStartedAt).add(15, 'minutes').unix()
		const randomBestOf: 1|3|5 = GGSetRandomizer.determineBestOf()
		const randomScore1: number = GGSetRandomizer.determineScore(randomBestOf)
		const randomScore2: number = GGSetRandomizer.determineScore(randomBestOf)
		const randomName1: string = GGSetRandomizer.determineName()
		const randomName2: string = GGSetRandomizer.determineName()
		const randomRound: string = GGSetRandomizer.determineRound()
		const randomRoundShort: number = GGSetRandomizer.determineRoundShortText()
		const randomTotalGames: number = randomScore1 + randomScore2
		
		const randomPlayer1: IPlayerLite = new PlayerLite(
			randomName1, 
			GGSetRandomizer.rng(),
			[GGSetRandomizer.rng(), GGSetRandomizer.rng()]
		)

		const randomPlayer2: IPlayerLite = new PlayerLite(
			randomName2, 
			GGSetRandomizer.rng(),
			[GGSetRandomizer.rng(), GGSetRandomizer.rng()]
		)

		const randomDisplayScore = GGSetRandomizer.determineDisplayScore(
			randomPlayer1, randomScore1,
			randomPlayer2, randomScore2
		)

		const randomWinner = GGSetRandomizer.determineWinner(
			randomPlayer1, randomScore1,
			randomPlayer2, randomScore2
		)

		const randomState = GGSetRandomizer.rng(3)

		return new GGSet(
			randomId,
			randomEventId,
			randomPhaseGroupId,
			randomDisplayScore,
			randomRound,
			randomRoundShort,
			randomStartedAt,
			randomCompletedAt,
			randomWinner ? randomWinner.entrantId : null,
			randomTotalGames,
			randomState,
			randomPlayer1,
			randomPlayer2,
			randomScore1,
			randomScore2
		)
	}
}
