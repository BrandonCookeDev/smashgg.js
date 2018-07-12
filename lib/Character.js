'use strict';

const log = require('winston');
const request = require('request-promise');
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
					'x-source': 'smashgg.js'
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

	static async getCharactersByGameId(id, options={}){
		log.verbose('getCharacterForGame called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = 'character::videogameId::%s';
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let characters = await Character.getAll(options);
			characters = characters.filter(e => { return e.videogameId === id; });
			
			if(isCached) await Cache.getInstance().set(cacheKey, characters);
			return characters;
		} catch(e){
			log.error('getCharactersForGame error: %s', e);
			throw e;
		}
	}

	static async getCharactersByGameName(name, options={}){
		log.verbose('getCharactersByGameName called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = 'character::videgameName::%s';
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let videoGame = await VideoGame.getByName(name, options);
			let character = await Character.getCharactersByGameId(videoGame.id , options);

			if(isCached) await Cache.getInstance().set(cacheKey, character);
			return character;
		} catch(e){
			log.error('getCharactersByGameName error: %s', e);
			throw e;
		}
	}

	static async getCharactersByName(name, options={}){
		log.verbose('getCharactersByName called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true;

			let cacheKey = 'characters::name::%s';
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
			log.error('getCharactersByName error: %s', e);
			throw e;
		}
	}


}

module.exports = Character;