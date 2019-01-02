'use strict'

let _ = require('lodash')
let log = require('winston')
let when = require('when')
let pmap = require('p-map')
let {format} = require('util')
let moment = require('moment-timezone')
let Cache = require('./util/Cache')
let NI = require('./util/NetworkInterface')
let EventEmitter = require('events')

let graphQueries = require('./scripts/graphQueries')

const EVENT_URL = 'https://api.smash.gg/event/%s?%s'
const EVENT_SLUG_URL = 'https://api.smash.gg/%s/event/%s?%s'
const EVENT_TOURNAMENT_CACHE_KEY = 'event::%s::%s::%s'
const EVENT_ID_CACHE_KEY = 'event::%s::%s'
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
const DEFAULT_ENCODING = 'json'
const DEFAULT_CONCURRENCY = 4

let Phase = require('./Phase')
let PhaseGroup = require('./PhaseGroup')
let Player = require('./Player')

class Event extends EventEmitter{

	constructor(eventId, tournamentId=undefined, options = {}){
		super()

		if(!eventId)
			throw new Error('Event Constructor: Event Name/ID cannot be null for Event')
		if(isNaN(eventId) && !tournamentId)
			throw new Error('Event Constructor: Event name must be paired with a Tournament name')

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true
		let rawEncoding = options.rawEncoding || DEFAULT_ENCODING
		let loadData = options.loadData != undefined ? options.loadData === true : true

		// set properties
		this.data = {} // if it's NaN, we have an event Name not ID number
		this.tournamentId = tournamentId
		this.isCached = isCached
		this.eventId = isNaN(parseInt(eventId)) ? eventId : parseInt(eventId)
		this.rawEncoding = LEGAL_ENCODINGS.includes(rawEncoding) ? rawEncoding : DEFAULT_ENCODING

		if(loadData)
			this.load()
	}

	/**
	 * loadData
	 * 
	 * takes data to be loaded into this.data encodes it with the 
	 * value in this.rawEncoding, and returns that encoded value
	 * 
	 * 
	 * @param  {object} data
	 * @returns {object} the encoded data injected into this.data
	 */
	loadData(data){
		let encoded = this.rawEncoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding)
		this.data = encoded
		return encoded
	}

	
	/**
	 * getData
	 * 
	 * gets the value in this.data, and decodes it using the value
	 * in this.rawEncoding
	 * @returns {object} the decoded data from this.data 
	 */
	getData(){
		let decoded = this.rawEncoding == 'json' ? this.data : JSON.parse(new Buffer(this.data, this.rawEncoding).toString('utf8'))
		return decoded
	}

	// Convenience methods	
	
	/**
	 * getEvent
	 * 
	 * convenience method that returns an Event object
	 * for the corresponding event slug and tournament slug
	 * 
	 * @param  {string} eventName
	 * @param  {string} tournamentName
	 * @param  {object} options={}
	 * @returns {promise} resolves an Event object
	 */
	static getEvent(eventName, tournamentName, options={}){
		let deferred = when.defer()
		try{
			let E = new Event(eventName, tournamentName, options)
			E.on('ready', function(){
				deferred.resolve(E)
			})
			E.on('error', function(e){
				log.error('getEvent error: %s', e)
				deferred.reject(e)
			})
		} catch(e){
			log.error('getEvent error: %s', e)
			deferred.reject(e)
		}
		return deferred.promise
	}
	/**
	 * getEventById
	 * 
	 * convenience method that returns an Event object for the 
	 * corresponding id number
	 * 
	 * @param  {int} id
	 * @param  {object} options={}
	 * @returns {promise} resolves an Event object
	 */
	static getEventById(id, options={}){
		let deferred = when.defer()
		try{
			if(isNaN(id)){
				deferred.reject(new Error('ID must be an integer for this method'))
				return deferred.promise
			}

			let E = new Event(id, undefined, options)
			E.on('ready', function(){
				deferred.resolve(E)
			})
			E.on('error', function(e){
				log.error('getEventById error: %s', e)
				deferred.reject(e)
			})
		} catch(e){
			log.error('getEventById error: %s', e)
			deferred.reject(e)
		}
		return deferred.promise
	}

	// Methods
	/**
	 * get
	 * 
	 * get the data for the Event and corresponding Tournament object
	 * 
	 * @returns {promise} resolves the data retrieved from smashgg
	 */
	async get(){
		let data = {}, resp, tournamentData, eventData

		// conditionally handle Event ID number vs Event-Tournament slugs
		let isIdANumber = !(isNaN(this.eventId))
		if(isIdANumber){
			resp = await NI.query(graphQueries.eventById, {'id': this.eventId})
			if(!resp.event) throw new Error(`Event with ID ${this.eventId} does not exist!`)

			tournamentData = resp.event.tournament
			delete resp.event.tournament
			eventData = resp.event
		}
		else{
			resp = await NI.query(graphQueries.event, {'slug': this.tournamentId})
			if(!resp.tournament) throw new Error(`Tournament with slug ${this.tournamentId} does not exist!`)

			eventData = resp.tournament.events.filter(event => new RegExp(this.eventId).test(event.slug))
			if(eventData.length <=0 ) throw new Error(`Tournament ${this.tournamentId} does not have event with name ${this.eventId}!`)
			else eventData = eventData[0]

			delete resp.tournament.events
			tournamentData = resp.tournament
		}

		data.tournament = tournamentData
		data.event = eventData
		return data
	}

	/**
	 * load
	 * 
	 * get data from smashgg and load it into the current Event object's data property
	 * 
	 * @returns {promise} resolves the current Event object's data property
	 */
	async load(){
		log.debug('Event.load called')
		log.verbose('Creating Event from url: %s', this.url)
		try{
			// If we don't want cached data, get most recent
			if(!this.isCached){
				let data = await this.get()
				this.loadData(data)
				this.emitEventReady()
				return data
			}

			// format cache key and check the cache
			let cacheKey = this.id ?
				format('event::%s::%s::%s::data', this.id, this.rawEncoding, this.expandsString) : 
				format('event::%s::%s::%s::%s::data', this.tournamentId, this.eventId, this.rawEncoding, this.expandsString)
			let cached = await Cache.get(cacheKey)

			// get the data and cache it if it isn't already
			let data
			if(!cached){
				data = await this.get()
				this.loadData(data)
			}
			else this.data = cached
			
			await Cache.set(cacheKey, this.data)
			this.emitEventReady()

			return this.data
		} catch(e){
			log.error('Event.load error: %s', e.message)
			this.emitEventError(e)

			//Unsure if this is needed anymore...
			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = this.tournamentId ? 
					format('No Event [%s] for tournament [%s] (%s)', this.eventId, this.tournamentId, this.url) :
					format('No Event with id [%s] ( %s )', this.eventId, this.url)
				log.error(s)
			}
			
			throw e
		}
	}

	/** AGGREGATION PROMISES **/

	
	/**
	 * getEventPhases
	 * 
	 * aggregtes the phases that belong to this Event
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves array of Phase objects
	 */
	async getEventPhases(options={}){
		log.debug('Event.getEventPhases called')

		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true
		let concurrency = options.concurrency || DEFAULT_CONCURRENCY

		try{
			log.info('Getting Phases for Event ' + this.tournamentId)
			let cacheKey = format('event::%s::%s::phases', this.tournamentId, this.eventId)
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey)
				if(cached){
					this.phases = cached
					return cached
				}
			}

			let phases = this.getData().entities.phase
			let fn = async (phase) => {
				return await Phase.getPhase(phase.id)
			}
			let allPhases = await pmap(phases, fn, {concurrency: concurrency})

			allPhases = _.uniqBy(allPhases, 'id')
			this.phases = allPhases
			await Cache.set(cacheKey, this.phases)
			return allPhases
		} catch(err){
			log.error('Event.getEventPhaseGroups: ' + err)
			throw err
		}
	}

	
	/**
	 * getEventPhaseGroups
	 * 
	 * aggregates all the PhaseGroups that belong to this Event
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of PhaseGroup objects
	 */
	async getEventPhaseGroups(options={}){
		log.debug('Event.getEventPhaseGroups called')

		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true
		let concurrency = options.concurrency || DEFAULT_CONCURRENCY

		try{
			log.info('Getting Phase Groups for Event ' + this.tournamentId)
			let cacheKey = format('event::%s::%s::groups', this.tournamentId, this.eventId)
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey)
				if(cached){
					this.phaseGroups = cached
					return cached
				}
			}

			let groups = this.getData().entities.groups
			let fn = async (group) => {
				return await PhaseGroup.getPhaseGroup(group.id)
			}
			let allGroups = await pmap(groups, fn, {concurrency: concurrency})

			allGroups = _.uniqBy(allGroups, 'id')
			this.phaseGroups = allGroups
			await Cache.set(cacheKey, this.phaseGroups)
			return allGroups

		} catch(err){
			log.error('Event.getEventPhaseGroups: ' + err)
			throw err
		}
	}

	
	/**
	 * getSets
	 * 
	 * aggregates all the Sets that occurred in this Event
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */
	async getSets(options={}){
		log.debug('Event.getSets called')
		try{
			// parse options
			let fromCacheTF = options.isCached != undefined ? options.isCached === true : true
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY

			let cacheKey = format('event::%s::%s::sets', this.tournamentId, this.eventId)
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey)
				if(cached) return cached
			}

			let phases = await this.getEventPhases(options)
			let fn = async (phase) => {
				return await phase.getSets()
			}
			let sets = await pmap(phases, fn, {concurrency: concurrency})

			sets = _.flatten(sets)
			if(fromCacheTF) await Cache.set(cacheKey, sets)
			return sets
		} catch(e){
			log.error('Event.getSets error: %s', e)
			throw e
		}
	}

	
	/**
	 * getPlayers
	 * 
	 * aggregates all the players that participated in this Event
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Player objects
	 */
	async getPlayers(options={}){
		log.debug('Event.getSets called')
		try{
			// parse options
			let fromCacheTF = options.isCached != undefined ? options.isCached === true : true

			let cacheKey = format('event::%s::%s::players', this.tournamentId, this.eventId)
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey)
				if(cached) return cached
			}

			let data = await NI.query(graphQueries.eventPlayers, {
				slug: this.getTournamentSlug(),
				eventIds: [this.getId()]
			})
			return data.tournament.participants.nodes.map(player => new Player(
				player.playerId,
				player.gamerTag,
				null,
				null,
				null,
				player.prefix,
				player.id,
				player
			))
		} catch(e){
			log.error('Event.getSets error: %s', e)
			throw e
		}
	}

	/**
	 * getIncompleteSets
	 * 
	 * gets all the sets in an event and filters out 
	 * those that have been completed, and returns a promise
	 * resolving the resulting Set objects
	 * 
	 * @param  {} options={}
	 * @return {promise} resolves an array of Set objects
	 */
	async getIncompleteSets(options={}){
		log.debug('Event.getIncompleteSets called')
		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY

			let phases = await this.getEventPhases(options)
			let fn = async (phase) => {
				return await phase.getIncompleteSets(options)
			}
			let sets = await pmap(phases, fn, {concurrency: concurrency})
			sets = _.flatten(sets)
			return sets
		} catch(e){
			log.error('Event.getIncompleteSets error: %s', e)
			throw e
		}
	}

	/**
	 * getCompletedSets
	 * 
	 * gets all the sets in an event and filters out 
	 * those that have not been completed, and returns a promise
	 * resolving the resulting Set objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */	
	async getCompleteSets(options={}){
		log.debug('Event.getIncompleteSets called')
		try{
			//parse options
			//let isCached = options.isCached != undefined ? options.isCached == true : true
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY

			let phases = await this.getEventPhases(options)
			let fn = async (phase) => {
				return await phase.getCompleteSets(options)
			}
			let sets = await pmap(phases, fn, {concurrency: concurrency})
			sets = _.flatten(sets)
			return sets
		} catch(e){
			log.error('Event.getIncompleteSets error: %s', e)
			throw e
		}
	}

	/**
	 * getSetsXMinuesBack
	 * 
	 * gets all the sets in an event and filters out 
	 * those that have not been completed but are within the 
	 * minutesBack threshold, and returns a promise resolving 
	 * the resulting Set objects
	 * 
	 * @param  {int} minutesBack
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */
	async getSetsXMinutesBack(minutesBack, options={}){
		log.verbose('Event.getSetsXMinutesBack called')
		try{
			// parse options
			let concurrency = options.concurrency || DEFAULT_CONCURRENCY
			options.isCached = false

			let groups = await this.getEventPhases(options)
			let fn = async (group) => {
				return await group.getSetsXMinutesBack(minutesBack, options)
			}
			let sets = await pmap(groups, fn, {concurrency: concurrency})
			sets = _.flatten(sets)
			return sets
		} catch(e){
			log.error('Event.getSetsXMinutesBack error: %s', e)
			throw e
		}
	}

	/** SIMPLE GETTERS **/

	
	/**
	 * getFromTournamentData
	 * 
	 * returns the requested property located in 
	 * the tournament subobject
	 * 
	 * @param  {string} prop
	 * @returns value located in the tournament subobject
	 */
	getFromTournamentData(prop){
		let data = this.getData()
		if(data && data.tournament) {
			if (!data.tournament[prop])
				log.error(this.nullValueString(prop))
			return data.tournament[prop]
		}
		else{
			log.error('No data to get Tournament property Id')
			return null
		}
	}

	
	/**
	 * getFromEventData
	 * 
	 * 
	 * 
	 * @param  {string} prop
	 * @returns value in the event subobject
	 */
	getFromEventData(prop){
		let data = this.getData()
		if(data && data.event) {
			if (!data.event[prop])
				log.error(this.nullValueString(prop))
			return data.event[prop]
		}
		else{
			log.error('No data to get Tournament property Id')
			return null
		}
	}

	getId(){ 
		return this.getFromEventData('id')
	}

	getName(){
		return this.getFromEventData('name')
	}

	getSlug(){
		return this.getFromEventData('slug')
	}

	getTournamentId(){
		return this.getFromTournamentData('id')
	}

	getTournamentName(){
		return this.getFromTournamentData('name')
	}

	getTournamentSlug(){
		return this.getFromTournamentData('slug')
	}

	getTimezone(){
		return this.getFromTournamentData('timezone')
	}

	getStartTime(){
		let startAt = this.getFromEventData('startAt')
		let tz = this.getFromTournamentData('timezone')

		if(startAt && tz){
			let time = moment.unix(startAt).tz(tz)
			return time.toDate()
		}
		else{
			log.error('Event.getStartTime: startAt and timezone properties must both be present')
			return null
		}
	}

	getStartTimeString(){
		let startAt = this.getFromEventData('startAt')
		let tz = this.getFromTournamentData('timezone')

		if(startAt && tz){
			let time = moment.unix(startAt).tz(tz).format('MM-DD-YYYY HH:mm:ss')
			let zone = moment.tz(tz).zoneName()
			return `${time} ${zone}`
		}
		else{
			log.error('Event.getStartTime: startAt and timezone properties must both be present')
			return null
		}
	}

	getEndTime(){
		let endAt = this.getFromEventData('endAt')
		let tz = this.getFromTournamentData('timezone')

		if(endAt && tz) {
			let time = moment.unix(endAt).tz(tz)
			return time.toDate()
		}
		else{
			log.error('Event.getEndTime: endAt and timezone properties must both be present')
			return null
		}
	}

	getEndTimeString(){
		let endAt = this.getFromEventData('endAt')
		let tz = this.getFromTournamentData('timezone')

		if(endAt && tz) {
			let time = moment.unix(endAt).tz(tz).format('MM-DD-YYYY HH:mm:ss')
			let zone = moment.tz(tz).zoneName()
			return `${time} ${zone}`
		}
		else{
			log.error('Event.getEndTime: endAt and timezone properties must both be present')
			return null
		}
	}

	/** NULL VALUES **/
	nullValueString(prop){
		return prop + ' not available for Event ' + this.getData().entities.event.name
	}

	/** EVENTS **/
	emitEventReady(){
		this.emit('ready')
	}

	emitEventError(err){
		this.emit('error', err)
	}
}

Event.prototype.toString = function(){
	return 'Event: ' +
		'\nID: ' + this.getId() +
		'\nName: ' + this.getName() +
		'\nTournament: ' + this.getTournamentId() +
		'\nStart Time: ' + this.getStartTime()
}

module.exports = Event
