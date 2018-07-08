'use strict';

let _ = require('lodash');
let log = require('winston');
let when = require('when');
let {format} = require('util');
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const EVENT_SLUG_URL = "https://api.smash.gg/%s/event/%s?%s";
const EVENT_TOURNAMENT_CACHE_KEY = 'event::%s::%s::%s';
const EVENT_ID_CACHE_KEY = 'event::%s::%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';

let Phase = require('./Phase');
let PhaseGroup = require('./PhaseGroup');

class Event extends EventEmitter{

    constructor(eventId, tournamentId=undefined, options = {}){
        super();
        
        let Tournament = require('./Tournament');

        if(!eventId)
            throw new Error('Event Constructor: Event Name/ID cannot be null for Event');
        if(isNaN(eventId) && !tournamentId)
            throw new Error('Event Constructor: Event name must be paired with a Tournament name');

        // parse options
        let rawEncoding = options.rawEncoding || DEFAULT_ENCODING;
        let expands = options.expands || {};
        let isCached = options.isCached || true;

        // set properties
        this.data = {};// if it's NaN, we have an event Name not ID number
        this.tournamentId = tournamentId;
        this.isCached = isCached;
        this.eventId = isNaN(parseInt(eventId)) ? eventId : parseInt(eventId); 
        this.rawEncoding = LEGAL_ENCODINGS.includes(rawEncoding) ? rawEncoding : DEFAULT_ENCODING;

        // create expands
        this.expandsString = "";
        this.expands = {
            phase: (expands && expands.phase == false) ? false : true,
            groups: (expands && expands.groups == false) ? false : true
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        if(isNaN(eventId)){
            let ThisEvent = this;
            Tournament.getTournament(this.tournamentId)
                .then(function(T){
                    ThisEvent.Tournament = T;
                    ThisEvent.tournamentSlug = T.getSlug();
                    ThisEvent.url = format(EVENT_SLUG_URL, ThisEvent.tournamentSlug, ThisEvent.eventId, ThisEvent.expandsString);
                })
                .then(async () => await ThisEvent.load() )
                .then(function(){
                    let cacheKey = format(EVENT_TOURNAMENT_CACHE_KEY, ThisEvent.tournamentId, ThisEvent.eventId, ThisEvent.expandsString);
                    Cache.set(cacheKey, ThisEvent);
                })
                .then(function(){
                    ThisEvent.emitEventReady();
                })
                .catch(function(err){
                    console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
                    log.error('Event error: %s', err.message);
                    ThisEvent.emitEventError(err);
                })
        }
        else{
            let ThisEvent = this;
            this.url = format(EVENT_URL, this.eventId, this.expandsString);
            this.load()
                .then( () => {
                    let cacheKey = format(EVENT_ID_CACHE_KEY,ThisEvent.eventId, ThisEvent.expandsString);
                    Cache.set(cacheKey, ThisEvent);
                })
                .then(async () => await ThisEvent.loadTournamentData() )
                .then( () => ThisEvent.emitEventReady() )
                .catch( (err) => {
                    console.error('Error creating Event. For more info, implement Event.on(\'error\')');
                    log.error('Event error: %s', err.message);
                    ThisEvent.emitEventError(err);
                })
        }
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
    static getEvent(eventName, tournamentName, options){
        let deferred = when.defer();
        try{
            let E = new Event(eventName, tournamentName, options);
            E.on('ready', function(){
                deferred.resolve(E);
            })
            E.on('error', function(e){
                log.error('getEvent error: %s', e);
                deferred.reject(e);
            })
        } catch(e){
            log.error('getEvent error: %s', e);
            deferred.reject(e);
        }
        return deferred.promise;
    }

    static getEventById(id, options){
        let deferred = when.defer();
        try{
            if(isNaN(id)){
                deferred.reject(new Error('ID must be an integer for this method'));
                return deferred.promise;
            }

            let E = new Event(id, undefined, options);
            E.on('ready', function(){
                deferred.resolve(E);
            })
            E.on('error', function(e){
                log.error('getEventById error: %s', e);
                deferred.reject(e);
            })
        } catch(e){
            log.error('getEventById error: %s', e);
            deferred.reject(e);
        }
        return deferred.promise;
    }

    // Methods
    async load(){
        log.debug('Event.load called');
        log.verbose('Creating Event from url: %s', this.url);
        try{
            if(!this.isCached)
                return await request(this.url);

            let cacheKey = this.id ?
                format(EVENT_ID_CACHE_KEY + "::data", this.id, this.expandsString) : 
                format(EVENT_TOURNAMENT_CACHE_KEY + '::data', this.tournamentId, this.eventId, this.expandsString);
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
                    format('No Event with id [%s] ( %s )', this.eventId, this.url)
                log.error(s);
            }
            
            throw e;
        }
    }
    
    async loadTournamentData(expands, isCached){
        log.debug('loadTournamentData called');
        try {
            let Tournament = require('./Tournament');
            let slug = this.getTournamentSlug();
            this.Tournament = await Tournament.getTournament(slug, expands, isCached);
            return true;
        } catch(e){
            log.error('loadTournamentData error: %s', e);
            throw e;
        }
    }

    /** PROMISES **/
    async getEventPhases(fromCacheTF){
        log.debug('Event.getEventPhases called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{
            log.info('Getting Phases for Event ' + this.tournamentId);
            let cacheKey = format('event::%s::%s::phases', this.tournamentId, this.eventId);
            if(fromCacheTF){
                let cached = await Cache.get(cacheKey);
                if(cached){
                    this.phases = cached;
                    return cached;
                }
            }

            let allPhases = await Promise.all(
                this.getData().entities.phase.map(async (phase) => {
                    return await Phase.getPhase(phase.id);
                })
            )

            allPhases = _.uniqBy(allPhases, 'id');
            this.phases = allPhases;
            await Cache.set(cacheKey, this.phases);
            return allPhases;
        } catch(err){
            log.error('Event.getEventPhaseGroups: ' + err);
            throw err;
        }
    }

    async getEventPhaseGroups(fromCacheTF){
        log.debug('Event.getEventPhaseGroups called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{
            log.info('Getting Phase Groups for Event ' + this.tournamentId);
            let cacheKey = format('event::%s::%s::groups', this.tournamentId, this.eventId);
            if(fromCacheTF){
                let cached = await Cache.get(cacheKey);
                if(cached){
                    this.phaseGroups = cached;
                    return cached;
                }
            }

            let allGroups = await Promise.all(
                this.getData().entities.groups.map(async (group) => {
                    return await PhaseGroup.getPhaseGroup(group.id);
                })
            )

            allGroups = _.uniqBy(allGroups, 'id');
            this.phaseGroups = allGroups;
            await Cache.set(cacheKey, this.phaseGroups);
            return allGroups;

        } catch(err){
            log.error('Event.getEventPhaseGroups: ' + err);
            throw err;
        }

    }

    /** SIMPLE GETTERS **/
    getFromDataEntities(prop){
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
            return time + " " + zone;
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
            return time + " " + zone;
        }
        else{
            log.error('Event.getEndTime: endAt and timezone properties must both be present');
            return null;
        }
    }

    /** NULL VALUES **/
    nullValueString(prop){
        return prop + ' not available for Event ' + this.getData().entities.event.name;
    }

    /** EVENTS **/
    emitEventReady(){
        this.emit('ready');
    }

    emitEventError(err){
        this.emit('error', err);
    }
}

Event.prototype.toString = function(){
    return 'Event: ' +
        '\nID: ' + this.getId() +
        '\nName: ' + this.getName() +
        '\nTournament: ' + this.getTournamentId() +
        '\nStart Time: ' + this.getStartTime();
}

module.exports = Event;
