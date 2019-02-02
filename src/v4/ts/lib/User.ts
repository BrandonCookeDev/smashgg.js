/** aka User **/
import NI from './util/NetworkInterface'
import {GGSet, IGGSet} from './internal'
import * as Common from './util/Common'
import * as queries from './scripts/userQueries'
import Log from './util/Logger'

export class User implements IUser.User{

	id: number
	gamerTag: string
	prefix: string | null
	color: string | null
	twitchStream: string | null
	twitterHandle: string | null
	youtube: string | null
	region: string | null
	state: string | null
	country: string | null
	gamerTagChangedAt: number | null
		
	constructor(
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
	){
		this.id = id
		this.gamerTag = gamerTag
		this.prefix = prefix
		this.color = color
		this.twitchStream = twitchStream
		this.twitterHandle = twitterHandle
		this.youtube = youtube
		this.region = region
		this.state = state
		this.country = country
		this.gamerTagChangedAt = gamerTagChangedAt  
	}

	static parse(data: IUser.Data) : User{
		return new User(
			data.player.id, 
			data.player.gamerTag,
			data.player.prefix,
			data.player.color,
			data.player.twitchStream,
			data.player.twitterHandle,
			data.player.youtube,
			data.player.region,
			data.player.state,
			data.player.country,
			data.player.gamerTagChangedAt
		)
	}

	static async getById(id: number) : Promise<User>{
		Log.info('Getting User (smash.gg Player) with id %s', id);
		let data = await NI.query(queries.user, {id: id})
		return User.parse(data)
	}

	getId() {
	  return this.id
	}

	getGamerTag() {
	  return this.gamerTag
	}

	getSponsor() {
	  return this.prefix
	}

	getColor(): string | null {
		return this.color
	}

	getTwitchStream(): string | null {
		return this.twitchStream
	}

	getTwitterHandle(): string | null {
		return this.twitterHandle
	}

	getYoutube(): string | null {
		return this.youtube
	}

	getRegion(): string | null {
		return this.region
	}

	getState(): string | null {
		return this.state
	}

	getCountry(): string | null {
		return this.country
	}

	getGamerTagChangedAt(): Date | null {
		return this.gamerTagChangedAt ? Common.convertEpochToDate(this.gamerTagChangedAt) : null
	}

	async getRecentSets() : Promise<GGSet[]> {
		Log.info('Getting Sets for %s (User: %s)', this.gamerTag, this.id)
		let data: IUser.DataUserSets = await NI.query(queries.userRecentGGSets, {id: this.id})
		let sets: GGSet[] = data.player.recentSets.map(setData => GGSet.parse(setData))
		return sets;
	}

	async getRankings() : Promise<IUser.PlayerRank[]> {
		Log.info('Getting Rankings for %s (User: %s)', this.gamerTag, this.id)
		let data: IUser.DataUserRankings = await NI.query(queries.userRankings, {id: this.id})
		let rankings: IUser.PlayerRank[] = data.player.rankings
		return rankings;
	}
}

export namespace IUser{
	export interface User{
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

		getRecentSets() : Promise<GGSet[]>
		getRankings() : Promise<PlayerRank[]>
	}

	export interface Data{
		"player": {
			"id": number,
			"gamerTag": string,
			"prefix": string | null
			"color": string | null
			"twitchStream": string | null
			"twitterHandle": string | null
			"youtube":string | null
			"region":string | null
			"state": string | null
			"country": string | null
			"gamerTagChangedAt": number | null
		}
	}

	export interface DataUserRankings{
		"player": {
			"id": number,
			"rankings": PlayerRank[]
		}
	}

	export interface DataUserSets{
		"player": {
			"id": number,
			"recentSets": IGGSet.Data[]
		}
	}

	export interface PlayerRank{
		id: number,
		title: string,
		rank: number
	}
}