import NI from '../util/NetworkInterface'
import * as queries from '../scripts/userQueries'
import Log from '../util/Logger'

import {
	IUser, 
	IUserData, 
	IUserDataFull, 
	IUserDataSets, 
	IUserDataRankings
} from '../interfaces/IUser'
import {IPlayerRank} from '../interfaces/IPlayerRank'
import {IGGSet} from '../interfaces/IGGSet'

import {GGSet} from './GGSet'

export class User implements IUser{

	public static parse(data: IUserData): User{
		return new User(
			data.id,
	        data.bio,
	        data.discriminator,
	        data.email,
	        data.genderPronoun,
	        data.name,
	        data.player.id,
	        data.player.gamerTag,
	        data.player.prefix
		)
	}

	public static parseFull(data: IUserDataFull): User{
		return User.parse(data.user)
	}

	public static async getById(theId: number): Promise<User>{
		Log.info('Getting User (smash.gg Player) with id %s', theId)
		const data = await NI.query(queries.user, {id: theId})
		return User.parseFull(data)
	}

	private id: number | null
    private bio: string | null
    private discriminator: string | null
    private email: string | null
    private genderPronoun: string | null
    private name: string | null
    private playerId: number | null
    private playerGamertag: string | null
    private playerPrefix: string | null

	// SonarLint TODO: Need restructuring so we dont have as many parameters
	constructor(
		id: number | null,
        bio: string | null,
        discriminator: string | null,
        email: string | null,
        genderPronoun: string | null,
        name: string | null,
        playerId: number | null,
        playerGamertag: string | null,
        playerPrefix: string | null
	){
		this.id = id
        this.bio = bio
        this.discriminator = discriminator
        this.email = email
        this.genderPronoun = genderPronoun
        this.name = name
        this.playerId = playerId
        this.playerGamertag = playerGamertag
        this.playerPrefix = playerPrefix
	}

	public getId() {
		return this.id
	}

	public getBio() {
		return this.bio
	}

	public getDiscriminator() {
        return this.discriminator
    }

    public getEmail() {
        return this.email
    }

    public getGenderPronoun() {
        return this.genderPronoun
    }

    public getName() {
        return this.name
    }

    public getPlayerId() {
        return this.playerId
    }

    public getPlayerGamertag() {
        return this.playerGamertag
    }

	public getSponsor() {
		return this.playerPrefix
	}

	public async getRecentSets(): Promise<IGGSet[]> {
		Log.info('Getting Sets for %s (User: %s)', this.playerGamertag, this.id)
		const data: IUserDataSets = await NI.query(queries.userRecentGGSets, {id: this.id})
		const sets: IGGSet[] = data.player.recentSets.map(setData => GGSet.parse(setData))
		return sets
	}

	public async getRecentStandings(): Promise<IPlayerRank[]> {
		Log.info('Getting Rankings for %s (User: %s)', this.playerGamertag, this.playerId)
		const data: IUserDataRankings = await NI.query(queries.userRecentStandings, {id: this.playerId})
		const rankings: IPlayerRank[] = data.player.recentStandings
		return rankings
	}
}
