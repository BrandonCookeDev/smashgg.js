'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const EVENT_SLUG_URL = "https://api.smash.gg/%s/event/%s?%s";

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

    /** SIMPLE GETTERS **/
    getName(){
        if(this.data)
            return this.data.entities.event.name;
        else throw new Error('No data to get Event property Name');
    }

    getSlug(){
        if(this.data)
            return this.data.entities.event.slug;
        else throw new Error('No data to get Event property Slug');
    }

    getStartTime(){
        if(this.data)
            return moment.unix(this.data.entities.event.startAt).tz(this.Tournament.getTimezone()).format('YYYY-MM-DD HH:mm:SS');
        else throw new Error('No data to get Event property StartTime');
    }

    getEndTime(){
        if(this.data)
            return moment.unix(this.data.entities.event.endAt).tz(this.Tournament.getTimezone()).format('YYYY-MM-DD HH:mm:SS');
        else throw new Error('No data to get Event property EndTime');
    }

    /** EVENTS **/
    emitEventReady(){
        this.emit('ready');
    }
}

module.exports = Event;
