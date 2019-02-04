
export namespace IEvent{
	export interface Event{
		id: number 
		name: string
		slug: string
		tournamentId: string
		tournamentName: string
		tournamentSlug: string
		data: Data | string
		rawEncoding: string
		isCached: boolean

		state: string | null
		startAt: number | null
		numEntrants: number | null
		checkInBuffer: number | null
		checkInDuration: number | null
		checkInEnabled: boolean | null
		isOnline: boolean | null
		teamNameAllowed: boolean | null
		teamManagementDeadline: number | null
	
		getEventPhases(options: Options) : Promise<Phase[]>
		getEventPhaseGroups(options: Options) : Promise<PhaseGroup[]>
		getSets(options: Options) : Promise<GGSet[]>
		getPlayers(options: Options) : Promise<Entrant[]>
		getIncompleteSets(options: Options) : Promise<GGSet[]>
		getCompleteSets(options: Options) : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<GGSet[]> 
		getFromEventEntities(prop: string) : any
		getFromTournamentEntities(prop: string) : any
		getId() : number
		getName() : string
		getSlug() : string
		getTournamentId() : number
		getTournamentName() : string
		getTournamentSlug() : string
		getStartTime() : Date | null
		getStartTimeString() : string | null
		getState() : string | null
		getNumEntrants() : number | null
		getCheckInBuffer() : number | null
		getCheckInDuration() : number | null
		getCheckInEnabled() : boolean | null
		getIsOnline() : boolean | null
		getTeamNameAllowed() : boolean | null
		getTeamManagementDeadline() : number | null
	}

	export interface Options{
		isCached?: boolean,
		rawEncoding?: string,
		expands?: Expands
	}

	export interface Expands{
		phase: boolean,
		groups: boolean 
	}

	export interface Data{
		tournament: TournamentData,
		event: EventData
	}

	export interface EventData{
		entities: {
			event: EventEntity,
			phase?: [ICommon.Entity],
			groups?: [ICommon.Entity]
		}
	}

	export interface EventEntity{
		slug: string,
		tournamentId: number,
		groups?: [Entity],
		phase?: [Entity],
		[x: string]: any
	}

	export function getDefaultData(): Data{
		return {
			tournament: ITournament.getDefaultData(),
			event: getDefaultEventData()
		}
	}

	export function getDefaultEventData(): EventData{
		return {
			entities: {
				event: {
					id: 0,
					slug: '',
					tournamentId: 0
				}
			}
		}
	}

	export function getTournamentSlug(slug: string) : string{
		return slug.substring(slug.indexOf('/') + 1, slug.indexOf('/', slug.indexOf('/') + 1));
	}


	export function getDefaultOptions(): Options {
		return {
			expands:{
				phase: true,
				groups: true
			},
			isCached: true,
			rawEncoding: 'json'
		}
	}

	export function parseOptions(options: Options) : Options {
		return{
			expands: {
				phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
				groups: (options.expands != undefined && options.expands.groups == false) ? false : true
			},
			isCached: options.isCached != undefined ? options.isCached === true : true,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}
}

import _ from 'lodash'
import moment from 'moment'
import pmap from 'p-map'
import request from 'request-promise'
import { EventEmitter } from 'events'
import { format } from 'util'

import * as Common from './util/Common'
import { Tournament, ITournament, Phase, PhaseGroup, Entrant, GGSet } from './internal'
import { getTournamentData, getEventDataById, getEventData } from './internal'
import log from './util/Logger'
import Cache from './util/Cache'
import Encoder from './util/Encoder'

const EVENT_URL = 'https://api.smash.gg/event/%s?%s'
const EVENT_SLUG_URL = 'https://api.smash.gg/%s/event/%s?%s'
const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s'
const EVENT_TOURNAMENT_CACHE_KEY = 'event::%s::%s'
const EVENT_ID_CACHE_KEY = 'event::%s::%s'
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
const DEFAULT_ENCODING = 'json'
const DEFAULT_CONCURRENCY = 4

import { ICommon } from './util/Common'

import Data = IEvent.Data
import EventData = IEvent.EventData
import EventExpands = IEvent.Expands
import EventOptions = IEvent.Options
import TournamentData = ITournament.Data
import TournamentOptions = ITournament.Options
import TournamentExpands = ITournament.Expands
import Entity = ICommon.Entity
import Options = ICommon.Options
import parseOptions = Common.parseOptions



export class Event extends EventEmitter implements IEvent.Event{

	id: number 
	name: string
	slug: string
	tournamentId: string
	tournamentName: string
	tournamentSlug: string
	data: Data | string
	rawEncoding: string
	isCached: boolean = true

	state: string | null
	startAt: number | null
	numEntrants: number | null
	checkInBuffer: number | null
	checkInDuration: number | null
	checkInEnabled: boolean | null
	isOnline: boolean | null
	teamNameAllowed: boolean | null
	teamManagementDeadline: number | null

	constructor(
		id: number ,
		name: string,
		slug: string,
		tournamentId: string,
		tournamentName: string,
		tournamentSlug: string,
		data: Data | string,
		options: EventOptions,

		state: string | null,
		startAt: number | null,
		numEntrants: number | null,
		checkInBuffer: number | null,
		checkInDuration: number | null,
		checkInEnabled: boolean | null,
		isOnline: boolean | null,
		teamNameAllowed: boolean | null,
		teamManagementDeadline: number | null
	){
		super();
		
		this.id =  id
		this.name = name
		this.slug = slug
		this.tournamentId = tournamentId 
		this.tournamentName = tournamentName
		this.tournamentSlug = tournamentSlug
		this.data = Encoder.encode(data as object, options.rawEncoding) as string | Data
		this.rawEncoding = Encoder.determineEncoding(options.rawEncoding)
		this.isCached = options.isCached != undefined ? options.isCached == true : true

		this.state = state 
		this.startAt =  startAt
		this.numEntrants =  numEntrants
		this.checkInBuffer =  checkInBuffer
		this.checkInDuration = checkInDuration
		this.checkInEnabled = checkInEnabled
		this.isOnline =  isOnline
		this.teamNameAllowed =  teamNameAllowed
		this.teamManagementDeadline = teamManagementDeadline
	}

	getData() : Data {
		let decoded : Data = this.rawEncoding === 'json' ? this.data as Data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8')) as Data;
		return decoded;
	}

	// TODO implement
	static parse(data: Data) : Event { 
		let E = new Event(0, undefined, {})
		return E
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

	static getEventById(id: number, options: EventOptions={}) : Promise<Event>{
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
	async load(options: EventOptions, tournamentOptions: TournamentOptions) : Promise<Data | string>  {
		log.debug('Event.load called');
		log.verbose('Creating Event from url: %s', this.url);
		try{
			if(!this.isCached){
				let data = await request(this.url);
				this.loadData(data);
				return data;
			}

			let cacheKey = typeof this.eventId === 'number' ?
				format('event::%s::%s::%s::data', this.eventId, this.rawEncoding, this.expandsString) : 
				format('event::%s::%s::%s::%s::data', this.tournamentId, this.eventId, this.rawEncoding, this.expandsString);
			let cached = await Cache.get(cacheKey);

			if(!cached){
				let data: Data
				let encoded: Data | string
				let eventData: EventData
				let tournamentData: TournamentData

				if(typeof this.eventId == 'number'){
					eventData = await getEventDataById(this.eventId as number, options);
					let tournamentId: string = IEvent.getTournamentSlug(eventData.entities.event.slug);
					let tournament: Tournament = await Tournament.getTournament(tournamentId, ITournament.getDefaultOptions());
					tournamentData = tournament.getData()
				}
				else if(typeof this.eventId == 'string' && this.tournamentId){
					eventData = await getEventData(this.eventId as string, this.tournamentId as string, options);
					tournamentData = await getTournamentData(this.tournamentId, tournamentOptions);
				}
				else throw new Error('Bad event or tournament id types in Event');

				data = {
					tournament: tournamentData,
					event: eventData
				}
				encoded = this.loadData(data);
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
	async getEventPhases(options: Options={}) : Promise<Phase[]>{
		log.debug('Event.getEventPhases called');

		options = parseOptions(options);

		try{
			log.info('Getting Phases for Event ' + this.tournamentId);
			let cacheKey = format('event::%s::%s::phases', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<Phase> = await Cache.get(cacheKey) as Array<Phase>;
				if(cached) return cached;
			}

			let phases: Array<Entity> = this.getData().event.entities.phase as Array<Entity>;
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

	async getEventPhaseGroups(options: Options={}) : Promise<PhaseGroup[]>{
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

			let groups: Array<Entity> = this.getData().event.entities.groups as Array<Entity>;
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

	async getSets(options: Options={}) : Promise<GGSet[]>{
		log.debug('Event.getSets called');
		try{
			// parse options
			options = parseOptions(options);

			let cacheKey = format('event::%s::%s::sets', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<GGSet> = await Cache.get(cacheKey) as Array<GGSet>;
				if(cached) return cached;
			}

			let groups: Array<PhaseGroup> = await this.getEventPhaseGroups(options);
			let fn = async (group: PhaseGroup) : Promise<GGSet[]> => {
				return await group.getSets(options);
			};
			let sets: GGSet[][] = await pmap(groups, fn, {concurrency: options.concurrency});

			let flattened: Array<GGSet> = _.flatten(sets);
			if(options.isCached) await Cache.set(cacheKey, flattened);
			return flattened;
		} catch(e){
			log.error('Event.getSets error: %s', e);
			throw e;
		}
	}

	async getPlayers(options: Options={}) : Promise<Entrant[]>{
		log.debug('Event.getSets called');
		try{
			// parse options
			options = parseOptions(options);

			let cacheKey = format('event::%s::%s::players', this.tournamentId, this.eventId);
			if(options.isCached){
				let cached: Array<Entrant> = await Cache.get(cacheKey) as Array<Entrant>;
				if(cached) return cached;
			}

			let groups: Array<PhaseGroup> = await this.getEventPhaseGroups(options);
			let fn = async (group: PhaseGroup) => {
				return await group.getPlayers(options);
			};
			let players: Entrant[][] = await pmap(groups, fn, {concurrency: options.concurrency});

			let flattened: Array<Entrant> = _.flatten(players);
			flattened = _.uniqBy(flattened, 'id');
			if(options.isCached) await Cache.set(cacheKey, flattened);
			return flattened;
		} catch(e){
			log.error('Event.getSets error: %s', e);
			throw e;
		}
	}

	

	async getTop8Sets(options: Options={}) : Promise<GGSet[]>{
		log.debug('Event.getTop8Sets called')
		try{
			options = parseOptions(options)


			let phases: Phase[] = await this.getEventPhases(options);
			let nonPools = phases.filter(phase => phase.getName().toLowerCase() !== 'pools')
			
			// if tournament has a single phase, get the top 8 sets from it
			if(phases.length === 1){
				log.verbose('Event has single phase, returning top 8 filtered list')
				let sets = await phases[0].getSets(options)
				return Common.filterForTop8Sets(sets)
			}				

			// if a Top 8 phase simply exists, grab it and return its sets
			let top8 = _.find(nonPools, phase => {
				return phase.getName().toLowerCase() === 'top 8'
			})
			if(top8) {
				log.verbose('Event has Top 8 Phase, returning all sets')
				return await top8.getSets(options)
			}

			// if we can't go off a single phase or Top 8 phase, we need to search for the 
			// last phase in the event with Top in its name and the lowest number of entrants
			log.verbose('no single phase or Top 8, finding lowest "Top" phase')
			let topRegex = new RegExp(/Top ([0-9]{2})/);
			let topPhases: Phase[] = nonPools.filter(phase => topRegex.test(phase.getName()))
			
			// if only one "Top" phase exists, conclude it's the final phase and return its top 8 sets
			if(topPhases.length === 1){
				log.verbose('single top phase found: %s', topPhases[0].getName())
				let sets = await topPhases[0].getSets(options)
				return Common.filterForTop8Sets(sets)
			}

			// otherwise go digging for the lowest entrant count in phase name and return it's top 8 sets
			let topPhaseNumbers: number[] = topPhases.map(phase => (topRegex.exec(phase.getName()) as any[])[1])
			let nextLowestTopPhaseNumber = Math.min.apply(null, topPhaseNumbers)

			let nextLowestTopPhase = _.find(topPhases, phase => {
				return phase.getName().toLowerCase() === `Top ${nextLowestTopPhaseNumber}`
			})
			if(nextLowestTopPhase){
				log.verbose('Found the next lowest Top x Phase: %s', nextLowestTopPhase.getName())
				let sets = await nextLowestTopPhase.getSets(options)
				return Common.filterForTop8Sets(sets)
			}
			
			log.warn('Could not determine where Top 8 sets lie. Phases: %s', phases.map(phase=>phase.getName()));
			return []
		} catch(e){
			log.error('Event.getTop8Sets error: %s', e);
			throw e;
		}
	}

	async getIncompleteSets(options: Options={}) : Promise<GGSet[]>{
		log.debug('Event.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options)

			let sets = await this.getSets(options);
			let filtered = GGSet.filterForIncompleteSets(sets);
			return filtered;
		} catch(e){
			log.error('Event.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getCompleteSets(options: Options={}) : Promise<GGSet[]>{
		log.debug('Event.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options);

			let sets = await this.getSets(options);
			let filtered = GGSet.filterForCompleteSets(sets);
			return filtered;
		} catch(e){
			log.error('Event.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getSetsXMinutesBack(minutesBack: number, options: Options={}) : Promise<GGSet[]> {
		log.debug('Event.getSetsXMinutesBack called');
		try{
			// parse options
			options=parseOptions(options);
			options.isCached = false;

			let sets = await this.getSets();
			let filtered = GGSet.filterForXMinutesBack(sets, minutesBack);
			return filtered;
		} catch(e){
			log.error('Event.getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromEventEntities(prop: string) : any{
		let data = this.getData();
		if(data && data.event.entities && data.event.entities.event) {
			if (!data.event.entities.event[prop])
				log.error(this.nullValueString(prop));
			return data.event.entities.event[prop];
		}
		else{
			log.error('No data to get Tournament property Id');
			return null;
		}
	}

	getFromTournamentEntities(prop: string) : any{
		let data = this.getData();
		if(data && data.tournament.entities && data.tournament.entities.tournament) {
			if (!data.tournament.entities.tournament[prop])
				log.error(this.nullValueString(prop));
			return data.tournament.entities.tournament[prop];
		}
		else{
			log.error('No data to get Tournament property Id');
			return null;
		}
	}

	getId() : number{ 
		return this.getFromEventEntities('id');
	}

	getName() : string{
		return this.getFromEventEntities('name');
	}

	getTournamentId() : number{
		return this.getFromEventEntities('tournamentId');
	}

	getTournamentName() : string {
		return this.getFromTournamentEntities('name');
	}

	getSlug() : string{
		return this.getFromEventEntities('slug');
	}

	getTournamentSlug() : string{
		let slug = this.getSlug();
		let tournamentSlug = slug.substring(slug.indexOf('/') + 1, slug.indexOf('/', slug.indexOf('/') + 1));
		return tournamentSlug;
	}

	getTimezone() : string{
		return this.getFromTournamentEntities('timezone');
	}

	getStartTime() : Date | null {
		let startAt = this.getFromEventEntities('startAt');
		let tz = this.getTimezone();

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
		let startAt = this.getFromEventEntities('startAt');
		let tz = this.getTimezone();

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
		let endAt = this.getFromEventEntities('endAt');
		let tz = this.getTimezone();

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
		let endAt = this.getFromEventEntities('endAt');
		let tz = this.getTimezone();

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

	getState() : string | null {

		return null;
	}
		
	getNumEntrants() : number | null {

		return null;
	}
	
	getCheckInBuffer() : number | null {

		return null;
	}
	
	getCheckInDuration() : number | null {

		return null;
	}
	
	getCheckInEnabled() : boolean | null {

		return null;
	}
	
	getIsOnline() : boolean | null {

		return null;
	}
	
	getTeamNameAllowed() : boolean | null {

		return null;
	}
	
	getTeamManagementDeadline() : number | null {

		return null;
	}
}

Event.prototype.toString = function(){
	return 'Event: ' +
		'\nID: ' + this.getId() +
		'\nName: ' + this.getName() +
		'\nTournament: ' + this.getTournamentId() +
		'\nStart Time: ' + this.getStartTime();
};
