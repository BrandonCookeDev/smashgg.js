'use strict';

let log = require('winston');
let request = require('request-promise');
let {format} = require('util');

let Cache = require('./util/Cache');

const API_URL = 'https://api.smash.gg/public/videogames';
//const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
//const DEFAULT_ENCODING = 'json';

class VideoGame{

	constructor(id, name, abbrev, displayName, minPerEntry, 
		maxPerEntry, approved, slug, isCardGame){
		
		this.id = id;
		this.name = name;
		this.abbrev = abbrev;
		this.displayName = displayName;
		this.minPerEntry = minPerEntry;
		this.maxPerEntry = maxPerEntry;
		this.approved = approved;
		this.slug = slug;
		this.isCardGame = isCardGame;
	}

	encode(data, encoding){
		let encoded = encoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(encoding);
		this.data = encoded;
		return encoded;
	}

	decode(data, encoding){
		let decoded = this.rawEncoding == 'json' ? data : JSON.parse(new Buffer(data, encoding).toString('utf8'));
		return decoded;
	}

	getId(){
		return this.id;
	}

	getName(){
		return this.name;
	}

	getAbbreviation(){
		return this.abbrev;
	}

	getDisplayName(){
		return this.displayName;
	}

	getMinPerEntry(){
		return this.minPerEntry;
	}

	getMaxPerEntry(){
		return this.maxPerEntry;
	}

	getApproved(){
		return this.approved;
	}

	getSlug(){
		return this.slug;
	}

	getIsCardGame(){
		return this.isCardGame;
	}

	static async getAll(options={}){
		log.debug('VideoGames getAll called');
		try{
			// parse options
			let isCached = options.isCached || true;
			//let rawEncoding = LEGAL_ENCODINGS.includes(options.rawEncoding) ? options.rawEncoding : DEFAULT_ENCODING;

			let cacheKey = 'videoGames::all';
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}
			
			let data = JSON.parse(await request(API_URL));
			let videoGames = data.entities.videogame.map(videoGame => {
				return new VideoGame(
					videoGame.id,
					videoGame.name,
					videoGame.abbrev,
					videoGame.displayName,
					videoGame.minPerEntry,
					videoGame.maxPerEntry,
					videoGame.approved,
					videoGame.slug,
					videoGame.isCardGame
				);
			});

			if(isCached) await Cache.getInstance().set(cacheKey, videoGames);
			return videoGames;
		} catch(e){
			log.error('VideoGames getAll error: %s', e);
			throw e;
		}
	}

	static async getById(id, options={}){
		log.debug('VideoGame getById called [%s]', id);
		try{
			// parse options
			let isCached = options.isCached;

			let cacheKey = format('VideoGame::id::%s', id);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let data = await VideoGame.getAll(options);
			let videoGames = data.filter(vg => { return vg.id === id; });
			if(videoGames.length <= 0) throw new Error('No video game with id ' + id);
			let videoGame = videoGames[0];

			if(isCached) Cache.getInstance().set(cacheKey, videoGame);
			return videoGame;
		} catch(e){
			log.error('VideoGame getById error: %s', e);
			throw e;
		}
	}

	static async getByName(name, options={}){
		log.debug('VideoGame getByName called [%s]', name);
		try{
			// parse options
			let isCached = options.isCached || true;

			let cacheKey = format('VideoGame::name::%s', name);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let data = await VideoGame.getAll();
			let videoGames = data.filter(vg => {
				return vg.name === name || 
					vg.abbrev === name ||
					vg.slug === name ||
					vg.displayName === name;
			});
			if(videoGames.length <= 0) throw new Error('No video game with name ' + name);
			let videoGame = videoGames[0];

			if(isCached) Cache.getInstance().set(cacheKey, videoGame);
			return videoGame;
		} catch(e){
			log.error('VideoGame getByName error: %s', e);
			throw e;
		}
	}
}

module.exports = VideoGame;