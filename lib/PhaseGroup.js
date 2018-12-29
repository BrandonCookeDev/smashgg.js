'use strict';

let _ = require('lodash');
let log = require('winston');
let when = require('when');
let pmap = require('p-map');
let {format} = require('util');
let moment = require('moment');
let request  = require('request-promise');
let Cache = require('./util/Cache');
let EventEmitter = require('events');

let Set = require('./Set');
let Player = require('./Player');

const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';

class PhaseGroup extends EventEmitter{

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
			sets: (expands && expands.sets == false) ? false : true,
			entrants: (expands && expands.entrants == false) ? false : true,
			standings: (expands && expands.standings == false) ? false : true,
			seeds: (expands && expands.seeds == false) ? false : true
		};
		for(let property in this.expands){
			if(this.expands[property])
				this.expandsString += format('expand[]=%s&', property);
		}

		this.url = format(PHASE_GROUP_URL, this.id, this.expandsString);
		let ThisPhaseGroup = this;
		this.load()
			.then(function(){
				let cacheKey = format('phasegroup::%s::%s', ThisPhaseGroup.id, ThisPhaseGroup.expandsString);
				Cache.set(cacheKey, ThisPhaseGroup);
			})
			.then(function(){
				ThisPhaseGroup.emitPhaseGroupReady();
			})
			.catch(function(err){
				console.error('Error creating Tournament. For more info, implement PhaseGroup.on(\'error\')');
				log.error('Phase Group: %s', err.message);
				ThisPhaseGroup.emitPhaseGroupError(err);
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
	static getPhaseGroup(id, options={}){
		let deferred = when.defer();
		try{
			let PG = new PhaseGroup(id, options);
			PG.on('ready', function(){
				deferred.resolve(PG);
			});
			PG.on('error', function(e){
				log.error('getPhaseGroup error: %s',e);
				deferred.reject(e);
			});
		} catch(e){
			log.error('getPhaseGroup error: %s',e);
			deferred.reject(e);
		}
		return deferred.promise;
	}

	// Methods
	async load(){
		log.debug('PhaseGroup.load called');
		log.verbose('Creating Phase Group from url: %s', this.url);
		try{
			if(!this.isCached)
				return await request(this.url);

			let cacheKey = format('phasegroup::%s::%s::%s::data', this.id, this.rawEncoding, this.expandsString);
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
			log.error('PhaseGroup.load error: %s', e.message);
			
			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = format('No Phase Group with id [%s] ( %s )', this.id, this.url);
				log.error(s);
			}
			
			throw e;
		}
	}

	/** PROMISES **/
	async getPlayers(options={}){
		log.debug('PhaseGroup.getPlayers called');
		try {
			// parse options
			let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;

			let cacheKey = format('phasegroup::%s::players', this.id);
			if (fromCacheTF) {
				let cached = await Cache.get(cacheKey);
				if (cached) {
					this.players = cached;
					return cached;
				}
			}

			let players = this.getData().entities.entrants.map(entrant => {
				return Player.resolve(entrant);
			});

			this.players = players;
			await Cache.set(cacheKey, this.players);
			return this.players;
		}catch(err){
			log.error('PhaseGroup.getPlayers: ' + err);
			throw err;
		}
	}
	
	async getSets(options={}){
		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;
		let concurrency = options.concurrency || 4;

		try {
			if (!this.players)
				await this.getPlayers(fromCacheTF);

			// Caching logic
			let cacheKey = format('phasegroup::%s::sets', this.id);
			if (fromCacheTF) {
				let cached = await Cache.get(cacheKey);
				if (cached) {
					this.sets = cached;
					return cached;
				}
			}

			// Fetching logic
			let sets;
			let resolveSet = async function(set){
				try{
					if (!set.entrant1Id || !set.entrant2Id)
						return; // HANDLES BYES

					let Player1 = await this.findPlayerByParticipantId(set.entrant1Id);
					let Player2 = await this.findPlayerByParticipantId(set.entrant2Id);

					if (!Player1 || !Player2)
						return; // HANDLES Error of some sort

					let isComplete = false;
					if(set.winnerId && set.loserId)
						isComplete = true;

					let S;
					if(isComplete)
						S = new Set(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, set.entrant1Score, set.entrant2Score, set.winnerId, set.loserId);
					else
						S = new Set(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete);
					
					S.loadData(set);
					return S;
				} catch(e){
					console.error(e.message);
					throw e;
				}
			}.bind(this);
			sets = await pmap(this.getData().entities.sets, resolveSet, {concurrency: concurrency});
			sets = sets.filter(set => { return set != undefined; });
			this.sets = sets;

			await Cache.set(cacheKey, this.sets);
			return this.sets;
		} catch(err){
			log.error('PhaseGroup.getSets: ' + err);
			throw err;
		}
	}

	async getCompleteSets(options={}){
		log.verbose('PhaseGroup getCompleteSets called');

		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true;

			let sets = await this.getSets(options);
			let completeSets = sets.filter(set => { return set.isComplete == true; });
			return completeSets;			
		} catch(e){
			log.error('PhaseGroup getCompleteSets error: %s', e);
			throw e;
		}
	}

	async getIncompleteSets(options={}){
		log.verbose('PhaseGroup getIncompleteSets called');

		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true;

			let sets = await this.getSets(options);
			let completeSets = sets.filter(set => { return set.isComplete == false; });
			return completeSets;			
		} catch(e){
			log.error('PhaseGroup getIncompleteSets error: %s', e);
			throw e;
		}
	}

	// TODO needs coverage
	async getSetsXMinutesBack(minutes, options={}){
		log.verbose('PhaseGroup getSetsXMinutesBack called');

		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : false;
			options.isCached = isCached;

			let now = moment();
			let sets = await this.getSets(options);
			let filtered = sets.filter(set => {
				let then = moment(set.getCompletedAt());
				let diff = moment.duration(now.diff(then));

				let diffMinutes = diff.minutes();
				if(diff.hours() > 0 || diff.days() > 0 || diff.months() > 0 || diff.years() > 0) 
					return false;
				else 
					return diffMinutes <= minutes && diffMinutes >= 0 && set.getIsComplete();
			});
			return filtered;
		} catch(e){
			log.error('PhaseGroup getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromDataEntities(prop){
		let data = this.getData();
		if(data && data.entities && data.entities.groups) {
			if (!data.entities.groups[prop])
				log.error(this.nullValueString(prop));
			return data.entities.groups[prop];
		}
		else{
			log.error('No data to get Tournament property Id');
			return null;
		}
	}

	getPhaseId(){
		return this.getFromDataEntities('phaseId');
	}

	/** NULL VALUES **/
	nullValueString(prop){
		return prop + ' not available for PhaseGroup ' + this.id;
	}

	/** EVENTS **/
	emitPhaseGroupReady(){
		this.emit('ready');
	}

	emitPhaseGroupError(err){
		this.emit('error', err);
	}

	/** OTHER **/
	async findPlayerByParticipantId(id){
		if(!this.players)
			await this.getPlayers();
		let player = _.find(this.players, {participantId: id});
		return player;
	}


}

PhaseGroup.prototype.toString = function(){
	return 'Phase Group:' +
		'\nID: ' + this.id + 
		'\nExpands: ' + JSON.stringify(this.expands) +
		'\nIsCached: ' + this.isCached;
};

module.exports = PhaseGroup;

