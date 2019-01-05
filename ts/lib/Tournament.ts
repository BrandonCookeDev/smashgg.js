import * as _ from 'lodash'
import * as log from 'winston'
import * as when from 'when'
import * as pmap from 'p-map'
import { format } from 'util'
import * as moment from 'moment-timezone'
import * as request from 'request-promise'
import * as EventEmitter from 'events'

import * as Cache from './util/Cache'
import * as Event from './Event'
import * as Phase from './Phase'
import * as PhaseGroup from './PhaseGroup'
import * as Player from './Player'
import * as Set from './Set'
import { object, string } from 'sinon/lib/sinon/match';

const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';
const DEFAULT_CONCURRENCY = 4;

interface TournamentOptions{
    expands?: TournamentExpands, 
    isCached?: boolean, 
    rawEncoding?: string
}

interface Options{
    isCached?: boolean, 
    rawEncoding?: string,
    concurrency?: number    
}

interface TournamentExpands{
	event: boolean,
	phase: boolean,
	groups: boolean,
	stations: boolean
}

interface TournamentData{
	entities: {
		tournament: {
			id: string,
			[x: string]: any 
		}
		event?: [{
			id: string
			[x: string]: any 
		}],
		phases?: [{
			id: string
			[x: string]: any 
		}],
		groups?: [{
			id: string
			[x: string]: any 
		}]
	}
}


function parseOptions(options: Options) : Options {
    let isCached: boolean = options.isCached != undefined ? options.isCached === true : true;
    let concurrency: number = options.concurrency || DEFAULT_CONCURRENCY;
	let rawEncoding: string = options.rawEncoding || DEFAULT_ENCODING
	return {
		isCached: isCached,
		concurrency: concurrency,
		rawEncoding: rawEncoding
	}
}

function parseTournamentOptions(options: TournamentOptions) : TournamentOptions {
	let isCached: boolean = options.isCached != undefined ? options.isCached === true : true;
	let rawEncoding: string = options.rawEncoding || DEFAULT_ENCODING;
	let expands = {
		event: (options.expands != undefined && options.expands.event == false) ? false : true,
		phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
		groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
		stations: (options.expands != undefined && options.expands.stations == false) ? false : true
	};
	return {
		expands: expands,
		isCached: isCached,
		rawEncoding: rawEncoding
	}
}

class Tournament extends EventEmitter{

	url: string = ''
    data: object | string = {}
	name: string | number
    expands: object = {}
    expandsString: string = ''
    isCached: boolean = true
	rawEncoding: string = DEFAULT_ENCODING
	
	sets: Array<Set> = []
	events: Array<Event> = []
	phases: Array<Phase> = []
	players: Array<Player> = []
	phaseGroups: Array<PhaseGroup> = []


	constructor(
        tournamentId: string | number, 
        options?: TournamentOptions
    ){
		super();

		if(!tournamentId)
			throw new Error('Tournament Name cannot be null');
		else if(tournamentId instanceof Number)
			throw new Error('Due to Smashgg limitations, currently Tournaments may only be retrieved by tournament name (slug)');

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true;
		let rawEncoding = options.rawEncoding || DEFAULT_ENCODING;

		// set properties
		this.data = {};
		this.name = tournamentId instanceof String ? tournamentId : +tournamentId;
		this.isCached = isCached;
		this.rawEncoding = LEGAL_ENCODINGS.includes(rawEncoding) ? rawEncoding : DEFAULT_ENCODING;

		// create expands 
		this.expandsString = '';
		this.expands = {
			event: (options.expands && options.expands.event == false) ? false : true,
			phase: (options.expands && options.expands.phase == false) ? false : true,
			groups: (options.expands && options.expands.groups == false) ? false : true,
			stations: (options.expands && options.expands.stations == false) ? false : true
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
				Cache.getInstance().set(cacheKey, ThisTournament);
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

	loadData(data: object) : object | string{
		let encoded: object | string = this.rawEncoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
		this.data = encoded;
		return encoded;
	}

	getData() : TournamentData {
		let decoded: TournamentData = this.rawEncoding == 'json' ? this.data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8'));
		return decoded;
	}

	// Convenience methods
	static getTournament(tournamentName, options={}) : Promise<Tournament> {
        return new Promise(function(resolve, reject){
            try{
                let T: Tournament = new Tournament(tournamentName, options);
                T.on('ready', function(){
                    resolve(T);
                });
                T.on('error', function(e){
                    log.error('getTournament error: %s', e);
                    reject(e);
                });
            } catch(e){
                log.error('getTournament error: %s', e);
                reject(e);
            }
        });
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
	static getTournamentById(tournamentId: number, options={}) : Promise<Tournament>{
		return new Promise(function(resolve, reject){
            try{
                return Tournament.getTournamentById(tournamentId, options)
                    .then(resolve)
                    .catch(reject);
            } catch(e){
                log.error('getTournamentById error: tournamentId provided is not valid number');
                reject(new Error('tournamentId provided is not valid number'));
            }
        })
	}

	async load() : Promise<object | string> {
		log.debug('Tournament.load called');
		log.verbose('Creating Tournament from url: %s', this.url);
		try{
			if(!this.isCached)
				return this.data = JSON.parse(await request(this.url));

			let cacheKey: string = format('tournament::%s::%s::%s::data', this.name, this.rawEncoding, this.expandsString);
			let cached: object = await Cache.getInstance().get(cacheKey);

			if(!cached){
				let response: string = await request(this.url);
				let encoded: object | string = this.loadData(JSON.parse(response));
				await Cache.getInstance().set(cacheKey, encoded);
				return encoded;
			}
			else {
				this.data = cached;
				return this.data;
			}
		} catch(e){
			log.error('Tournament.load error: %s', e.message);

			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = format('No Tournament with id/name [%s] ( %s )', this.name, this.url);
				log.error(s);
			}

			throw e;
		}
	}

	/** PROMISES **/
	async getAllPlayers(options: Options={}) : Promise<Array<Player>> {
		log.debug('Tournament.getAllPlayers called');

		// parse options
		options = parseOptions(options)

		try{
			log.info('Gettings players for ' + this.name);
			let cacheKey: string = format('tournament::%s::players', this.name);
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached){
					this.players = cached;
					return cached;
				}
			}
			
			let groups = this.getData().entities.groups;
			let fn = async (group) : Promise<Array<Player>> => {
				let PG: PhaseGroup = await PhaseGroup.getPhaseGroup(group.id);
				return await PG.getPlayers();
			};
			let allPlayers: Array<Player> = await pmap(groups, fn, {concurrency: options.concurrency});

			allPlayers = _.flatten(allPlayers);
			allPlayers = _.uniqBy(allPlayers, 'id');
			this.players = allPlayers;
			await Cache.getInstance().set(cacheKey, this.players);
			return allPlayers;

		}catch(err){
			log.error('Tournament.getAllPlayers: ' + err);
			throw err;
		}
	}

	async getAllSets(options: Options={}) : Promise<Array<Set>> {
		log.debug('Tournament.getAllSets called');

		// parse options
		options = parseOptions(options)

		try{
			log.info('Gettings sets for ' + this.getName());
			let cacheKey: string = format('tournament::%s::sets', this.name);
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached){
					this.players = cached;
					return cached;
				}
			}

			let groups = this.getData().entities.groups;
			let fn = async (group) : Promise<Array<Set>> => {
				let PG: PhaseGroup = await PhaseGroup.getPhaseGroup(group.id);
				return await PG.getSets();
			};
			let allSets : Array<Set> = await pmap(groups, fn, {concurrency: options.concurrency});

			allSets = _.flatten(allSets);
			allSets = _.uniqBy(allSets, 'id');

			this.sets = allSets;
			await Cache.getInstance().set(cacheKey, this.sets);
			return allSets;


		}catch(err){
			log.error('Tournament.getAllSets: ' + err);
			throw err;
		}
	}

	async getAllEvents(options: Options={}) : Promise<Array<Event>> {
		log.debug('Tournament.getAllEvents called');

		// parse options
		options = parseOptions(options);

		try{
			log.info('Getting Events for ' + this.getName());
			let cacheKey = format('tournament::%s::events', this.name);
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached){
					this.players = cached;
					return cached;
				}
			}

			let events = this.getData().entities.event;
			let fn = async (event) : Promise<Array<Event>> => {
				let eventId = event.id;
				return await Event.getEventById(eventId);
			};
			let allEvents: Array<Event> = await pmap(events, fn, {concurrency: options.concurrency});

			this.events = allEvents;
			await Cache.getInstance().set(cacheKey, this.events);
			return allEvents;

		} catch(err) {
			log.error('Tournament.getAllEvents: ' + err);
			throw err;
		}
	}

	async getIncompleteSets(options: Options={}) : Promise<Array<Set>> {
		log.debug('Tournament.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options);

			let events : Array<Event> = await this.getAllEvents(options);
			let fn = async (event) : Promise<Array<Set>> => {
				return await event.getIncompleteSets(options);
			};
			let sets : Array<Set> = await pmap(events, fn, {concurrency: options.concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Tournament.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getCompleteSets(options: Options={}) : Promise<Array<Set>> {
		log.debug('Tournament.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options)

			let events: Array<Event> = await this.getAllEvents(options);
			let fn = async (event) : Promise<Array<Set>> => {
				return await event.getCompleteSets(options);
			};
			let sets: Array<Set> = await pmap(events, fn, {concurrency: options.concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Tournament.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getSetsXMinutesBack(minutesBack: number, options: Options={}) : Promise<Array<Set>> {
		log.verbose('Tournament.getSetsXMinutesBack called');
		try{
			// parse options
			options = parseOptions(options);
			options.isCached = false;

			let events: Array<Event> = await this.getAllEvents(options);
			let fn = async (event) : Promise<Array<Set>> => {
				return await event.getSetsXMinutesBack(minutesBack, options);
			};
			let sets: Array<Set> = await pmap(events, fn, {concurrency: options.concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Tournament.getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromDataEntities(prop: string){
		let data: TournamentData = this.getData();
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

	getId() : number {
		return this.getFromDataEntities('id');
	}

	getName() : string {
		return this.getFromDataEntities('name');
	}

	getSlug() : string {
		return this.getFromDataEntities('slug');
	}

	getTimezone() : string {
		return this.getFromDataEntities('timezone');
	}

	getStartTime() : Date{
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

	getStartTimeString() : string{
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

	getEndTime() : Date{
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

	getEndTimeString() : string{
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

	getWhenRegistrationCloses() : Date{
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

	getWhenRegistrationClosesString() : string{
		let closesAt: number = this.getFromDataEntities('eventRegistrationClosesAt');
		let tz: string = this.getFromDataEntities('timezone');


		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time: string = moment.unix(closesAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
			let zone: string = moment.tz(tz).zoneName();
			return `${time} ${zone}`;
		}
		else{
			log.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present');
			return null;
		}
	}

	getCity() : string {
		return this.getFromDataEntities('city');
	}

	getState() : string {
		return this.getFromDataEntities('addrState');
	}

	getZipCode() : string {
		return this.getFromDataEntities('postalCode');
	}

	getContactEmail() : string {
		return this.getFromDataEntities('contactEmail');
	}

	getContactTwitter() : string {
		return this.getFromDataEntities('contactTwitter');
	}

	getOwnerId() : string {
		return this.getFromDataEntities('ownerId');
	}

	getVenueFee() : string {
		return this.getFromDataEntities('venueFee');
	}

	getProcessingFee() : string {
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