'use strict';

const log = require('winston');
const request = require('request-promise');
const {format} = require('util');

const Cache = require('./util/Cache');
const VideoGame = require('./VideoGame');

const API_URL = 'https://api.smash.gg/characters';

class Character{
	
	constructor(id, name, isCommon, videogameId){
		this.id = id;
		this.name = name;
		this.isCommon = isCommon;
		this.videogameId = videogameId;
	}

	getId(){
		return this.id;
	}

	getName(){
		return this.name;
	}

	getIsCommon(){
		return this.isCommon;
	}

	getVideoGameId(){
		return this.videogameId;
	}

	static async getAll(options={}){
		log.verbose('getAll called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = 'character::all';
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let req = {
				uri: API_URL,
				headers:{
					'X-SOURCE': 'smashgg.js'
				},
				method: 'GET'
			};
			
			let data = JSON.parse(await request(req));
			let characters = data.entities.character.map(e => {
				return new Character(
					e.id,
					e.name,
					e.isCommon,
					e.videogameId
				);
			});

			if(isCached) await Cache.getInstance().set(cacheKey, characters);
			return characters;
		} catch(e){
			log.error('getAll error: %s', e);
			throw e;
		}
	}

	static async getById(id, options={}){
		log.verbose('Character.getById called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = format('character::id::%s', id);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let characters = await Character.getAll(options);
			let match = characters.filter(e => { return e.id === id; });
			let character = match.length > 0 ? match[0] : undefined;
			
			if(isCached) await Cache.getInstance().set(cacheKey, characters);
			return character;
		} catch(e){
			log.error('Character.getById error: %s', e);
			throw e;
		}
	}

	static async getByGameId(id, options={}){
		log.verbose('Character.getByGameId called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = format('character::videogameId::%s', id);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let characters = await Character.getAll(options);
			characters = characters.filter(e => { return e.videogameId === id; });
			
			if(isCached) await Cache.getInstance().set(cacheKey, characters);
			return characters;
		} catch(e){
			log.error('Character.getByGameId error: %s', e);
			throw e;
		}
	}

	static async getByGameName(name, options={}){
		log.verbose('Character.getByGameName called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = format('character::videgameName::%s', name);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let videoGame = await VideoGame.getByName(name, options);
			if(!videoGame) throw new Error('No game by the name ' + name);
			
			let character = await Character.getByGameId(videoGame.id , options);

			if(isCached) await Cache.getInstance().set(cacheKey, character);
			return character;
		} catch(e){
			log.error('Character.getByGameName error: %s', e);
			throw e;
		}
	}

	static async getByName(name, options={}){
		log.verbose('Characters.getByName called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = format('characters::name::%s', name);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let characters = await Character.getAll(options);
			characters = characters.filter(e => { 
				return e.name.toLowerCase() === name.toLowerCase(); 
			});

			if(isCached) await Cache.getInstance().set(cacheKey, characters);
			return characters;
		} catch(e){
			log.error('Characters.getByName error: %s', e);
			throw e;
		}
	}

	static async getByNameAndGameId(name, videogameId, options={}){
		log.verbose('Character.getByNameAndGame called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = format('characters::name::%s::videogameId::%s', name, videogameId);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let characters = await Character.getByName(name, options);
			let match = characters.filter(e => { return e.videogameId == videogameId; });
			let character = match.length > 0 ? match[0] : undefined;

			await Cache.getInstance().set(cacheKey, character);
			return character;
		} catch(e){
			log.error('Character.getByNameAndGame error: %s', e);
			throw e;
		}
	}

	static async getByNameAndGame(name, gameName, options={}){
		log.verbose('Character.getByNameAndGame called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = format('characters::name::%s::game::%s', name, gameName);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let characters = await Character.getByName(name, options);
			let videogame = await VideoGame.getByName(gameName, options);
			let match = characters.filter(e => { return e.videogameId == videogame.id; });
			let character = match.length > 0 ? match[0] : undefined;

			await Cache.getInstance().set(cacheKey, character);
			return character;
		} catch(e){
			log.error('Character.getByNameAndGame error: %s', e);
			throw e;
		}
	}
}

Character.prototype.toString = function(){
	return 'Character: ' + 
		'\nName: ' + this.name + 
		'\nID: ' + this.id + 
		'\nVideoGame ID: ' + this.videogameId + 
		'\nIs Common? ' + this.isCommon;
};

module.exports = Character;