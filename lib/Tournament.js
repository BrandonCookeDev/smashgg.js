'use strict';

let _ = require('lodash');
let log = require('winston');
let when = require('when');
let pmap = require('p-map');
let {format} = require('util');
let moment = require('moment-timezone');
let request  = require('request-promise');

let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let Event = require('./Event');
let PhaseGroup = require('./PhaseGroup');

const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';
const DEFAULT_CONCURRENCY = 4;

class Tournament extends EventEmitter{

	constructor(tournamentId, options={}){
		super();

		if(!tournamentId)
			throw new Error('Tournament Name cannot be null');
		else if(!isNaN(tournamentId))
			throw new Error('Due to Smashgg limitations, currently Tournaments may only be retrieved by tournament name (slug)');

		// parse options
		let expands = options.expands || {};
		let isCached = options.isCached != undefined ? options.isCached === true : true;
		let rawEncoding = options.rawEncoding || DEFAULT_ENCODING;

		// set properties
		this.data = {};
		this.name = isNaN(tournamentId) ? tournamentId : parseInt(tournamentId);
		this.isCached = isCached;
		this.rawEncoding = LEGAL_ENCODINGS.includes(rawEncoding) ? rawEncoding : DEFAULT_ENCODING;

		// create expands 
		this.expandsString = '';
		this.expands = {
			event: (expands && expands.event == false) ? false : true,
			phase: (expands && expands.phase == false) ? false : true,
			groups: (expands && expands.groups == false) ? false : true,
			stations: (expands && expands.stations == false) ? false : true
		};
		for(let property in this.expands){
			if(this.expands[property])
				this.expandsString += format('expand[]=%s&', property);
		}

		// format api url
		this.url = format(TOURNAMENT_URL, this.name, this.expandsString);

		let ThisTournament = this;
		this.load()
			.then(function(){
				let cacheKey = format('tournament::%s::%s', ThisTournament.name, ThisTournament.expandsString);
				Cache.set(cacheKey, ThisTournament);
			})
			.then(function() {
				ThisTournament.emitTournamentReady();
			})
			.catch(function(err){
				console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')');
				log.error('Tournament error: %s', err.message);
				ThisTournament.emitTournamentError(err);
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

	// Convenience methods
	static getTournament(tournamentName, options={}){
		let deferred = when.defer();
		try{
			let T = new Tournament(tournamentName, options);
			T.on('ready', function(){
				deferred.resolve(T);
			});
			T.on('error', function(e){
				log.error('getTournament error: %s', e);
				deferred.reject(e);
			});
		} catch(e){
			log.error('getTournament error: %s', e);
			deferred.reject(e);
		}
		return deferred.promise;
	}

	/**
	 * @deprecated
	 * This method is not in use yet because Smashgg doesn't support pulling
	 * tournaments by id yet
	 * 
	 * @param {*} tournamentId 
	 * @param {*} expands 
	 * @param {*} isCached 
	 */
	static getTournamentById(tournamentId, options={}){
		let deferred = when.defer();
		try{
			parseInt(tournamentId);
			Tournament.getTournamentById(tournamentId, options)
				.then(deferred.resolve)
				.catch(deferred.reject);
		} catch(e){
			log.error('getTournamentById error: tournamentId provided is not valid number');
			deferred.reject(new Error('tournamentId provided is not valid number'));
		}
		return deferred.promise;
	}

	async load(){
		log.debug('Tournament.load called');
		log.verbose('Creating Tournament from url: %s', this.url);
		try{
			if(!this.isCached)
				return this.data = JSON.parse(await request(this.url));

			let cacheKey = format('tournament::%s::%s::%s::data', this.name, this.rawEncoding, this.expandsString);
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
			log.error('Tournament.load error: %s', e.message);

			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = format('No Tournament with id/name [%s] ( %s )', this.tournamentId, this.url);
				log.error(s);
			}

			throw e;
		}
	}

	/** PROMISES **/
	async getAllPlayers(options={}){
		log.debug('Tournament.getAllPlayers called');

		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;
		let concurrency = options.concurrecny || DEFAULT_CONCURRENCY;

		try{
			log.info('Gettings players for ' + this.name);
			let cacheKey = format('tournament::%s::players', this.name);
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey);
				if(cached){
					this.players = cached;
					return cached;
				}
			}
			
			let groups = this.getData().entities.groups;
			let fn = async (group) => {
				let PG = await PhaseGroup.getPhaseGroup(group.id);
				return await PG.getPlayers();
			};
			let allPlayers = await pmap(groups, fn, {concurrency: concurrency});

			allPlayers = _.flatten(allPlayers);
			allPlayers = _.uniqBy(allPlayers, 'id');
			this.players = allPlayers;
			await Cache.set(cacheKey, this.players);
			return allPlayers;

		}catch(err){
			log.error('Tournament.getAllPlayers: ' + err);
			throw err;
		}
	}

	async getAllSets(options={}){
		log.debug('Tournament.getAllSets called');

		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;
		let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

		try{
			log.info('Gettings sets for ' + this.getName());
			let cacheKey = format('tournament::%s::sets', this.name);
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey);
				if(cached){
					this.players = cached;
					return cached;
				}
			}

			let groups = this.getData().entities.groups;
			let fn = async (group) => {
				let PG = await PhaseGroup.getPhaseGroup(group.id);
				return await PG.getSets();
			};
			let allSets = await pmap(groups, fn, {concurrency: concurrency});

			allSets = _.flatten(allSets);
			allSets = _.uniqBy(allSets, 'id');

			this.sets = allSets;
			await Cache.set(cacheKey, this.sets);
			return allSets;


		}catch(err){
			log.error('Tournament.getAllSets: ' + err);
			throw err;
		}
	}

	async getAllEvents(options={}){
		log.debug('Tournament.getAllEvents called');

		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true;
		let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

		try{
			log.info('Getting Events for ' + this.getName());
			let cacheKey = format('tournament::%s::events', this.name);
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey);
				if(cached){
					this.players = cached;
					return cached;
				}
			}

			let events = this.getData().entities.event;
			let fn = async (event) => {
				let eventId = event.id;
				return await Event.getEventById(eventId);
			};
			let allEvents = await pmap(events, fn, {concurrency: concurrency});

			this.events = allEvents;
			await Cache.set(cacheKey, this.events);
			return allEvents;

		} catch(err) {
			log.error('Tournament.getAllEvents: ' + err);
			throw err;
		}
	}

	async getIncompleteSets(options={}){
		log.debug('Tournament.getIncompleteSets called');
		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true;
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

			let events = await this.getAllEvents(options);
			let fn = async (event) => {
				return await event.getIncompleteSets(options);
			};
			let sets = await pmap(events, fn, {concurrency: concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Tournament.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getCompleteSets(options={}){
		log.debug('Tournament.getIncompleteSets called');
		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true;
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;

			let events = await this.getAllEvents(options);
			let fn = async (event) => {
				return await event.getCompleteSets(options);
			};
			let sets = await pmap(events, fn, {concurrency: concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Tournament.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getSetsXMinutesBack(minutesBack, options={}){
		log.verbose('Tournament.getSetsXMinutesBack called');
		try{
			// parse options
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY;
			options.isCached = false;

			let events = await this.getAllEvents(options);
			let fn = async (event) => {
				return await event.getSetsXMinutesBack(minutesBack, options);
			};
			let sets = await pmap(events, fn, {concurrency: concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Tournament.getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromDataEntities(prop){
		let data = this.getData();
		if(data && data.entities && data.entities.tournament) {
			if (!data.entities.tournament[prop])
				log.error(this.nullValueString(prop));
			return data.entities.tournament[prop];
		}
		else{
			log.error('No data to get Tournament property Id');
			return null;
		}
	}

	getId(){
		return this.getFromDataEntities('id');
	}

	getName(){
		return this.getFromDataEntities('name');
	}

	getSlug(){
		return this.getFromDataEntities('slug');
	}

	getTimezone(){
		return this.getFromDataEntities('timezone');
	}

	getStartTime(){
		let startAt = this.getFromDataEntities('startAt');
		let tz = this.getFromDataEntities('timezone');

		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(startAt).tz(tz);
			return time.toDate();
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present');
			return null;
		}
	}

	getStartTimeString(){
		let startAt = this.getFromDataEntities('startAt');
		let tz = this.getFromDataEntities('timezone');

		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(startAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
			let zone = moment.tz(tz).zoneName();
			return `${time} ${zone}`;
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present');
			return null;
		}
	}

	getEndTime(){
		let endAt = this.getFromDataEntities('endAt');
		let tz = this.getFromDataEntities('timezone');

		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(endAt).tz(tz);
			return time.toDate();
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present');
			return null;
		}
	}

	getEndTimeString(){
		let endAt = this.getFromDataEntities('endAt');
		let tz = this.getFromDataEntities('timezone');

		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(endAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
			let zone = moment.tz(tz).zoneName();
			return `${time} ${zone}`;
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present');
			return null;
		}
	}

	getWhenRegistrationCloses(){
		let closesAt = this.getFromDataEntities('eventRegistrationClosesAt');
		let tz = this.getFromDataEntities('timezone');


		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(closesAt).tz(tz);
			return time.toDate();
		}
		else{
			log.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present');
			return null;
		}
	}

	getWhenRegistrationClosesString(){
		let closesAt = this.getFromDataEntities('eventRegistrationClosesAt');
		let tz = this.getFromDataEntities('timezone');


		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(closesAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
			let zone = moment.tz(tz).zoneName();
			return `${time} ${zone}`;
		}
		else{
			log.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present');
			return null;
		}
	}

	getCity(){
		return this.getFromDataEntities('city');
	}

	getState(){
		return this.getFromDataEntities('addrState');
	}

	getZipCode(){
		return this.getFromDataEntities('postalCode');
	}

	getContactEmail(){
		return this.getFromDataEntities('contactEmail');
	}

	getContactTwitter(){
		return this.getFromDataEntities('contactTwitter');
	}

	getOwnerId(){
		return this.getFromDataEntities('ownerId');
	}

	getVenueFee(){
		return this.getFromDataEntities('venueFee');
	}

	getProcessingFee(){
		return this.getFromDataEntities('processingFee');
	}

	/** NULL VALUES **/
	nullValueString(prop){
		return prop + ' not available for tournament ' + this.getData().entities.tournament.name;
	}

	/** EVENTS **/
	emitTournamentReady(){
		this.emit('ready');
	}

	emitTournamentError(err){
		this.emit('error', err);
	}
}

Tournament.prototype.toString = function(){
	return 'Tournament: ' + 
		'\nName: ' + this.getName() + 
		'\nSlug: ' + this.getSlug() +
		'\nDate: ' + this.getStartTime() +  
		'\nState: ' + this.getState() + 
		'\nCity: ' + this.getCity(); 
};

module.exports = Tournament;