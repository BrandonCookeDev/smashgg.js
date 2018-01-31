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

        this.data = {};
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

    loadData(data){
        log.debug('PhaseGroup.loadData called');

        this.data = data;
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
                this.data = JSON.parse(response);
                await Cache.set(cacheKey, this.data);
                return this.data;
            }
            else {
                this.data = cached;
                return this.data;
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
            this.data.entities.entrants.forEach(entrant => {
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
            this.data.entities.sets.forEach(set => {

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
    getFromDataEntities(prop){
        if(this.data && this.data.entities && this.data.entities.groups) {
            if (!this.data.entities.groups[prop])
                log.error(this.nullValueString(prop));
            return this.data.entities.groups[prop];
        }
        else{
            log.error('No data to get Tournament property Id');
            return null;
        }
    }

    getPhaseId(){
        return this.getFromDataEntities('phaseId');
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

