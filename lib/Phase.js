'use strict';

let _ = require('lodash');
let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let PhaseGroup = require('./PhaseGroup');

const PHASE_URL = 'https://api.smash.gg/phase/%s?%s'

class Phase extends EventEmitter{

    constructor(id, expands, isCached){
        super();

        if(!id)
            throw new Error('ID cannot be null for Phase Group');

        this.raw = '';
        this.id = id;
        this.isCached = ( (isCached == undefined) || (isCached == null) ) ? true : isCached;

        // CREATE THE EXPANDS STRING
        this.expandsString = "";
        this.expands = {
            groups: (expands && expands.groups) || true
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        this.url = format(PHASE_URL, this.id, this.expandsString);

        let ThisPhase = this;
        this.load()
            .then(function(){
                let cacheKey = format('phase::%s::%s', ThisPhase.id, ThisPhase.expandsString);
                Cache.set(cacheKey, ThisPhase);
            })
            .then(function(){
                ThisPhase.emitPhaseReady();
            })
            .catch(function(err){
                console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')');
                log.error('Phase Group: ' + err);
                ThisPhase.emitPhaseError(err);
            })
    }

    loadRaw(data){
        log.debug('Tournament.loadRaw called');
        try{
            if(typeof(data) === 'object')
                data = JSON.stringify(data);
            
            let encodedData = new Buffer(data).toString('base64');
            this.raw = encodedData;
        }catch(e){
            log.debug('Tournament.loadRaw: %s', e);
            throw e;
        }
    }

    getRaw(){
        log.debug('Tournament.getRaw called');
        try{
            let unencodedData = new Buffer(this.raw, 'base64').toString('utf8');
            let raw = JSON.parse(unencodedData);
            return raw;
        } catch(e){
            log.error('Tournament.getRaw: %s', e);
            throw e;
        }
    }

    async load(){
        log.debug('Phase.load called');

        try{
            if(!this.isCached)
                return await request(this.url);

            let cacheKey = format('phase::%s::%s::data', this.id, this.expandsString);
            let cached = await Cache.get(cacheKey);

            if(!cached){
                let response = await request(this.url);
                this.loadRaw(response);
                await Cache.set(cacheKey, this.raw);
                return this.raw;
            }
            else {
                this.raw = cached;
                return this.raw;
            }
        } catch(e){
            log.error('Phase.load: ' + e);
            throw e;
        }
    }

    /** PROMISES **/
    async getPhaseGroups(fromCacheTF){
        log.debug('Phase.getGroups called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try {
            let cacheKey = format('phase::%s::groups', this.id);
            if (fromCacheTF) {
                let cached = await Cache.get(cacheKey);
                if (cached) {
                    this.groups = cached;
                    return cached;
                }
            }

            let promises = [];
            for (let i in this.getRaw().entities.groups) {
                let group = this.getRaw().entities.groups[i];
                let p = new Promise(function (resolve, reject) {
                    let PG = new PhaseGroup(group.id);
                    PG.on('ready', function () {
                        resolve(PG);
                    })
                });
                promises.push(p);
            }

            let allPhaseGroups = await Promise.all(promises)
            allPhaseGroups = _.uniqBy(allPhaseGroups, 'id');

            this.groups = allPhaseGroups;
            Cache.set(cacheKey, allPhaseGroups);
            return allPhaseGroups;
        }
        catch(err){
            log.error('Phase.getGroups: ' + err);
            throw err;
        }

    }

    /** SIMPLE GETTERS **/
    getFromRawEntities(prop){
        log.debug('Phase.getFromDataEntities called');
        try{
            let raw = this.getRaw();
            if(raw && raw.entities && raw.entities.phase) {
                if (!raw.entities.phase[prop])
                    log.error(this.nullValueString(prop));
                return raw.entities.phase[prop];
            }
            else{
                log.error('No data to get Tournament property Id');
                return null;
            }
        } catch(e){
            log.error('Phase.getFromDataEntities: %s', e);
            throw e;
        }
    }

    getName(){
        return this.getFromRawEntities('name');
    }

    getEventId(){
        return this.getFromRawEntities('eventId');
    }

    /** NULL VALUES **/
    nullValueString(prop){
        return prop + ' not available for Phase ' + this.getRaw().entities.phase.name;
    }

    /** EVENTS **/
    emitPhaseReady(){
        this.emit('ready');
    }

    emitPhaseError(err){
        this.emit('error', err);
    }
}

module.exports = Phase;