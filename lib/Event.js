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
                    ThisEvent.emitEventReady();
                })
                .catch(function(err){
                    log.error('Event: ' + err);
                    throw err;
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

            let cacheKey = format('event::%s::%s', this.tournamentName, this.eventName);
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
            let cacheKey = format('event::%s::%s::phases::%s', this.tournamentName, this.eventName,this.expandsString);
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
    getName(){
        if(this.data)
            return this.data.entities.event.name || this.nullValueString('Name');
        else throw new Error('No data to get Event property Name');
    }

    getSlug(){
        if(this.data)
            return this.data.entities.event.slug || this.nullValueString('Event Slug');
        else throw new Error('No data to get Event property Slug');
    }

    getStartTime(){
        if(this.data)
            if(this.data.entities.event.startAt) {
                let time = moment.unix(this.data.entities.event.startAt).tz(this.Tournament.getTimezone()).format('MM-DD-YYYY HH:mm:ss');
                let zone = moment.tz(this.Tournament.getTimezone()).zoneName();
                return time + " " + zone;
            }
            else
                this.nullValueString('Start Time');
        else throw new Error('No data to get Event property StartTime');
    }

    getEndTime(){
        if(this.data)
            if(this.data.entities.event.endAt) {
                let time = moment.unix(this.data.entities.event.endAt).tz(this.Tournament.getTimezone()).format('MM-DD-YYYY HH:mm:ss');
                let zone = moment.tz(this.Tournament.getTimezone()).zoneName();
                return time + " " + zone;
            }
            else
                this.nullValueString('End Time');
        else throw new Error('No data to get Event property EndTime');
    }

    /** NULL VALUES **/
    nullValueString(prop){
        return prop + ' not available for Event ' + this.data.entities.event.name;
    }

    /** EVENTS **/
    emitEventReady(){
        this.emit('ready');
    }
}

module.exports = Event;
