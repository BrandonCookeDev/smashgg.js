'use strict';

let _ = require('lodash');
let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let Event = require('./Event');
let PhaseGroup = require('./PhaseGroup');

const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';

class Tournament extends EventEmitter{

    constructor(tournamentName, expands, isCached){
        super();

        if(!tournamentName)
            throw new Error('Tournament Name cannot be null');

        this.data = {};
        this.name = tournamentName;
        this.isCached = ( (isCached == undefined) || (isCached == null) ) ? true : isCached;

        // CREATE THE EXPANDS STRING
        this.expandsString = "";
        this.expands = {
            event: (expands && expands.event) || true,
            phase: (expands && expands.phase) || true,
            groups: (expands && expands.groups) || true,
            stations: (expands && expands.stations) || true
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        // FORMAT THE SMASH GG API URL
        this.url = format(TOURNAMENT_URL, this.name, this.expandsString);

        let ThisTournament = this;
        this.load()
            .then(function(data){
                ThisTournament.emitTournamentReady();
            })
            .catch(function(err){
                log.error('Tournament: ' + err);
                throw err;
            })
    }

    loadData(data){
        this.data = data;
    }

    async load(){
        log.debug('Tournament.load called');

        try{
            if(!this.isCached)
                return this.data = JSON.parse(await request(this.url));

            let cacheKey = format('tournament::%s', this.name);
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
            log.error('Tournament.load: ' + e);
            throw e;
        }
    }

    /** PROMISES **/
    async getAllPlayers(fromCacheTF){
        // TODO implement caching
        log.debug('Tournament.getAllPlayers called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{

            let cacheKey = format('tournament::%s::players', this.name);
            if(fromCacheTF){
                let cached = await Cache.get(cacheKey);
                if(cached){
                    this.players = cached;
                    return cached;
                }
            }

            let promises = [];
            this.data.entities.groups.forEach(function (group) {
                let p = new Promise(function(resolve, reject) {
                    let PG = new PhaseGroup(group.id);
                    PG.on('ready', function() {
                        let players = PG.getPlayers();
                        resolve(players);
                    });
                });
                promises.push(p);
            });

            let allPlayers = await Promise.all(promises);
            for(let i in allPlayers){
                let arr = allPlayers[i];
                allPlayers = allPlayers.concat(arr)
            }
            allPlayers = _.uniqBy(allPlayers, 'id');
            this.players = allPlayers;
            await Cache.set(cacheKey, this.players);
            return allPlayers;

        }catch(err){
            log.error('Tournament.getAllPlayers: ' + err);
            throw err;
        }
    }

    async getAllSets(fromCacheTF){
        // TODO implement caching
        log.debug('Tournament.getAllSets called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{

            let cacheKey = format('tournament::%s::sets', this.name);
            if(fromCacheTF){
                let cached = await Cache.get(cacheKey);
                if(cached){
                    this.players = cached;
                    return cached;
                }
            }

            let promises = [];
            for(let i in this.data.entities.groups){
                let group = this.data.entities.groups[i];
                let p = new Promise(function(resolve, reject) {
                    let PG = new PhaseGroup(group.id);
                    PG.on('ready', function() {
                        let sets = PG.getSets();
                        resolve(sets);
                    });
                });
                promises.push(p);
            }

            let allSets = await Promise.all(promises)
            for(let i in allSets){
                let arr = allSets[i];
                allSets = allSets.concat(arr)
            }
            allSets = _.uniqBy(allSets, 'id');

            this.sets = allSets;
            await Cache.set(cacheKey, this.sets);
            return allSets;


        }catch(err){
            log.error('Tournament.getAllSets: ' + err);
            throw err;
        }
    }

    async getAllEvents(fromCacheTF){
        // TODO implement caching
        log.debug('Tournament.getAllEvents called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{

            let cacheKey = format('tournament::%s::events', this.name);
            if(fromCacheTF){
                let cached = await Cache.get(cacheKey);
                if(cached){
                    this.players = cached;
                    return cached;
                }
            }

            let promises = [];
            for(let i in this.data.entities.event){
                let event = this.data.entities.event[i];
                let ThisTournament = this;
                let p = new Promise(function(resolve, reject) {
                    let eventName = event.slug.substring(event.slug.lastIndexOf('/') + 1);
                    let E = new Event(ThisTournament.name, eventName);
                    E.on('ready', function() {
                        resolve(E);
                    });
                });
                promises.push(p);
            }

            let allEvents = await Promise.all(promises);
            //allEvents = _.uniqBy(allEvents, 'id');
            this.events = allEvents;
            await Cache.set(cacheKey, this.events);
            return allEvents;


        } catch(err) {
            log.error('Tournament.getAllEvents: ' + err);
            throw err;
        }

    }

    /** SIMPLE GETTERS **/
    getId(){
        if(this.data)
            return this.data.entities.tournament.id;
    }

    getName(){
        if(this.data)
            return this.data.entities.tournament.name;
    }

    getTournamentSlug(){
        if(this.data)
            return this.data.entities.tournament.slug;
    }

    getTimezone(){
        if(this.data)
            return this.data.entities.tournament.timezone;
    }

    getStartTime(){
        if(this.data)
            return moment.unix(this.data.entities.tournament.startAt).tz(this.getTimezone()).format('YYYY-MM-DD HH:mm:SS');
    }

    getEndTime(){
        if(this.data)
            return moment.unix(this.data.entities.tournament.endAt).tz(this.getTimezone()).format('YYYY-MM-DD HH:mm:SS');
    }

    getCity(){
        if(this.data)
            return this.data.entities.tournament.city;
    }

    getOwnerId(){
        if(this.data)
            return this.data.entities.tournament.ownerId;
    }

    getVenueFee(){
        if(this.data)
            return this.data.entities.tournament.venueFee;
    }

    getProcessingFee(){
        if(this.data)
            return this.data.entities.tournament.processingFee;
    }

    /** EVENTS **/
    emitTournamentReady(){
        this.emit('ready');
    }
}

module.exports = Tournament;