'use strict';

let _ = require('lodash');
let log = require('winston');
let when = require('when');
let pmap = require('p-map');
let format = require('util').format;
let request  = require('request-promise');
let Cache = require('./util/Cache');
let EventEmitter = require('events');

let PhaseGroup = require('./PhaseGroup');

const PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';
const DEFAULT_CONCURRENCY = 4;

class Phase extends EventEmitter{

	constructor(id, options={}){
		super();

		if(!id)
			throw new Error('ID cannot be null for Phase Group');

		// parse options
		let expands = options.expands;
		let isCached = options.isCached != undefined ? options.isCached === true : true;
		let rawEncoding = options.rawEncoding || DEFAULT_ENCODING;

		// set properties
		this.data = {};
		this.id = id;
		this.isCached = isCached;
		this.rawEncoding = LEGAL_ENCODINGS.includes(rawEncoding) ? rawEncoding : DEFAULT_ENCODING;

		// CREATE THE EXPANDS STRING
		this.expandsString = '';
		this.expands = {
			groups: (expands && expands.groups == false) ? false : true
		};
		for(let property in this.expands){
			if(this.expands[property])
				this.expandsString += format('expand[]=%s&', property);
		}

		this.url = format(PHASE_URL, this.id, this.expandsString);

		let ThisPhase = this;
		this.load()
			.then(function(){
				let cacheKey = format('phase::%s::%s', ThisPhase.id, ThisPhase.expandsString);
				Cache.set(cacheKey, ThisPhase);
			})
			.then(function(){
				ThisPhase.emitPhaseReady();
			})
			.catch(function(err){
				console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')');
				log.error('Phase error: %s', err.message);
				ThisPhase.emitPhaseError(err);
			});
	}

	loadData(data){
		let encoded = this.rawEncoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
		this.data = encoded;
		return encoded;
	}

	getData(){
		let decoded = this.rawEncoding == 'json' ? this.data : JSON.parse(new Buffer(this.data, this.rawEncoding).toString('utf8'));
		return decoded;
	}

	// Convenience Methods
	static getPhase(id, options={}){
		let deferred = when.defer();
		try{
			let P = new Phase(id, options);
			P.on('ready', function(){
				deferred.resolve(P);
			});
			P.on('error', function(e){
				log.error('getPhase error: %s', e);
				deferred.reject(e);
			});
		} catch(e){
			log.error('getPhase error: %s', e);
			deferred.reject(e);
		}
		return deferred.promise;
	}

	async load(){
		log.debug('Phase.load called');
		log.verbose('Creating Phase from url: %s', this.url);
		try{
			if(!this.isCached)
				return await request(this.url);

			let cacheKey = format('phase::%s::%s::%s::data', this.id, this.rawEncoding, this.expandsString);
			let cached = await Cache.get(cacheKey);

			if(!cached){
				let response = await request(this.url);
				let encoded = this.loadData(JSON.parse(response));
				await Cache.set(cacheKey, encoded);
				return encoded;
			}
			else {
				this.data = cached;
				return this.data;
			}
		} catch(e){
			log.error('Phase.load error: %s', e.message);
			
			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = format('No Phase with id [%s] ( %s )', this.id, this.url);
				log.error(s);
			}
			
			throw e;
		}
	}

	/** PROMISES **/
	async getPhaseGroups(options={}){
		log.debug('Phase.getGroups called');

		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;
		let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

		try {
			let cacheKey = format('phase::%s::groups', this.id);
			if (fromCacheTF) {
				let cached = await Cache.get(cacheKey);
				if (cached) {
					this.groups = cached;
					return cached;
				}
			}

			let groups = this.getData().entities.groups;
			let fn = async (group) => {
				return await PhaseGroup.getPhaseGroup(group.id);
			};
			let allPhaseGroups = await pmap(groups, fn, {concurrency: concurrency});

			allPhaseGroups = _.uniqBy(allPhaseGroups, 'id');
			this.groups = allPhaseGroups;
			Cache.set(cacheKey, allPhaseGroups);
			return allPhaseGroups;
		}
		catch(err){
			log.error('Phase.getGroups: ' + err);
			throw err;
		}
	}

	async getSets(options={}){
		log.debug('Phase.getSets called');

		try{
			// parse options
			let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

			let cacheKey = format('phase::%s::sets', this.id);
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey);
				if(cached) return cached;
			}

			let phaseGroups = await this.getPhaseGroups(options);
			let fn = async (group) => {
				return await group.getSets();
			};
			let sets = await pmap(phaseGroups, fn, {concurrency: concurrency});

			sets = _.flatten(sets);
			if(fromCacheTF) await Cache.set(cacheKey, sets);
			return sets;

		} catch(e){
			log.error('Phase.getSets error: %s', e);
			throw e;
		}
	}

	async getPlayers(options={}){
		log.debug('Phase.getPlayers called');

		try{
			// parse options
			let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

			let cacheKey = format('phase::%s::players', this.id);
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey);
				if(cached) return cached;
			}

			let phaseGroups = await this.getPhaseGroups(options);
			let fn = async (group) => {
				return await group.getPlayers();
			};
			let players = await pmap(phaseGroups, fn, {concurrency: concurrency});

			players = _.flatten(players);
			players = _.uniqBy(players, 'id');
			if(fromCacheTF) await Cache.set(cacheKey, players);
			return players;
		} catch(e){
			log.error('Phase.getPlayers error: %s', e);
			throw e;
		}
	}

	async getIncompleteSets(options={}){
		log.debug('Phase.getIncompleteSets called');
		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true;
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

			let groups = await this.getPhaseGroups(options);
			let fn = async (group) => {
				return await group.getIncompleteSets(options);
			};
			let sets = await pmap(groups, fn, {concurrency: concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Phase.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getCompleteSets(options={}){
		log.debug('Phase.getIncompleteSets called');
		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true;
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

			let groups = await this.getPhaseGroups(options);
			let fn = async (group) => {
				return await group.getCompleteSets(options);
			};
			let sets = await pmap(groups, fn, {concurrency: concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Phase.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getSetsXMinutesBack(minutesBack, options={}){
		log.verbose('Phase.getSetsXMinutesBack called');
		try{
			// parse options
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;
			options.isCached = false;

			let groups = await this.getPhaseGroups(options);
			let fn = async (group) => {
				return await group.getSetsXMinutesBack(minutesBack, options);
			};
			let sets = await pmap(groups, fn, {concurrency: concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Phase.getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromDataEntities(prop){
		let data = this.getData();
		if(data && data.entities && data.entities.phase) {
			if (!data.entities.phase[prop])
				log.error(this.nullValueString(prop));
			return data.entities.phase[prop];
		}
		else{
			log.error('No data to get Tournament property Id');
			return null;
		}
	}

	getName(){
		return this.getFromDataEntities('name');
	}

	getEventId(){
		return this.getFromDataEntities('eventId');
	}

	/** NULL VALUES **/
	nullValueString(prop){
		return prop + ' not available for Phase ' + this.getData().entities.phase.name;
	}

	/** EVENTS **/
	emitPhaseReady(){
		this.emit('ready');
	}

	emitPhaseError(err){
		this.emit('error', err);
	}
}

Phase.prototype.toString = function(){
	return 'Phase: ' + 
		'\nID: ' + this.id + 
		'\nName: ' + this.getName() +
		'\nEvent ID: ' + this.getEventId();
};

module.exports = Phase;