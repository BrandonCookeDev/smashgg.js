'use strict';

let _ = require('lodash');
let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let Set = require('./Set');
let Player = require('./Player');

const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';

class PhaseGroup extends EventEmitter{

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
            sets: (expands && expands.sets) || true,
            entrants: (expands && expands.entrants) || true,
            standings: (expands && expands.standings) || true,
            seeds: (expands && expands.seeds) || true
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        this.url = format(PHASE_GROUP_URL, this.id, this.expandsString);

        let ThisPhaseGroup = this;
        this.load()
            .then(function(){
                let cacheKey = format('phasegroup::%s::%s', ThisPhaseGroup.id, ThisPhaseGroup.expandsString);
                Cache.set(cacheKey, ThisPhaseGroup);
            })
            .then(function(){
                ThisPhaseGroup.emitPhaseGroupReady();
            })
            .catch(function(err){
                console.error('Error creating Tournament. For more info, implement PhaseGroup.on(\'error\')');
                log.error('Phase Group: ' + err);
                ThisPhaseGroup.emitPhaseGroupError(err);
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
        log.debug('PhaseGroup.load called');

        try{
            if(!this.isCached)
                return await request(this.url);

            let cacheKey = format('phasegroup::%s::%s::data', this.id, this.expandsString);
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
            log.error('PhaseGroup.load: ' + e);
            throw e;
        }
    }

    /** PROMISES **/
    async getPlayers(fromCacheTF){

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try {
            let cacheKey = format('phasegroup::%s::players', this.id);
            if (fromCacheTF) {
                let cached = await Cache.get(cacheKey);
                if (cached) {
                    this.players = cached;
                    return cached;
                }
            }

            // Fetching logic
            let players = [];
            this.getRaw().entities.entrants.forEach(entrant => {
                let P = Player.resolve(entrant);
                players.push(P);
            });
            this.players = players;

            await Cache.set(cacheKey, this.players);
            return this.players;
        }catch(err){
            log.error('PhaseGroup.getPlayers: ' + err);
            throw err;
        }
    }

    findPlayerByParticipantId(id){
        if(!this.players)
            this.getPlayers();
        let player = _.find(this.players, {participantId: id});
        return player;
    }

    async getSets(fromCacheTF){

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try {

            if (!this.players)
                this.getPlayers(fromCacheTF);

            // Caching logic
            let cacheKey = format('phasegroup::%s::sets', this.id);
            if (fromCacheTF) {
                let cached = await Cache.get(cacheKey);
                if (cached) {
                    this.sets = cached;
                    return cached;
                }
            }

            // Fetching logic
            let sets = [];
            this.getRaw().entities.sets.forEach(set => {

                if (!set.entrant1Id || !set.entrant2Id)
                    return; // HANDLES BYES

                let WinnerPlayer = this.findPlayerByParticipantId(set.winnerId);
                let LoserPlayer = this.findPlayerByParticipantId(set.loserId);


                if (!WinnerPlayer || !LoserPlayer)
                    return; // HANDLES Error of some sort

                let S = new Set(set.id, set.eventId, set.fullRoundText, WinnerPlayer, LoserPlayer);
                S.loadData(set);
                sets.push(S);
            });
            this.sets = sets;

            await Cache.set(cacheKey, this.sets);
            return this.sets;
        } catch(err){
            log.error('PhaseGroup.getSets: ' + err);
            throw err;
        }
    }

    static resolve(data){
        // TODO instantiate object from raw data

    }

    /** SIMPLE GETTERS **/
    getFromRawEntities(prop){
        log.debug('PhaseGroup.getFromDataEntities called');
        try{
            let raw = this.getRaw();
            if(raw && raw.entities && raw.entities.groups) {
                if (!raw.entities.groups[prop])
                    log.error(this.nullValueString(prop));
                return raw.entities.groups[prop];
            }
            else{
                log.error('No data to get Tournament property Id');
                return null;
            }
        } catch(e){
            log.error('PhaseGroup.getFromDataEntities: %s', e);
            throw e;
        }
    }

    getPhaseId(){
        return this.getFromRawEntities('phaseId');
    }

    /** NULL VALUES **/
    nullValueString(prop){
        return prop + ' not available for PhaseGroup ' + this.id;
    }

    /** EVENTS **/
    emitPhaseGroupReady(){
        this.emit('ready');
    }

    emitPhaseGroupError(err){
        this.emit('error', err);
    }

}

module.exports = PhaseGroup;

