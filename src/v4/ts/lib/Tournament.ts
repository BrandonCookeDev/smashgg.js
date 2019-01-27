
export namespace ITournament{
	export interface Tournament{
		id: number
		name: string
		slug: string
		startTime: Date
		endTime: Date
		data: Data | string

		getAllPlayers(options: Options) : Promise<Array<Player>> 

		getAllSets(options: Options) : Promise<Array<GGSet>>

		getAllEvents(options: Options) : Promise<Array<Event>>

		getIncompleteSets(options: Options) : Promise<Array<GGSet>>
	
		getCompleteSets(options: Options) : Promise<Array<GGSet>>

		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<Array<GGSet>>

		getFromDataEntities(prop: string) : any

		getId() : number

		getName() : string 

		getSlug() : string

		getTimezone() : string

		getStartTime() : Date | null

		getStartTimeString() : string | null

		getEndTime() : Date | null

		getEndTimeString() : string | null

		getWhenRegistrationCloses() : Date | null

		getWhenRegistrationClosesString() : string | null

		getCity() : string
		
		getState() : string
		
		getZipCode() : string
		
		getContactEmail() : string
		
		getContactTwitter() : string
		
		getOwnerId() : string 

		getVenueFee() : string
		
		getProcessingFee() : string 
		
		nullValueString(prop: string) : string
		
		emitTournamentReady() : void
		
		emitTournamentError(err: Error) : void
	}

	export interface Options{
		expands?: Expands, 
		isCached?: boolean, 
		rawEncoding?: string
	}

	export interface Expands{
		event: boolean,
		phase: boolean,
		groups: boolean,
		stations: boolean
	}

	export interface Data{
		tournament: Entity
		event?: [Entity],
		phase?: [Entity],
		groups?: [Entity],
		stations?: {
			[x: string]: any
		},
		[x: string]: any
	}

	export function getDefaultData(): Data{
		return {
			tournament:{ 
				id: 0
			}
		}
	}

	export function getDefaultExpands(): Expands{
		return {
			event: true,
			phase: true,
			groups: true,
			stations: true
		}
	}

	export function getDefaultOptions(): Options{
		return {
			expands:{
				event: true,
				phase: true,
				groups: true,
				stations: true
			},
			isCached: true,
			rawEncoding: 'json'
		}
	}

	export function parseOptions(options: Options){
		return {
			expands: {
				event: (options.expands != undefined && options.expands.event == false) ? false : true,
				phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
				groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
				stations: (options.expands != undefined && options.expands.stations == false) ? false : true
			},
			isCached: options.isCached != undefined ? options.isCached === true : true,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}
}

import _ from 'lodash'
import moment from 'moment-timezone'

import pmap from 'p-map'
import request from 'request-promise'

import { format } from 'util'
import { EventEmitter } from 'events'

import * as Common from './util/Common'
import Cache from './util/Cache'
import log from './util/Logger'
import { Event, Phase, PhaseGroup, Player, GGSet, Organizer, Venue } from './internal'

import Encoder from './util/Encoder'
// import Fetcher from './util/EntityFetcher'
import NI from './util/NetworkInterface'
import * as queries from './scripts/tournamentQueries'

const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s'
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
const DEFAULT_ENCODING = 'json'
const DEFAULT_CONCURRENCY = 4

import { ICommon } from './util/Common'

import Entity = ICommon.Entity
import Options = ICommon.Options
import Data = ITournament.Data
import TournamentOptions = ITournament.Options
import TournamentExpands = ITournament.Expands
import parseOptions = Common.parseOptions

function parseTournamentOptions(options: TournamentOptions) : TournamentOptions {
	return {
		expands: {
			event: (options.expands != undefined && options.expands.event == false) ? false : true,
			phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
			groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
			stations: (options.expands != undefined && options.expands.stations == false) ? false : true
		},
		isCached: options.isCached != undefined ? options.isCached === true : true,
		rawEncoding: Encoder.determineEncoding(options.rawEncoding)
	}
}

export class Tournament extends EventEmitter implements ITournament.Tournament{

	id: number
	name: string
	slug: string
	startTime: Date
	endTime: Date
	timezone: string
	venue: Venue
	organizer: Organizer
	rawEncoding: string = DEFAULT_ENCODING
	data: Data | string

	constructor(id: number, name: string, slug: string,
			startTime: Date, endTime: Date, timezone: string, 
			venue: Venue, organizer: Organizer,
			rawEncoding: string, data: Data | string){
		super();

		this.id = id
		this.name = name
		this.slug = slug
		this.startTime = startTime
		this.endTime = endTime
		this.timezone = timezone
		this.venue = venue
		this.organizer = organizer
		this.rawEncoding = rawEncoding
		this.data = data
	}
	
	static async getTournament(slug: string, options: TournamentOptions={}) : Promise<Tournament> {
		return await Tournament.get(slug, options)
	}

	static async get(slug: string, options: TournamentOptions) : Promise<Tournament>{
		let cacheKey = format('tournament::%s', slug)
		let cached = await Cache.get(cacheKey)
		if(cached && options.isCached) return cached;

		let data = await NI.query(queries.tournament, {slug: slug })
		let venue = new Venue(
			data.venueName, data.venueAddress, data.city,
			data.addrState, data.countryCode, data.region, 
			data.postalCode, data.lat, data.lng
		)
		let organizer = new Organizer(
			data.ownerId, data.contactEmai, data.contactPhone,
			data.contactTwitter, data.contactInfo
		)

		let startTime = new Date(0)
		let endTime = new Date(0)
		startTime.setUTCSeconds(data.startAt)
		endTime.setUTCSeconds(data.endAt)


		let encoding = options.rawEncoding || DEFAULT_ENCODING
		let encoded = Encoder.encode(data, encoding) as Data | string

		let T = new Tournament(
			data.id, data.name, data.slug,
			startTime, endTime, data.timezone, 
			venue, organizer, encoding, encoded
		)
		if(options.isCached) await Cache.set(cacheKey, T);
		return T;
	}

	getData() : Data{
		return Encoder.decode(this.data as object | string, this.rawEncoding) as Data
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
				let cached: Array<Player> = await Cache.get(cacheKey) as Array<Player>;
				if(cached) return cached;
			}
			
			let groups: Array<Entity> = this.getData().entities.groups;
			let fn = async (group: Entity) : Promise<Array<Player>> => {
				let PG: PhaseGroup = await PhaseGroup.getPhaseGroup(group.id);
				return await PG.getPlayers();
			};
			let allPlayers: Player[][] = await pmap(groups, fn, {concurrency: options.concurrency});

			let flattened: Player[] = _.flatten(allPlayers);
			flattened = _.uniqBy(flattened, 'id');
			
			await Cache.set(cacheKey, flattened);
			return flattened;

		}catch(err){
			log.error('Tournament.getAllPlayers: ' + err);
			throw err;
		}
	}

	async getAllSets(options: Options={}) : Promise<Array<GGSet>> {
		log.debug('Tournament.getAllSets called');

		// parse options
		options = parseOptions(options)

		try{
			log.info('Gettings sets for ' + this.getName());
			let cacheKey: string = format('tournament::%s::sets', this.name);
			if(options.isCached){
				let cached: Array<GGSet> = await Cache.get(cacheKey) as Array<GGSet>;
				if(cached) return cached;

			}

			let groups: Array<Entity> = this.getData().entities.groups;
			let fn = async (group: Entity) : Promise<Array<GGSet>> => {
				let PG: PhaseGroup = await PhaseGroup.getPhaseGroup(group.id);
				return await PG.getSets();
			};
			let allSets: GGSet[][] = await pmap(groups, fn, {concurrency: options.concurrency});

			let flattened: GGSet[] = _.flatten(allSets);
			flattened = _.uniqBy(flattened, 'id');

			await Cache.set(cacheKey, flattened);
			return flattened;


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
				let cached: Array<Event> = await Cache.get(cacheKey) as Array<Event>;
				if(cached) return cached
			}

			let events: [Entity] = this.getData().entities.event;
			let fn = async (event: Entity) : Promise<Event> => {
				let eventId = event.id;
				return await Event.getEventById(eventId);
			};
			let allEvents: Event[] = await pmap(events, fn, {concurrency: options.concurrency});

			await Cache.set(cacheKey, allEvents);
			return allEvents;

		} catch(err) {
			log.error('Tournament.getAllEvents: ' + err);
			throw err;
		}
	}

	async getIncompleteSets(options: Options={}) : Promise<Array<GGSet>> {
		log.debug('Tournament.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options);

			let sets = await this.getAllSets(options);
			let complete = GGSet.filterForIncompleteSets(sets);
			return complete;
		} catch(e){
			log.error('Tournament.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getCompleteSets(options: Options={}) : Promise<Array<GGSet>> {
		log.debug('Tournament.getIncompleteSets called');
		try{
			//parse options
			options = parseOptions(options)

			let sets = await this.getAllSets(options)
			let incomplete = GGSet.filterForCompleteSets(sets)
			return incomplete;
		} catch(e){
			log.error('Tournament.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getSetsXMinutesBack(minutesBack: number, options: Options={}) : Promise<Array<GGSet>> {
		log.debug('Tournament.getSetsXMinutesBack called');
		try{
			let sets = await this.getAllSets()
			let filtered = GGSet.filterForXMinutesBack(sets, minutesBack)			
			return filtered;
		} catch(e){
			log.error('Tournament.getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromDataEntities(prop: string){
		let data: Data = this.getData();
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

	getStartTime() : Date | null{
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

	getStartTimeString() : string | null{
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

	getEndTime() : Date | null {
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

	getEndTimeString() : string | null{
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
	nullValueString(prop: string) : string{
		return prop + ' not available for tournament ' + this.getData().entities.tournament.name;
	}

	/** EVENTS **/
	emitTournamentReady(){
		this.emit('ready');
	}

	emitTournamentError(err: Error){
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
