import NI from './util/NetworkInterface'
import {GGSet} from './GGSet'
import * as Common from './util/Common'
import * as queries from './scripts/userQueries'
import Log from './util/Logger'

import {IUser, IUserData, IUserDataFull, IUserDataSets, IUserDataRankings} from './interfaces/IUser'
import {IPlayerRank} from './interfaces/IPlayerRank'
import {IGGSet} from './interfaces/IGGSet'

export class User implements IUser{

	public static parse(data: IUserData): User{
		return new User(
			data.id, 
			data.gamerTag,
			data.prefix,
			data.color,
			data.twitchStream,
			data.twitterHandle,
			data.youtube,
			data.region,
			data.state,
			data.country,
			data.gamerTagChangedAt
		)
	}

	public static parseFull(data: IUserDataFull): User{
		return User.parse(data.player)
	}

	public static async getById(theId: number): Promise<User>{
		Log.info('Getting User (smash.gg Player) with id %s', theId)
		const data = await NI.query(queries.user, {id: theId})
		return User.parseFull(data)
	}

	private id: number
	private gamerTag: string
	private prefix: string | null
	private color: string | null
	private twitchStream: string | null
	private twitterHandle: string | null
	private youtube: string | null
	private region: string | null
	private state: string | null
	private country: string | null
	private gamerTagChangedAt: number | null
		
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

	public getId() {
		return this.id
	}

	public getGamerTag() {
		return this.gamerTag
	}

	public getSponsor() {
		return this.prefix
	}

	public getColor(): string | null {
		return this.color
	}

	public getTwitchStream(): string | null {
		return this.twitchStream
	}

	public getTwitterHandle(): string | null {
		return this.twitterHandle
	}

	public getYoutube(): string | null {
		return this.youtube
	}

	public getRegion(): string | null {
		return this.region
	}

	public getState(): string | null {
		return this.state
	}

	public getCountry(): string | null {
		return this.country
	}

	public getGamerTagChangedAt(): Date | null {
		return this.gamerTagChangedAt ? Common.convertEpochToDate(this.gamerTagChangedAt) : null
	}

	public async getRecentSets(): Promise<IGGSet[]> {
		Log.info('Getting Sets for %s (User: %s)', this.gamerTag, this.id)
		const data: IUserDataSets = await NI.query(queries.userRecentGGSets, {id: this.id})
		const sets: IGGSet[] = data.player.recentSets.map(setData => GGSet.parse(setData))
		return sets
	}

	public async getRankings(): Promise<IPlayerRank[]> {
		Log.info('Getting Rankings for %s (User: %s)', this.gamerTag, this.id)
		const data: IUserDataRankings = await NI.query(queries.userRankings, {id: this.id})
		const rankings: IPlayerRank[] = data.player.rankings
		return rankings
	}
}
