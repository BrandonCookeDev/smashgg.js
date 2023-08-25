import {IPlayerRank} from './IPlayerRank'
import {IGGSet, IGGSetData} from './IGGSet'

export interface IUser{
	/*
	id: number,
	bio: string
	discriminator: string,
	genderPronoun: string,
	name: string,
	playerId: string,
	playerGamertag: string,
	playerPrefix: string | null,

	color: string | null,
	twitchStream: string | null,
	twitterHandle: string | null,
	youtube: string | null,
	region: string | null,
	state: string | null,
	country: string | null,
	gamerTagChangedAt: number | null
	*/

	getId(): number | null,
    getBio(): string | null,
    getDiscriminator(): string | null,
    getGenderPronoun(): string | null,
    getName(): string | null,
    getPlayerId(): number | null,
    getPlayerGamertag(): string | null,
    getSponsor(): string | null  // player prefix

// 	getId(): number
// 	getGamerTag(): string
// 	getSponsor(): string | null
// 	getColor(): string | null
// 	getTwitchStream(): string | null
// 	getTwitterHandle(): string | null
// 	getYoutube(): string | null
// 	getRegion(): string | null
// 	getState(): string | null
// 	getCountry(): string | null
// 	getGamerTagChangedAt(): Date | null

	getRecentSets(): Promise<IGGSet[]>
	getRecentStandings(): Promise<IPlayerRank[]>
}

export interface IUserDataFull{
	user: IUserData
}

export interface IUserData{
	id: number | null,
	bio: string | null,
	discriminator: string | null,
	genderPronoun: string | null,
	name: string | null,
	player: {
	    id: number | null,
	    gamerTag: string | null,
	    prefix: string | null
	}
}

export interface IUserDataRankings{
	player: {
		id: number,
		recentStandings: IPlayerRank[]
	}
}

export interface IUserDataSets{
	player: {
		id: number,
		recentSets: IGGSetData[]
	}
}
