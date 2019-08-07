
import {IStandingStats, IStandingScore} from './interfaces/IStanding'

export class StandingStats implements IStandingStats{

	private score: IStandingScore

	constructor(score: IStandingScore){
		this.score = score
	}

	public getScore(): IStandingScore{
		return this.score
	}
}
