'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s';

class PhaseGroups extends EventEmitter{

    constructor(id, expands, isCached){

        if(!id)
            throw new Error('ID cannot be null for Phase Group');

        this.data = {};
        this.id = id;
        this.isCached = ( (isCached == undefined) || (isCached == null) ) ? true : isCached;

        // CREATE THE EXPANDS STRING
        this.expandsString = "";
        this.expands = {
            sets: (expands && expands.sets) || false,
            entrants: (expands && expands.entrants) || false,
            standings: (expands && expands.standings) || false,
            seeds: (expands && expands.seeds) || false
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        let ThisPhaseGroup = this;
        this.load()
            .then(function(){
                ThisPhaseGroup.emitPhaseGroupReady();
            })
            .catch(function(err){
                log.error('Phase Group: ' + err);
                throw err;
            })

    }

    loadData(data){
        log.debug('PhaseGroup.loadData called');

        this.data = data;
    }

    async load(){
        log.debug('PhaseGroup.load called');

        try{
            if(!this.isCached)
                return await request(this.url);

            let cacheKey = format('phasegroup::%s', this.id);
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

    emitPhaseGroupReady(){
        this.emit('ready');
    }

}

module.exports = PhaseGroups;

