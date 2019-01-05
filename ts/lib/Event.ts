import _ from 'lodash'
import moment from 'moment'
import log from 'winston'
import pmap from 'p-map'
import request from 'request-promise'
import { EventEmitter } from 'events'
import { format } from 'util'

import Cache from './util/Cache'
import Phase from './Phase'
import PhaseGroup from './PhaseGroup'
import Tournament from './Tournament'
import GGSet from './GGSet'
import Player from './Player'
import Encoder from './util/Encoder'

const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const EVENT_SLUG_URL = 'https://api.smash.gg/%s/event/%s?%s';
const EVENT_TOURNAMENT_CACHE_KEY = 'event::%s::%s::%s';
const EVENT_ID_CACHE_KEY = 'event::%s::%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';
const DEFAULT_CONCURRENCY = 4;

declare namespace Event{
	interface Options{
		isCached?: boolean,
		concurrency?: number,
		rawEncoding?: string
	}

	interface EventOptions{
		isCached?: boolean,
		rawEncoding?: string,
		expands?: Expands
	}

	interface Expands{
		phase: boolean,
		groups: boolean 
	}

	interface Data{
		[x: string]: any
	}

	interface Entity{
		id: number,
		[x: string]: any
	}

	interface TExpands{
		event: boolean,
		phase: boolean,
		groups: boolean,
		stations: boolean
	}

	interface Event{

	}
}

import Data = Event.Data;
import Entity = Event.Entity;
import Options = Event.Options;
import TExpands = Event.TExpands;
import EventExpands = Event.Expands;
import EventOptions = Event.EventOptions;

function parseTournamentOptions(options: EventOptions) : EventOptions {
	return {
		expands: {
			phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
			groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
		},
		isCached: options.isCached != undefined ? options.isCached === true : true,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

function parseOptions(options: Options = {}) : Options{
	return{
		isCached: options.isCached != undefined ? options.isCached === true : true,
		concurrency: options.concurrency || DEFAULT_CONCURRENCY,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding) 
	}
}

export default class Event extends EventEmitter implements Event.Event{

	id: number = 0
	url: string = ''
	data: object | string = {}
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
		this.data = {};// if it's NaN, we have an event Name not ID number
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

	async loadEventData(): Promise<string | object>{
		try{
			if(typeof this.eventId === 'string' && this.tournamentId){
				let T: Tournament = await Tournament.getTournament(this.tournamentId);

				this.tournamentSlug = T.getSlug();
				this.url = format(EVENT_SLUG_URL, this.tournamentSlug, this.eventId, this.expandsString);
				await this.load();
			
				let cacheKey = format(EVENT_TOURNAMENT_CACHE_KEY, this.tournamentId, this.eventId, this.expandsString);
				Cache.set(cacheKey, this);
				this.emitEventReady();
			}
			else{
				this.url = format(EVENT_URL, this.eventId, this.expandsString);
				await this.load();
				let cacheKey = format(EVENT_ID_CACHE_KEY,this.eventId, this.expandsString);
				Cache.set(cacheKey, this);
				await this.loadTournamentData();
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

	loadData(data: object): object | string {
		let encoded : object | string = this.rawEncoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
		this.data = encoded;
		return encoded;
	}

	getData() : Data {
		let decoded : object= this.rawEncoding == 'json' ? this.data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8'));
		return decoded;
	}

	// Convenience methods	
	static getEvent(eventName: string, tournamentName: string, options: EventOptions={}){
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
	async load(){
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
	
	async loadTournamentData(expands: TExpands, isCached: boolean = true) : Promise<boolean>{
		log.debug('loadTournamentData called');
		try {
			let Tournament : Tournament = require('./Tournament');
			let slug = this.getTournamentSlug();
			this.Tournament = await Tournament.getTournament(slug, expands, isCached);
			return true;
		} catch(e){
			log.error('loadTournamentData error: %s', e);
			throw e;
		}
	}

	/** BULK PULL PROMISES **/
	async getEventPhases(options: Options={}) : Promise<Array<Phase>>{
		log.debug('Event.getEventPhases called');

		options = parseOptions();

		try{
			log.info('Getting Phases for Event ' + this.tournamentId);
			let cacheKey = format('event::%s::%s::phases', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<Phase> = await Cache.get(cacheKey) as Array<Phase>;
				if(cached) return cached;
			}

			let phases: Array<Entity> = this.getData().entities.phase;
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

			let groups: Array<Entity> = this.getData().entities.groups;
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
	getFromDataEntities(prop: string){
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

	getId(){ 
		return this.getFromDataEntities('id');
	}

	getName(){
		return this.getFromDataEntities('name');
	}

	getTournamentId(){
		return this.getFromDataEntities('tournamentId');
	}

	getSlug(){
		return this.getFromDataEntities('slug');
	}

	getTournamentSlug(){
		let slug = this.getSlug();
		let tournamentSlug = slug.substring(slug.indexOf('/') + 1, slug.indexOf('/', slug.indexOf('/') + 1));
		return tournamentSlug;
	}

	getStartTime(){
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

	getStartTimeString(){
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

	getEndTime(){
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

	getEndTimeString(){
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
	nullValueString(prop: string){
		return prop + ' not available for Event ' + this.getData().entities.event.name;
	}

	/** EVENTS **/
	emitEventReady(){
		this.emit('ready');
	}

	emitEventError(err: Error){
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

