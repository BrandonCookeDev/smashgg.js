'use strict';

let _ = require('lodash');
let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const EVENT_SLUG_URL = "https://api.smash.gg/%s/event/%s?%s";

let Phase = require('./Phase');
let PhaseGroup = require('./PhaseGroup');

class Event extends EventEmitter{

    constructor(tournamentName, eventName, expands, isCached){
        super();

        if(!tournamentName)
            throw new Error('Tournament Name cannot be null for Event');
        if(!eventName)
            throw new Error('Event Name cannot be null for Event');

        this.data = {};
        this.tournamentName = tournamentName;
        this.eventName = eventName;
        this.isCached = ( (isCached == undefined) || (isCached == null) ) ? true : isCached;

        // CREATE THE EXPANDS STRING
        this.expandsString = "";
        this.expands = {
            phase: (expands && expands.phase) || true,
            groups: (expands && expands.groups) || true
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        let ThisEvent = this;
        let Tournament = require('./Tournament');
        let T = new Tournament(this.tournamentName, {}, false);
        T.on('ready', function(){
            ThisEvent.Tournament = T;
            ThisEvent.tournamentSlug = T.getSlug();
            ThisEvent.url = format(EVENT_SLUG_URL, ThisEvent.tournamentSlug, ThisEvent.eventName, ThisEvent.expandsString);

            ThisEvent.load()
                .then(function(){
                    let cacheKey = format('event::%s::%s::%s', ThisEvent.tournamentName, ThisEvent.eventName, ThisEvent.expandsString);
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

    loadData(data){
        this.data = data;
    }

    async load(){
        log.debug('Event.load called');

        try{
            if(!this.isCached)
                return await request(this.url);

            let cacheKey = format('event::%s::%s::%s::data', this.tournamentName, this.eventName, this.expandsString);
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

    static resolve(data){
        // TODO Instantiate object from raw data

    }

    /** PROMISES **/
    async getEventPhases(fromCacheTF){
        log.debug('Event.getEventPhases called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{
            log.info('Getting Phases for Event ' + this.tournamentName);
            let cacheKey = format('event::%s::%s::phases', this.tournamentName, this.eventName);
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
            log.info('Getting Phase Groups for Event ' + this.tournamentName);
            let cacheKey = format('event::%s::%s::groups', this.tournamentName, this.eventName);
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
