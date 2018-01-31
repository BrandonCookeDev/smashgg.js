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

        this.data = {};
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

    loadData(data){
        this.data = data;
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
                this.data = JSON.parse(response);
                await Cache.set(cacheKey, this.data);
                return this.data;
            }
            else {
                this.data = cached;
                return this.data;
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
            let ThisPhase = this;
            let cacheKey = format('phase::%s::groups', this.id);
            if (fromCacheTF) {
                let cached = await Cache.get(cacheKey);
                if (cached) {
                    this.groups = cached;
                    return cached;
                }
            }

            let promises = [];
            for (let i in ThisPhase.data.entities.groups) {
                let group = ThisPhase.data.entities.groups[i];
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
    getFromDataEntities(prop){
        if(this.data && this.data.entities && this.data.entities.phase) {
            if (!this.data.entities.phase[prop])
                log.error(this.nullValueString(prop));
            return this.data.entities.phase[prop];
        }
        else{
            log.error('No data to get Tournament property Id');
            return null;
        }
    }

    getName(){
        return this.getFromDataEntities('name');
    }

    getEventId(){
        return this.getFromDataEntities('eventId');
    }

    /** NULL VALUES **/
    nullValueString(prop){
        return prop + ' not available for Phase ' + this.data.entities.phase.name;
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