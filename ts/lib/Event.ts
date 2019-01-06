import _ from 'lodash'
import moment from 'moment'
import log from 'winston'
import pmap from 'p-map'
import request from 'request-promise'
import { EventEmitter } from 'events'
import { format } from 'util'

import * as Common from './util/Common'
import Cache from './util/Cache'
import Phase from './Phase'
import PhaseGroup from './PhaseGroup'
import GGSet from './GGSet'
import Player from './Player'
import Encoder from './util/Encoder'
import Fetcher from './util/EntityFetcher'

const EVENT_URL = 'https://api.smash.gg/event/%s?%s'
const EVENT_SLUG_URL = 'https://api.smash.gg/%s/event/%s?%s'
const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s'
const EVENT_TOURNAMENT_CACHE_KEY = 'event::%s::%s'
const EVENT_ID_CACHE_KEY = 'event::%s::%s'
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
const DEFAULT_ENCODING = 'json'
const DEFAULT_CONCURRENCY = 4

import { ICommon } from './models/ICommon'
import { ITournament } from './models/ITournament'
import { IEvent } from './models/IEvent'

import Data = IEvent.Data
import EventExpands = IEvent.Expands
import EventOptions = IEvent.Options
import TournamentOptions = ITournament.Options
import TournamentExpands = ITournament.Expands
import Entity = ICommon.Entity
import Options = ICommon.Options
import parseOptions = Common.parseOptions

function parseTournamentOptions(options: TournamentOptions) : TournamentOptions {
	return {
		expands: {
			event: (options.expands != undefined  && options.expands.event == false) ? false : true,
			phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
			groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
			stations: (options.expands != undefined && options.expands.stations == false) ? false : true
		},
		isCached: options.isCached != undefined ? options.isCached === true : true,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

function parseEventOptions(options: EventOptions) : EventOptions {
	return{
		expands: {
			phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
			groups: (options.expands != undefined && options.expands.groups == false) ? false : true
		},
		isCached: options.isCached != undefined ? options.isCached === true : true,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

export default class Event extends EventEmitter implements IEvent.Event{

	id: number = 0
	url: string = ''
	data: Data | string = {
		entities:{
			event:{
				id: 0
			}
		}
	}
	eventId: string | number
	expands: EventExpands = {
		phase: true,
		groups: true
	};
	expandsString: string = ''
	tournamentId: string | undefined
	tournamentSlug: string = ''
	isCached: boolean = true
	rawEncoding: string = DEFAULT_ENCODING
	phases: Array<Phase> = [];
	groups: Array<PhaseGroup> = [];

	constructor(eventId: string | number, tournamentId?: string, options: EventOptions={}){
		super();
		
		if(!eventId)
			throw new Error('Event Constructor: Event Name/ID cannot be null for Event');

		// set properties
		this.tournamentId = tournamentId;
		this.isCached = options.isCached != undefined ? options.isCached === true : true;;
		this.eventId = typeof(eventId) === 'string' ? eventId : +eventId; 
		this.rawEncoding = LEGAL_ENCODINGS.includes(this.rawEncoding) ? this.rawEncoding : DEFAULT_ENCODING;

		// create expands
		this.expandsString = '';
		if(options.expands){
			this.expands = Object.assign(this.expands, options.expands);
		}
		for(let property in this.expands){
			if(this.expands.hasOwnProperty(property))
				this.expandsString += format('expand[]=%s&', property);
		}

		this.loadEventData().then();
	}

	async getTournamentData(tournamentId: string, options: TournamentOptions = {}): Promise<Entity>{
		try{
			options = parseTournamentOptions(options);
			
			let cacheKey: string = format(EVENT_TOURNAMENT_CACHE_KEY, tournamentId, options.rawEncoding);
			if(options.isCached){
				let cached: Entity = await Cache.get(cacheKey) as Entity;
				return cached;
			}

			let url: string = format(TOURNAMENT_URL, tournamentId);
			let data: Entity = JSON.parse(await request(url));
			await Cache.set(cacheKey, data);
			return data;
		} catch(err){
			console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
			log.error('Event error: %s', err.message);
			this.emitEventError(err);
			throw err;
		}
	}

	async loadEventData(): Promise<string | object>{
		try{
			if(typeof this.eventId === 'string' && this.tournamentId){
				let T: Entity = await this.getTournamentData(this.tournamentId);

				this.tournamentSlug = T.tournament.slug;
				this.url = format(EVENT_SLUG_URL, this.tournamentSlug, this.eventId, this.expandsString);
				await this.load();
			
				let cacheKey = format(EVENT_TOURNAMENT_CACHE_KEY, this.tournamentId, this.eventId, this.expandsString);
				Cache.set(cacheKey, this);
				this.emitEventReady();
			}
			else{
				this.url = format(EVENT_URL, this.eventId, this.expandsString);
				await this.load();
				let cacheKey = format(EVENT_ID_CACHE_KEY, this.eventId, this.expandsString);
				Cache.set(cacheKey, this);
				let tournamentData = await Fetcher.getTournamentData(parseTournamentOptions());
				this.emitEventReady();
			}
			return this.data;
		} catch(err){
			console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
			log.error('Event error: %s', err.message);
			this.emitEventError(err);
			throw err;
		}
	}

	loadData(data: Data): Data | string {
		let encoded : Data | string = this.rawEncoding == 'json' ? data as Data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
		this.data = encoded;
		return encoded;
	}

	getData() : Data {
		let decoded : Data = this.rawEncoding == 'json' ? this.data as Data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8')) as Data;
		return decoded;
	}

	// Convenience methods	
	static getEvent(eventName: string, tournamentName: string, options: EventOptions={}) : Promise<Event> {
		return new Promise(function(resolve, reject){
			try{
				let E = new Event(eventName, tournamentName, options);
				E.on('ready', function(){
					resolve(E);
				});
				E.on('error', function(e){
					log.error('getEvent error: %s', e);
					reject(e);
				});
			} catch(e){
				log.error('getEvent error: %s', e);
				reject(e);
			}
		});
	}

	static getEventById(id: number, options: EventOptions={}){
		return new Promise(function(resolve, reject){
			try{
				let E = new Event(id, undefined, options);
				E.on('ready', function(){
					resolve(E);
				});
				E.on('error', function(e){
					log.error('getEventById error: %s', e);
					reject(e);
				});
			} catch(e){
				log.error('getEventById error: %s', e);
				reject(e);
			}
		})
	}

	// Methods
	async load() : Promise<Data | string>  {
		log.debug('Event.load called');
		log.verbose('Creating Event from url: %s', this.url);
		try{
			if(!this.isCached){
				let data = await request(this.url);
				this.loadData(data);
				return data;
			}

			let cacheKey = this.id ?
				format('event::%s::%s::%s::data', this.id, this.rawEncoding, this.expandsString) : 
				format('event::%s::%s::%s::%s::data', this.tournamentId, this.eventId, this.rawEncoding, this.expandsString);
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
			log.error('Event.load error: %s', e.message);

			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = this.tournamentId ? 
					format('No Event [%s] for tournament [%s] (%s)', this.eventId, this.tournamentId, this.url) :
					format('No Event with id [%s] ( %s )', this.eventId, this.url);
				log.error(s);
			}
			
			throw e;
		}
	}

	/** BULK PULL PROMISES **/
	async getEventPhases(options: Options={}) : Promise<Array<Phase>>{
		log.debug('Event.getEventPhases called');

		options = parseOptions(options);

		try{
			log.info('Getting Phases for Event ' + this.tournamentId);
			let cacheKey = format('event::%s::%s::phases', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<Phase> = await Cache.get(cacheKey) as Array<Phase>;
				if(cached) return cached;
			}

			let phases: Array<Entity> = this.getData().entities.phase as Array<Entity>;
			let fn = async (phase: Entity) => {
				return await Phase.getPhase(phase.id);
			};
			let allPhases = await pmap(phases, fn, {concurrency: options.concurrency});

			allPhases = _.uniqBy(allPhases, 'id');
			this.phases = allPhases;
			await Cache.set(cacheKey, this.phases);
			return allPhases;
		} catch(err){
			log.error('Event.getEventPhaseGroups: ' + err);
			throw err;
		}
	}

	async getEventPhaseGroups(options: Options={}) : Promise<Array<PhaseGroup>>{
		log.debug('Event.getEventPhaseGroups called');

		// parse options
		options = parseOptions(options)

		try{
			log.info('Getting Phase Groups for Event ' + this.tournamentId);
			let cacheKey = format('event::%s::%s::groups', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<PhaseGroup> = await Cache.get(cacheKey) as Array<PhaseGroup>;
				if(cached) return cached;
			}

			let groups: Array<Entity> = this.getData().entities.groups as Array<Entity>;
			let fn = async (group: Entity) => {
				return await PhaseGroup.getPhaseGroup(group.id);
			};
			let allGroups: Array<PhaseGroup> = await pmap(groups, fn, {concurrency: options.concurrency});

			allGroups = _.uniqBy(allGroups, 'id');
			await Cache.set(cacheKey, allGroups);
			return allGroups;

		} catch(err){
			log.error('Event.getEventPhaseGroups: ' + err);
			throw err;
		}
	}

	async getSets(options: Options={}) : Promise<Array<GGSet>>{
		log.debug('Event.getSets called');
		try{
			// parse options
			options = parseOptions(options);

			let cacheKey = format('event::%s::%s::sets', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<GGSet> = await Cache.get(cacheKey) as Array<GGSet>;
				if(cached) return cached;
			}

			let phases: Array<Phase> = await this.getEventPhases(options);
			let fn = async (phase: Phase) => {
				return await phase.getSets();
			};
			let sets = await pmap(phases, fn, {concurrency: options.concurrency});

			sets = _.flatten(sets);
			if(options.isCached) await Cache.set(cacheKey, sets);
			return sets;
		} catch(e){
			log.error('Event.getSets error: %s', e);
			throw e;
		}
	}

	async getPlayers(options: Options={}) : Promise<Array<Player>>{
		log.debug('Event.getSets called');
		try{
			// parse options
			options = parseOptions(options);

			let cacheKey = format('event::%s::%s::players', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<Player> = await Cache.get(cacheKey) as Array<Player>;
				if(cached) return cached;
			}

			let phases: Array<Phase> = await this.getEventPhases(options);
			let fn = async (phase: Phase) => {
				return await phase.getPlayers();
			};
			let players: Array<Player> = await pmap(phases, fn, {concurrency: options.concurrency});

			players = _.flatten(players);
			players = _.uniqBy(players, 'id');
			if(options.isCached) await Cache.set(cacheKey, players);
			return players;
		} catch(e){
			log.error('Event.getSets error: %s', e);
			throw e;
		}
	}

	async getIncompleteSets(options: Options={}) : Promise<Array<GGSet>>{
		log.debug('Event.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options)

			let phases: Array<Phase> = await this.getEventPhases(options);
			let fn = async (phase: Phase) => {
				return await phase.getIncompleteSets(options);
			};
			let sets: Array<GGSet> = await pmap(phases, fn, {concurrency: options.concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Event.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getCompleteSets(options: Options={}) : Promise<Array<GGSet>>{
		log.debug('Event.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options);

			let phases: Array<Phase> = await this.getEventPhases(options);
			let fn = async (phase: Phase) => {
				return await phase.getCompleteSets(options);
			};
			let sets: Array<GGSet> = await pmap(phases, fn, {concurrency: options.concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Event.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getSetsXMinutesBack(minutesBack: number, options: Options={}) : Promise<Array<GGSet>> {
		log.verbose('Event.getSetsXMinutesBack called');
		try{
			// parse options
			options=parseOptions(options);

			let groups: Array<Phase> = await this.getEventPhases(options);
			let fn = async (group: Phase) => {
				return await group.getSetsXMinutesBack(minutesBack, options);
			};
			let sets: Array<GGSet> = await pmap(groups, fn, {concurrency: options.concurrency});
			sets = _.flatten(sets);
			return sets;
		} catch(e){
			log.error('Event.getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromDataEntities(prop: string) : any{
		let data = this.getData();
		if(data && data.entities && data.entities.event) {
			if (!data.entities.event[prop])
				log.error(this.nullValueString(prop));
			return data.entities.event[prop];
		}
		else{
			log.error('No data to get Tournament property Id');
			return null;
		}
	}

	getId() : number{ 
		return this.getFromDataEntities('id');
	}

	getName() : string{
		return this.getFromDataEntities('name');
	}

	getTournamentId() : number{
		return this.getFromDataEntities('tournamentId');
	}

	getSlug() : string{
		return this.getFromDataEntities('slug');
	}

	getTournamentSlug() : string{
		let slug = this.getSlug();
		let tournamentSlug = slug.substring(slug.indexOf('/') + 1, slug.indexOf('/', slug.indexOf('/') + 1));
		return tournamentSlug;
	}

	getStartTime() : Date | null {
		let startAt = this.getFromDataEntities('startAt');
		let tz = this.Tournament.getTimezone();

		if(startAt && tz){
			let time = moment.unix(startAt).tz(tz);
			return time.toDate();
		}
		else{
			log.error('Event.getStartTime: startAt and timezone properties must both be present');
			return null;
		}
	}

	getStartTimeString() : string | null {
		let startAt = this.getFromDataEntities('startAt');
		let tz = this.Tournament.getTimezone();

		if(startAt && tz){
			let time = moment.unix(startAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
			let zone = moment.tz(tz).zoneName();
			return `${time} ${zone}`;
		}
		else{
			log.error('Event.getStartTime: startAt and timezone properties must both be present');
			return null;
		}
	}

	getEndTime() : Date | null {
		let endAt = this.getFromDataEntities('endAt');
		let tz = this.Tournament.getTimezone();

		if(endAt && tz) {
			let time = moment.unix(endAt).tz(tz);
			return time.toDate();
		}
		else{
			log.error('Event.getEndTime: endAt and timezone properties must both be present');
			return null;
		}
	}

	getEndTimeString() : string | null {
		let endAt = this.getFromDataEntities('endAt');
		let tz = this.Tournament.getTimezone();

		if(endAt && tz) {
			let time = moment.unix(endAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
			let zone = moment.tz(tz).zoneName();
			return `${time} ${zone}`;
		}
		else{
			log.error('Event.getEndTime: endAt and timezone properties must both be present');
			return null;
		}
	}

	/** NULL VALUES **/
	nullValueString(prop: string) : string{
		return prop + ' not available for Event ' + this.getData().entities.event.name;
	}

	/** EVENTS **/
	emitEventReady() : void{
		this.emit('ready');
	}

	emitEventError(err: Error) : void{
		this.emit('error', err);
	}
}

Event.prototype.toString = function(){
	return 'Event: ' +
		'\nID: ' + this.getId() +
		'\nName: ' + this.getName() +
		'\nTournament: ' + this.getTournamentId() +
		'\nStart Time: ' + this.getStartTime();
};

