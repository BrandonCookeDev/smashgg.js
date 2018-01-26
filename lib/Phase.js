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
                ThisPhase.emitPhaseReady();
            })
            .catch(function(err){
                log.error('Phase Group: ' + err);
                throw err;
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

            let cacheKey = format('phase::%s', this.id);
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
    getGroups(){
        log.debug('Phase.getGroups called');

        let ThisPhase = this;
        return new Promise(function(resolve, reject){

            let promises = [];
            ThisPhase.data.entities.groups.forEach(function(group){
                let p = new Promise(function(resolve, reject){
                    let PG = new PhaseGroup(group.id);
                    PG.on('ready', function(){
                        resolve(PG);
                    })
                });
                promises.push(p);
            });

            Promise.all(promises)
                .then(function(phaseGroups){
                    let allPhaseGroups = phaseGroups;
                    allPhaseGroups = _.uniqBy(allPhaseGroups, 'id');
                    resolve(allPhaseGroups);
                })
                .catch(function(err){
                    log.error('Phase.getGroups: ' + err);
                    return reject(err);
                })

        })
    }

    /** SIMPLE GETTERS **/
    getName(){
        if(this.data)
            return this.data.entities.phase.name;
    }

    getEventId(){
        if(this.data)
            return this.data.entities.phase.eventId;
    }



    /** EVENTS **/
    emitPhaseReady(){
        this.emit('ready');
    }
}

module.exports = Phase;