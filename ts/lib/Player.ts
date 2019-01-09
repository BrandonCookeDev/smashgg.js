import log from 'winston'
import {EventEmitter} from 'events'
import {format} from 'util'
import request from 'request-promise'
import Cache from './util/Cache'

import { ICommon } from './interfaces/ICommon'
import { IPlayer } from './interfaces/IPlayer'

import Options = ICommon.Options
import PlayerEntity = IPlayer.Entity
import parseOptions = ICommon.parseOptions


const API_URL = 'https://api.smash.gg/player/%s';

export default class Player extends EventEmitter{

	public id: number = 0
	public tag: string = ''
	public name?: string = ''
	public country?: string = ''
	public state?: string = ''
	public sponsor?: string = ''
	public participantId?: number = 0
	public data?: PlayerEntity


	constructor(id: number, tag: string, name?: string, country?: string, 
				state?: string, sponsor?: string, participantId?: number, 
				data?: PlayerEntity){
		super();

		if(!id)
			throw new Error('Player ID cannot be null');

		this.id = id;
		this.tag = tag;
		this.name = name;
		this.country = country;
		this.state = state;
		this.sponsor = sponsor;
		this.participantId = participantId;
		this.data = data;
	}

	loadData(data: PlayerEntity) : void{
		this.data = data;
	}

	static async getPlayer(id: number, options: Options={}) : Promise<Player>{
		log.verbose('Player getPlayer called');
		try{
			// parse options
			options = parseOptions(options)

			let cacheKey = format('player::%s', id);
			if(options.isCached){
				let cached = await Cache.get(cacheKey);
				if(cached) return cached;
			}

			let req = {
				uri: format(API_URL, id),
				headers:{
					'X-SOURCE': 'smashgg.js'
				},
				method: 'GET'
			};
			
			let resp = JSON.parse(await request(req));
			let player = Player.resolveEntities(resp);

			await Cache.set(cacheKey, player);
			return player;
		} catch(e){
			log.error('Player getPlayer error: %s', e);
			throw e;
		}
	}

	static resolveEntities(player: PlayerEntity) : Player{
		let data = player.entities.player;

		let P = new Player(
			parseInt(data.id),
			data.gamerTag,
			data.name,
			data.country,
			data.state,
			data.prefix
		);
		P.loadData(data);
		return P;
	}

	static resolve(data: PlayerEntity) : Player{
		let playerId = 0;

		//for(let id in data.mutations.participants)
		//	participantId = id;

		for(let id in data.mutations.players)
			playerId = +id;

		let playerDetails = data.mutations.players[playerId];

		let P = new Player(
			playerId,
			playerDetails.gamerTag,
			playerDetails.name,
			playerDetails.country,
			playerDetails.state,
			playerDetails.prefix,
			data.id
		);
		P.loadData(data);
		return P;
	}

	/** SIMPLE GETTERS **/
	getId() : number{
		return this.id;
	}

	getTag(): string {
		return this.tag;
	}

	getName(): string | undefined{
		return this.name;
	}

	getCountry(): string | undefined{
		return this.country;
	}

	getState(): string | undefined{
		return this.state;
	}

	getSponsor(): string | undefined{
		return this.sponsor;
	}

	getParticipantId() : number | undefined{
		return this.participantId;
	}

	getFinalPlacement() : number | undefined {
		if(this.data)
			return this.data.finalPlacement || this.nullValueString('Final Placement');
		else throw new Error('No data to get Player property Final Placement');
	}

	/** NULL VALUES **/
	nullValueString(prop: string) : string{
		return prop + ' not available for Player ' + this.id;
	}
}

Player.prototype.toString = function(){
	return 'Player:' +
		'\nName: ' + this.name + 
		'\nTag: ' + this.tag + 
		'\nSponsor: ' + this.sponsor + 
		'\nCountry: ' + this.country + 
		'\nState: ' + this.state; 
};