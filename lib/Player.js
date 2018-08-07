'use strict';

let log = require('winston');
let EventEmitter = require('events');
let {format} = require('util');
let request = require('request-promise');
let Cache = require('./util/Cache');

const API_URL = 'https://api.smash.gg/player/%s';

class Player extends EventEmitter{

	constructor(id, tag, name, country, state, sponsor, participantId, data){
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

	loadData(data){
		this.data = data;
	}

	static async getPlayer(id, options={}){
		log.verbose('Player getPlayer called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = format('player::%s', id);
			if(isCached){
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

	static resolveEntities(player){
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

	static resolve(data){
		let playerId = 0;

		//for(let id in data.mutations.participants)
		//	participantId = id;

		for(let id in data.mutations.players)
			playerId = id;

		let playerDetails = data.mutations.players[playerId];

		let P = new Player(
			parseInt(playerId),
			playerDetails.gamerTag,
			playerDetails.name,
			playerDetails.country,
			playerDetails.state,
			playerDetails.prefix,
			parseInt(data.id)
		);
		P.loadData(data);
		return P;
	}

	/** SIMPLE GETTERS **/
	getId(){
		return this.id;
	}

	getTag(){
		return this.tag;
	}

	getName(){
		return this.name;
	}

	getCountry(){
		return this.country;
	}

	getState(){
		return this.state;
	}

	getSponsor(){
		return this.sponsor;
	}

	getParticipantId(){
		return this.participantId;
	}

	getFinalPlacement(){
		if(this.data)
			return this.data.finalPlacement || this.nullValueString('Final Placement');
		else throw new Error('No data to get Player property Final Placement');
	}

	/** NULL VALUES **/
	nullValueString(prop){
		return prop + ' not available for Player ' + this.id;
	}
}

Player.prototype.toString = function(){
	return 'Player:' +
		'\nName: ' + this.name + 
		'\nTag: ' + this.tag + 
		'\nSponsor: ' + this.prefix + 
		'\nCountry: ' + this.country + 
		'\nState: ' + this.state; 
};

module.exports = Player;