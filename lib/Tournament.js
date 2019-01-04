'use strict'
require('colors')

let _ = require('lodash')
let log = require('winston')
let when = require('when')
let {format} = require('util')
let moment = require('moment-timezone')

let Cache = require('./util/Cache')
let EventEmitter = require('events')
let NI = require('./util/NetworkInterface')
let graphQueries = require('./scripts/graphQueries')

let Player = require('./Player')
let Event = require('./Event')
let Phase = require('./Phase')
let PhaseGroup = require('./PhaseGroup')
let Match = require('./Set')

const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
const DEFAULT_ENCODING = 'json'
const NO_LONGER_SUPPORTED_ERROR = 'No longer supported in Tournament object. Downgrade to smashgg.js version 2 to retrieve this property'

class Tournament extends EventEmitter{

	constructor(tournamentId, options={}){
		super()

		if(!tournamentId)
			throw new Error('Tournament Name cannot be null')
		else if(!isNaN(tournamentId))
			throw new Error('Due to Smashgg limitations, currently Tournaments may only be retrieved by tournament name (slug)')

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true
		let rawEncoding = options.rawEncoding || DEFAULT_ENCODING
		let loadData = options.loadData != undefined ? options.loadData === true : true

		// set properties
		this.data = {}
		this.name = isNaN(tournamentId) ? tournamentId : parseInt(tournamentId)
		this.isCached = isCached
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

	/**  CONVENIENCE METHODS **/

	
	/**
	 * getTournament
	 * 
	 * takes a tournament slug and creates a new Tournament object.
	 * when that object is ready, returns a Promise resolving the 
	 * Tournament object.
	 * 
	 * @param  {} tournamentName
	 * @param  {} options={}
	 * @returns {promise} resolves the intended Tournament object
	 */
	static getTournament(tournamentName, options={}){
		let deferred = when.defer()
		try{
			let T = new Tournament(tournamentName, options)
			T.on('ready', function(){
				deferred.resolve(T)
			})
			T.on('error', function(e){
				log.error('getTournament error: %s', e)
				deferred.reject(e)
			})
		} catch(e){
			log.error('getTournament error: %s', e)
			deferred.reject(e)
		}
		return deferred.promise
	}

	
	/**
	 * load
	 * 
	 * get data from smashgg and load it into the current Tournament 
	 * object's data property
	 * 
	 * @returns {object} the current Tournament object's data property
	 */
	async load(){
		log.debug('Tournament.load called')
		log.verbose('Creating Tournament from url: %s', this.url)
		try{
			if(!this.isCached)
				return this.data = JSON.parse(await await NI.query(graphQueries.tournament, {'slug': this.name}))

			let cacheKey = format('tournament::%s::%s::%s::data', this.name, this.rawEncoding, this.expandsString)
			let cached = await Cache.get(cacheKey)

			if(!cached){
				let data = await NI.query(graphQueries.tournament, {'slug': this.name})
				this.loadData(data)
			}
			else {
				this.data = cached
			}

			await Cache.set(cacheKey, this)
			this.emitTournamentReady()
			return this.data
		} catch(e){
			console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')')
			log.error('Tournament.load error: %s', e.message)
			this.emitTournamentError(e)

			// unsure if this is needed anymore...
			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = format('No Tournament with id/name [%s] ( %s )', this.tournamentId, this.url)
				log.error(s)
			}

			throw e
		}
	}

	/** AGGREGATIONS **/
	
	/**
	 * getAllPlayers
	 * 
	 * aggregates all the players who participated in a Tournament
	 * and returns a Promise resolving said Player object
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Player objects
	 */
	async getAllPlayers(options={}){
		log.debug('Tournament.getAllPlayers called')

		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true

		try{
			log.info('Gettings players for ' + this.name)

			// check cache
			let cacheKey = format('tournament::%s::players', this.name)
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey)
				if(cached) return cached
			}

			// get player data
			let data = await NI.query(graphQueries.tournamentPlayers, {slug: this.name})
			let results = data.tournament.participants.nodes
			let players = results.map(player => new Player(
				player.playerId,
				player.gamerTag,
				null,
				null,
				null,
				player.prefix,
				player.id,
				player
			))
			await Cache.set(cacheKey, players)
			return players
		}catch(err){
			log.error('Tournament.getAllPlayers: ' + err)
			throw err
		}
	}

	
	/**
	 * getAllEvents
	 * 
	 * aggregates all events in a tournament and returns an array of Event objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves array of Event objects
	 */
	async getAllEvents(options={}){
		log.debug('Tournament.getAllEvents called')

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true
		let rawEncoding = options.rawEncoding

		try{
			log.info('Getting Events for ' + this.getName())

			// check cache
			let cacheKey = format('tournament::%s::events', this.name)
			if(isCached){
				let cached = await Cache.get(cacheKey)
				if(cached) return cached
			}

			// get and format data
			let results = await NI.query(graphQueries.event, {slug: this.name})
			let eventData = results.tournament.events

			// format the tournament data
			let tournamentData = results.tournament
			delete tournamentData.events

			// format the event data
			let events = eventData.map(event => {
				let data = {}
				let E = new Event(event.slug, tournamentData.name, {loadData: false, rawEncoding: rawEncoding, isCached: isCached})
				data.tournament = tournamentData
				data.event = event
				E.loadData(data)
				return E
			})
			await Cache.set(cacheKey, events)
			return events
		} catch(err) {
			log.error('Tournament.getAllEvents: ' + err)
			throw err
		}
	}

	
	/**
	 * getPhases
	 * 
	 * aggregates all the phases for a Tournament in
	 * an array of Phase objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Phase object
	 */
	async getPhases(options={}){
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

	
	/**
	 * getPhaseGroups
	 * 
	 * aggreagtes all the phase groups for a Tournament in
	 * an array of PhaseGroup objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of PhaseGroup objects
	 */
	async getPhaseGroups(options={}){
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

	/**
	 * getAllSetsWithoutEntrants
	 * 
	 * aggreagates all the sets from a Tournament
	 * in an array of Set objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */
	async getAllSets(options={}){
		log.debug('Tournament.getAllSets called')

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true

		try{
			log.info('Gettings sets for ' + this.getName())
			let cacheKey = format('tournament::%s::sets', this.name)
			if(isCached){
				let cached = await Cache.get(cacheKey)
				if(cached){
					this.players = cached
					return cached
				}
			}
			
			
			let data = await NI.query(graphQueries.tournamentPhaseGroupIds, {slug: this.name})
			let pgIds = _.flatten(data.tournament.events.map(e=> { return e.phaseGroups.map(pg => pg.id) }))
			let results = await Promise.all(pgIds.map(async (id) => 
				await NI.query(graphQueries.phaseGroupSets, {id: id})
			))

			let phaseGroups = results.map(row =>  row.phaseGroup)
			let sets = _.flatten(phaseGroups.map(group => group.sets))
				.map(set => {
					let M = new Match(
						set.id, 
						1, 
						set.fullRoundText,
						new Player(1, 'Joe'),
						new Player(2, 'John'),
						set.completedAt == undefined ? true: false,
						0,
						0,
						set.winnerId,
						null,
						set	
					)
					return M
				})

			await Cache.set(cacheKey, sets)
			return sets

		}catch(err){
			log.error('Tournament.getAllSets: ' + err)
			throw err
		}
	}

	/**
	 * getAllSetsWithoutEntrants
	 * 
	 * aggreagates all the sets from a Tournament
	 * in an array of Set objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */
	async getAllSetsWithoutEntrants(options={}){
		log.debug('Tournament.getAllSets called')

		// parse options
		let isCached = options.isCached != undefined ? options.isCached === true : true

		try{
			log.info('Gettings sets for ' + this.getName())
			let cacheKey = format('tournament::%s::sets', this.name)
			if(isCached){
				let cached = await Cache.get(cacheKey)
				if(cached){
					this.players = cached
					return cached
				}
			}
			
			
			let data = await NI.query(graphQueries.tournamentPhaseGroupIds, {slug: this.name})
			let pgIds = _.flatten(data.tournament.events.map(e=> { return e.phaseGroups.map(pg => pg.id) }))
			let results = await Promise.all(pgIds.map(async (id) => 
				await NI.query(graphQueries.phaseGroupSetsWithoutEntrants, {id: id})
			))

			let phaseGroups = results.map(row =>  row.phaseGroup)
			log.info('Gathering sets from %s phase groups', phaseGroups.length)
		
			let displayScoreRegex = new RegExp(/([\S\s]*)([0-9]) - ([\S\s]*)([0-9])/)
			let sets = _.flatten(phaseGroups.map(group => {
				return group.sets
					.filter(set => set.displayScore != 'BYE' && displayScoreRegex.test(set.displayScore))
					.map(set => {
						let parsed = displayScoreRegex.exec(set.displayScore)
						let tag1 = parsed[1].trim()
						let score1 = parsed[2].trim()
						let tag2 = parsed[3].trim()
						let score2 = parsed[4].trim()

						let M = new Match(
							set.id, 
							1, 
							set.fullRoundText,
							new Player(1, tag1),
							new Player(2, tag2),
							set.completedAt == undefined ? true: false,
							score1,
							score2,
							set.winnerId,
							null,
							set	
						)
						return M
					})
			}))
			await Cache.set(cacheKey, sets)
			return sets

		}catch(err){
			log.error('Tournament.getAllSets: ' + err)
			throw err
		}
	}
	
	/**
	 * getAllSetsWithEntrants
	 * 
	 * aggreagates all the sets from a Tournament
	 * in an array of Set objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */
	async getAllSetsWithEntrants(options={}){
		log.debug('Tournament.getAllSets called')

		// parse options
		let fromCacheTF = options.isCached != undefined ? options.isCached === true : true

		try{
			log.info('Gettings sets for ' + this.getName())
			let cacheKey = format('tournament::%s::sets', this.name)
			if(fromCacheTF){
				let cached = await Cache.get(cacheKey)
				if(cached){
					this.players = cached
					return cached
				}
			}
			
			let players = await this.getAllPlayers()
			let data = await NI.query(graphQueries.tournamentPhaseGroupIds, {slug: this.name})
			let pgIds = _.flatten(data.tournament.events.map(e=> { return e.phaseGroups.map(pg => pg.id) }))
			let results = await Promise.all(pgIds.map(async (id) => 
				await NI.query(graphQueries.phaseGroupSetsWithEntrants, {id: id})
			))

			let phaseGroups = results.map(row =>  row.phaseGroup)
			log.info('Gathering sets from %s phase groups', phaseGroups.length);
			let displayScoreRegex = new RegExp(/([\S\s]*([0-9])) - ([\S\s]*([0-9]))/)
			let sets = _.flatten(phaseGroups.map(group => {
				return group.sets
				
					.filter(set => set.displayScore != 'BYE' && displayScoreRegex.test(set.displayScore))
					.map(set => {
						let entrant1Id = set.slots[0].entrant.participants[0].id
						let entrant2Id = set.slots[1].entrant.participants[0].id
						let parsed = displayScoreRegex.exec(set.displayScore)
						let score1 = parsed[2]
						let score2 = parsed[4]

						let M = new Match(
							set.id, 
							1, 
							set.fullRoundText,
							_.find(players, {participantId: entrant1Id}),
							_.find(players, {participantId: entrant2Id}),
							set.completedAt == undefined ? true: false,
							score1,
							score2,
							set.winnerId,
							null,
							set	
						)
						return M
					})
			}))
			await Cache.set(cacheKey, sets)
			return sets

		}catch(err){
			log.error('Tournament.getAllSets: ' + err)
			throw err
		}
	}
	
	/**
	 * getIncompleteSets
	 * 
	 * gets all the sets in a tournament and filters out 
	 * those that have been completed, and returns a promise
	 * resolving the resulting Set objects
	 * 
	 * @param  {} options={}
	 * @return {promise} resolves an array of Set objects
	 */
	async getIncompleteSets(options={}){
		log.debug('Tournament.getIncompleteSets called')
		try{
			//parse options
			let sets = await this.getAllSetsWithoutEntrants(options)
			let incompleteSets = sets.filter(set => set.isComplete == false)
			return incompleteSets
		} catch(e){
			log.error('Tournament.getIncompleteSets error: %s', e)
			throw e
		}
	}

	/**
	 * getCompletedSets
	 * 
	 * gets all the sets in a tournament and filters out 
	 * those that have not been completed, and returns a promise
	 * resolving the resulting Set objects
	 * 
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */
	async getCompleteSets(options={}){
		log.debug('Tournament.getIncompleteSets called')
		try{
			let sets = await this.getAllSetsWithoutEntrants(options)
			let completedSets = sets.filter(set => set.isComplete)
			return completedSets
		} catch(e){
			log.error('Tournament.getCompleteSets error: %s', e)
			throw e
		}
	}

	
	/**
	 * getSetsXMinuesBack
	 * 
	 * gets all the sets in a tournament and filters out 
	 * those that have not been completed but are within the 
	 * minutesBack threshold, and returns a promise resolving 
	 * the resulting Set objects
	 * 
	 * @param  {int} minutesBack
	 * @param  {object} options={}
	 * @returns {promise} resolves an array of Set objects
	 */
	async getSetsXMinutesBack(minutesBack, options={}){
		log.verbose('Tournament.getSetsXMinutesBack called')
		try{
			let sets = await this.getAllSets(options)
			let timestamp = moment().subtract(minutesBack, 'minutes').unix()
			let setsXMinutesBack = sets.filter(set => set.isComplete && moment(set.data.completedAt).isAfter(timestamp))
			return setsXMinutesBack
		} catch(e){
			log.error('Tournament.getSetsXMinutesBack error: %s', e)
			throw e
		}
	}

	/** SIMPLE GETTERS **/
	getFromData(prop){
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

	getId(){
		return this.getFromData('id')
	}

	getName(){
		return this.getFromData('name')
	}

	getSlug(){
		return this.getFromData('slug')
	}

	getTimezone(){
		return this.getFromData('timezone')
	}

	getStartTime(){
		let startAt = this.getFromData('startAt')
		let tz = this.getFromData('timezone')

		if(startAt && tz) {
			let time = moment.unix(startAt).tz(tz)
			return time.toDate()
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present')
			return null
		}
	}

	getStartTimeString(){
		let startAt = this.getFromData('startAt')
		let tz = this.getFromData('timezone')

		if(startAt && tz) {
			let time = moment.unix(startAt).tz(tz).format('MM-DD-YYYY HH:mm:ss')
			let zone = moment.tz(tz).zoneName()
			return `${time} ${zone}`
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present')
			return null
		}
	}

	getEndTime(){
		let endAt = this.getFromData('endAt')
		let tz = this.getFromData('timezone')

		if(endAt && tz) {
			let time = moment.unix(endAt).tz(tz)
			return time.toDate()
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present')
			return null
		}
	}

	getEndTimeString(){
		let endAt = this.getFromData('endAt')
		let tz = this.getFromData('timezone')

		if(endAt && tz) {
			let time = moment.unix(endAt).tz(tz).format('MM-DD-YYYY HH:mm:ss')
			let zone = moment.tz(tz).zoneName()
			return `${time} ${zone}`
		}
		else{
			log.error('Tournament.getStartTime: startAt and timezone properties must both be present')
			return null
		}
	}

	getCity(){
		return this.getFromData('city')
	}

	getState(){
		return this.getFromData('addrState')
	}

	getContactEmail(){
		return this.getFromData('contactEmail')
	}

	getContactTwitter(){
		return this.getFromData('contactTwitter')
	}

	getOwnerId(){
		return this.getFromData('ownerId')
	}


	/** dropped support with gql update */
	getZipCode(){
		throw new Error(NO_LONGER_SUPPORTED_ERROR.red)
		//return this.getFromData('postalCode')
	}

	getVenueFee(){
		throw new Error(NO_LONGER_SUPPORTED_ERROR.red)
		//return this.getFromData('venueFee')
	}

	getProcessingFee(){
		throw new Error(NO_LONGER_SUPPORTED_ERROR.red)
		//return this.getFromData('processingFee')
	}

	getWhenRegistrationCloses(){
		throw new Error(NO_LONGER_SUPPORTED_ERROR.red)

		/*
		let closesAt = this.getFromData('eventRegistrationClosesAt')
		let tz = this.getFromData('timezone')

		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(closesAt).tz(tz)
			return time.toDate()
		}
		else{
			log.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present')
			return null
		}
		*/
	}

	getWhenRegistrationClosesString(){
		throw new Error(NO_LONGER_SUPPORTED_ERROR.red)
		/*
		let closesAt = this.getFromData('eventRegistrationClosesAt')
		let tz = this.getFromData('timezone')

		if(this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
			let time = moment.unix(closesAt).tz(tz).format('MM-DD-YYYY HH:mm:ss')
			let zone = moment.tz(tz).zoneName()
			return `${time} ${zone}`
		}
		else{
			log.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present')
			return null
		}
		*/
	}

	/** NULL VALUES **/
	nullValueString(prop){
		return prop + ' not available for tournament ' + this.getName()
	}

	/** EVENTS **/
	emitTournamentReady(){
		this.emit('ready')
	}

	emitTournamentError(err){
		this.emit('error', err)
	}
}

Tournament.prototype.toString = function(){
	return 'Tournament: ' + 
		'\nName: ' + this.getName() + 
		'\nSlug: ' + this.getSlug() +
		'\nDate: ' + this.getStartTime() +  
		'\nState: ' + this.getState() + 
		'\nCity: ' + this.getCity()
}

module.exports = Tournament