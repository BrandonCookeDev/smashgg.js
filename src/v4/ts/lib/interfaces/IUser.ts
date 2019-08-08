import {IPlayerRank} from './IPlayerRank'
import {IGGSet, IGGSetData} from './IGGSet'

export interface IUser{
	/*
	id: number,
	gamerTag: string,
	prefix: string | null,
	color: string | null,
	twitchStream: string | null,
	twitterHandle: string | null,
	youtube: string | null,
	region: string | null,
	state: string | null,
	country: string | null,
	gamerTagChangedAt: number | null
	*/

	getId(): number
	getGamerTag(): string
	getSponsor(): string | null
	getColor(): string | null
	getTwitchStream(): string | null
	getTwitterHandle(): string | null
	getYoutube(): string | null
	getRegion(): string | null
	getState(): string | null
	getCountry(): string | null
	getGamerTagChangedAt(): Date | null

	getRecentSets(): Promise<IGGSet[]>
	getRankings(): Promise<IPlayerRank[]>
}

export interface IUserDataFull{
	player: IUserData
}

export interface IUserData{
	id: number,
	gamerTag: string,
	prefix: string | null
	color: string | null
	twitchStream: string | null
	twitterHandle: string | null
	youtube: string | null
	region: string | null
	state: string | null
	country: string | null
	gamerTagChangedAt: number | null
}

export interface IUserDataRankings{
	player: {
		id: number,
		rankings: IPlayerRank[]
	}
}

export interface IUserDataSets{
	player: {
		id: number,
		recentSets: IGGSetData[]
	}
}
