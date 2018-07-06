'use strict';

let _ = require('lodash');
let log = require('winston');
let when = require('when');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const EVENT_SLUG_URL = "https://api.smash.gg/%s/event/%s?%s";
const EVENT_TOURNAMENT_CACHE_KEY = 'event::%s::%s::%s';
const EVENT_ID_CACHE_KEY = 'event::%s::%s';

let Phase = require('./Phase');
let PhaseGroup = require('./PhaseGroup');

class Event extends EventEmitter{

    constructor(tournamentId, eventId, expands, isCached, id=null){
        super();

        if(!id){
            if(!tournamentId)
                throw new Error('Tournament Name cannot be null for Event');
            if(!eventId)
                throw new Error('Event Name cannot be null for Event');
        }

        this.data = {};
        this.isCached = ( (isCached == undefined) || (isCached == null) ) ? true : isCached;

        try{
            this.eventId = parseInt(eventId)
        } catch(e){
            this.eventId = eventId;
        }

        this.id = id;
        this.tournamentId = tournamentId;

        // CREATE THE EXPANDS STRING
        /*
        * @deprecated
        */
        this.expandsString = "";
        this.expands = {
            phase: (expands && expands.phase == false) ? false : true,
            groups: (expands && expands.groups == false) ? false : true
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        
        
        let ThisEvent = this;
        if(!id){
            let Tournament = require('./Tournament');
            let T = new Tournament(this.tournamentId, {}, false);
            T.on('ready', function(){
                ThisEvent.Tournament = T;
                ThisEvent.tournamentSlug = T.getSlug();
                ThisEvent.url = format(EVENT_SLUG_URL, ThisEvent.tournamentSlug, ThisEvent.eventId, ThisEvent.expandsString);

                ThisEvent.load()
                    .then(function(){
                        let cacheKey = format(EVENT_TOURNAMENT_CACHE_KEY, ThisEvent.tournamentId, ThisEvent.eventId, ThisEvent.expandsString);
                        Cache.set(cacheKey, ThisEvent);
                    })
                    .then(function(){
                        ThisEvent.emitEventReady();
                    })
                    .catch(function(err){
                        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
                        log.error('Event: ' + err);
                        ThisEvent.emitEventError();
                    })
            })
        }
        else{
            this.url = format(EVENT_URL, this.id, this.expandsString);
            this.load()
                .then(function(){
                    let cacheKey = format(EVENT_ID_CACHE_KEY, ThisEvent.id, ThisEvent.expandsString);
                    Cache.set(cacheKey, ThisEvent);
                })
                .then(function(){
                    ThisEvent.emitEventReady();
                })
                .catch(function(err){
                    console.error('Error creating Event with id. For more info, implement Event.on(\'error\')');
                    log.error('Event: ' + err);
                    this.emitEventError();
                })
        }
    }

    loadData(data){
        this.data = data;
    }

    // Convenience methods    
    static getEvent(tournamentName, eventName, expands=undefined, isCached=true){
        let deferred = when.defer();
        try{
            let E = new Event(tournamentName, eventName, expands, isCached);
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

    static getEventById(id, expands=undefined, isCached=true){
        let deferred = when.defer();
        try{
            let E = new Event(undefined, undefined, expands, isCached, id);
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

    async load(){
        log.debug('Event.load called');

        try{
            if(!this.isCached)
                return await request(this.url);

            let cacheKey = this.id ?
                format(EVENT_ID_CACHE_KEY + "::data", this.id, this.expandsString) : 
                format(EVENT_TOURNAMENT_CACHE_KEY + '::data', this.tournamentId, this.eventId, this.expandsString);
            let cached = await Cache.get(cacheKey);

            if(!cached){
                let response = await request(this.url);
                this.data = JSON.parse(response);
                await Cache.set(cacheKey, this.data);
                return this.data;
            }
            else {
                this.data = cached;
                return this.data;
            }
        } catch(e){
            log.error('Event.load: ' + e);
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

            let promises = [];
            for(let i in this.data.entities.phase){
                let phase = this.data.entities.phase[i];
                let ThisEvent = this;
                let p = new Promise(function(resolve, reject) {
                    let P = new Phase(phase.id, {}, fromCacheTF);
                    P.on('ready', function(){
                        resolve(P)
                    });
                });
                promises.push(p);
            }

            let allPhases = await Promise.all(promises);
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

            let promises = [];
            for(let i in this.data.entities.groups){
                let group = this.data.entities.groups[i];
                let ThisEvent = this;
                let p = new Promise(function(resolve, reject) {
                    let PG = new PhaseGroup(group.id, {}, fromCacheTF);
                    PG.on('ready', function(){
                        resolve(PG)
                    });
                });
                promises.push(p);
            }

            let allGroups = await Promise.all(promises);
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
        if(this.data && this.data.entities && this.data.entities.event) {
            if (!this.data.entities.event[prop])
                log.error(this.nullValueString(prop));
            return this.data.entities.event[prop];
        }
        else{
            log.error('No data to get Tournament property Id');
            return null;
        }
    }

    getName(){
        return this.getFromDataEntities('name');
    }

    getSlug(){
        return this.getFromDataEntities('slug');
    }

    getStartTime(){
        let startAt = this.getFromDataEntities('startAt');
        let tz = this.Tournament.getTimezone();

        if(startAt && tz){
            let time = moment.unix(this.data.entities.event.startAt).tz(this.Tournament.getTimezone()).format('MM-DD-YYYY HH:mm:ss');
            let zone = moment.tz(this.Tournament.getTimezone()).zoneName();
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
        return prop + ' not available for Event ' + this.data.entities.event.name;
    }

    /** EVENTS **/
    emitEventReady(){
        this.emit('ready');
    }

    emitEventError(err){
        this.emit('error', msg);
    }
}

module.exports = Event;
