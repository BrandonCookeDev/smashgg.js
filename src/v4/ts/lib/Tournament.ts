
const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s'
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
const DEFAULT_ENCODING = 'json'
const DEFAULT_CONCURRENCY = 4

export namespace ITournament{
	export interface Tournament{
		id: number
		name: string
		slug: string
		startTime: Date
		endTime: Date
		timezone: string
		venue: Venue
		organizer: Organizer
		rawEncoding: string
		data: Data | string
		
		getAllPlayers(options: Options) : Promise<Array<Player>> 

		getAllSets(options: Options) : Promise<Array<GGSet>>

		getAllEvents(options: Options) : Promise<Array<Event>>

		getAllPhases(options: Options) : Promise<Array<Phase>>

		getAllPhaseGroups(options: Options) : Promise<Array<PhaseGroup>>

		getIncompleteSets(options: Options) : Promise<Array<GGSet>>
	
		getCompleteSets(options: Options) : Promise<Array<GGSet>>

		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<Array<GGSet>>

		getId() : number

		getName() : string 

		getSlug() : string

		getTimezone() : string

		getStartTime() : Date | null

		getStartTimeString() : string | null

		getEndTime() : Date | null

		getEndTimeString() : string | null

		getVenue() : Venue

		getCity() : string
		
		getState() : string
		
		getZipCode() : string

		getOrganizer() : Organizer

		getContactInfo() : string
		
		getContactEmail() : string
		
		getContactTwitter() : string
		
		getOwnerId() : number 
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
		"data": {
			"tournament": {
			  "id": number,
			  "name": string,
			  "slug": string,
			  "city": string | null,
			  "postalCode": string | null,
			  "addrState": string | null,
			  "countryCode": string | null,
			  "region": string | null,
			  "venueAddress": string | null,
			  "venueName": string | null,
			  "gettingThere": string | null,
			  "lat": number | null,
			  "lng": number | null,
			  "timezone": string | null,
			  "startAt": number | null,
			  "endAt": number | null,
			  "contactInfo": string | null,
			  "contactEmail": string | null,
			  "contactTwitter": string | null,
			  "ownerId": number | null
			}
		  },
		  "actionRecords": []
	}

	export function getDefaultData(): Data{
		return {
			"data": {
				"tournament": {
				  "id": 0,
				  "name": '',
				  "slug": '',
				  "city": '',
				  "postalCode": '',
				  "addrState": '',
				  "countryCode": '',
				  "region": '',
				  "venueAddress": '',
				  "venueName": '',
				  "gettingThere": '',
				  "lat": 0,
				  "lng": 0,
				  "timezone": '',
				  "startAt": 0,
				  "endAt": 0,
				  "contactInfo": '',
				  "contactEmail": '',
				  "contactTwitter": '',
				  "ownerId": 0
				}
			  },
			  "actionRecords": []
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
import * as tourneyQueries from './scripts/tournamentQueries'
import * as eventQueries from './scripts/eventQueries'


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

	static parse(data: Data, options: Options): Tournament{ 
		let venue = new Venue(
			data.data.tournament.venueName, data.venueAddress, data.city,
			data.data.tournament.addrState, data.countryCode, data.region, 
			data.data.tournament.postalCode, data.lat, data.lng
		)
		let organizer = new Organizer(
			data.data.tournament.ownerId, data.data.tournament.contactEmai, data.data.tournament.contactPhone,
			data.data.tournament.contactTwitter, data.data.tournament.contactInfo
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
		return T;
	}

	static async get(slug: string, options: TournamentOptions) : Promise<Tournament>{
		let cacheKey = format('tournament::%s', slug)
		let cached = await Cache.get(cacheKey)
		if(cached && options.isCached) return cached;

		let data = await NI.query(tourneyQueries.tournament, {slug: slug })
		let T = Tournament.parse(data, options);
		if(options.isCached) await Cache.set(cacheKey, T);
		return T
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
		log.info('Getting Events for ' + this.getName())

		// check cache
		let cacheKey = format('tournament::%s::events', this.name)
		if(options.isCached){
			let cached = await Cache.get(cacheKey)
			if(cached) return cached
		}

		// get and format data
		let results = await NI.query(eventQueries.event, {slug: this.name}) 
		let eventData = results.tournament.events

		// format the tournament data
		let tournamentData = results.tournament
		delete tournamentData.events

		// format the event data
		let events = eventData.map(event => {
			let data = {}
			let E = Event.parse(event)
			data.tournament = tournamentData
			data.event = event
			E.loadData(data)
			return E
		})
		await Cache.set(cacheKey, events)
		return events
	}

	async getAllPhases(options: Options={}) : Promise<Array<Phase>> {
		log.debug('Tournament.getPhases called')

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true
		let rawEncoding = options.rawEncoding

		// check the cache
		let cacheKey = format('tournament::%s::phases', this.name)
		if(isCached){
			let cached = await Cache.get(cacheKey)
			if(cached) return cached
		}

		// get and format data
		let results = await NI.query(graphQueries.tournamentPhases, {slug: this.name})
		let eventData = results.tournament.events
		let tournamentData = results.tournament
		delete tournamentData.events

		// format and create array of Phase objects
		let phases = _.flatten(eventData.map(event => {
			return event.phases.map(phase => {
				let data = {}
				let P = new Phase(phase.id, {loadData: false, rawEncoding: rawEncoding, isCached: isCached})
				data.tournament = tournamentData
				data.event = _.clone(event)
				delete data.event.phases
				data.phase = phase
				P.loadData(data)
				return P
			})
		}))
		if(isCached) await Cache.set(cacheKey, phases)
		return phases
	}

	async getAllPhaseGroups(options: Options={}) : Promise<Array<PhaseGroup>> {
		log.debug('Tournament.getPhaseGroups called')

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true
		let rawEncoding = options.rawEncoding

		// check cache
		let cacheKey = format('tournament::%s::phaseGroups', this.name)
		if(isCached){
			let cached = await Cache.get(cacheKey)
			if(cached) return cached
		}

		// get and format data
		let results = await NI.query(graphQueries.tournamentPhaseGroups, {slug: this.name})
		let eventData = results.tournament.events
		let tournamentData = results.tournament
		delete tournamentData.events

		// format and create array of PhaseGroup objects
		let phaseGroups = _.flatten(eventData.map(event => {
			return event.phaseGroups.map(phaseGroup => {
				let data = {}
				let PG = new PhaseGroup(phaseGroup.id, {loadData: false, rawEncoding: rawEncoding, isCached: isCached})
				data.tournament = tournamentData
				data.event = _.clone(event)
				delete data.event.phaseGroups
				data.phaseGroup = phaseGroup
				PG.loadData(data)
				return PG
			})
		}))
		await Cache.set(cacheKey, phaseGroups)
		return phaseGroups
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

	getId() : number {
		return this.id
	}

	getName() : string {
		return this.name
	}

	getSlug() : string {
		return this.slug
	}

	getTimezone() : string {
		return this.timezone
	}

	getStartTime() : Date | null{
		return this.startTime
	}

	getStartTimeString() : string | null{
		return `${this.getStartTime()} ${this.getTimezone()}`
	}

	getEndTime() : Date | null {
		return this.endTime
	}

	getEndTimeString() : string | null{
		return `${this.getEndTime()} ${this.getTimezone()}`
	}

	getVenue() : Venue{
		return this.venue
	}

	getCity() : string {
		return this.getVenue().getCity()
	}

	getState() : string {
		return this.getVenue().getState()
	}

	getZipCode() : string {
		return this.getVenue().getPostalCode()
	}

	getOrganizer() : Organizer{
		return this.organizer
	}

	getContactInfo() : string { 
		return this.getOrganizer().getInfo()
	}

	getContactEmail() : string {
		return this.getOrganizer().getEmail()
	}

	getContactTwitter() : string {
		return this.getOrganizer().getTwitter()
	}

	getOwnerId() : number {
		return this.getOrganizer().getId()
	}

	/**
	 * @deprecated
	 */
	//getVenueFee() : string {
	//	return this.getFromDataEntities('venueFee');
	//}

	/**
	 * @deprecated
	 */
	//getProcessingFee() : string {
	//	return this.getFromDataEntities('processingFee');
	//}

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
