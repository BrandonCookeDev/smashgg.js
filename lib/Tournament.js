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
                let cacheKey = format('tournament::%s::%s', ThisTournament.name, ThisTournament.expandsString);
                Cache.set(cacheKey, ThisTournament);
            })
            .then(function() {
                ThisTournament.emitTournamentReady();
            })
            .catch(function(err){
                console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')');
                log.error('Tournament: ' + err);
                ThisTournament.emitTournamentError(err);
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

            let cacheKey = format('tournament::%s::%s::data', this.name, this.expandsString);
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
        log.debug('Tournament.getAllPlayers called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{
            log.info('Gettings players for ' + this.name);
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

            let allPlayers = [];
            let players = await Promise.all(promises);
            for(let i in players){
                let arr = players[i];
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
        log.debug('Tournament.getAllSets called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{
            log.info('Gettings sets for ' + this.getName());
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

            let allSets = [];
            let sets = await Promise.all(promises);
            for(let i in sets){
                let arr = sets[i];
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
        log.debug('Tournament.getAllEvents called');

        if(fromCacheTF == null || fromCacheTF == undefined)
            fromCacheTF = true;

        try{
            log.info('Getting Events for ' + this.getName());
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
    getFromDataEntities(prop){
        if(this.data && this.data.entities && this.data.entities.tournament) {
            if (!this.data.entities.tournament[prop])
                log.error(this.nullValueString(prop));
            return this.data.entities.tournament[prop];
        }
        else{
            log.error('No data to get Tournament property Id');
            return null;
        }
    }

    getId(){
        return this.getFromDataEntities('id');
    }

    getName(){
        return this.getFromDataEntities('name');
    }

    getSlug(){
        return this.getFromDataEntities('slug');
    }

    getTimezone(){
        return this.getFromDataEntities('timezone');
    }

    getStartTime(){
        let startAt = this.getFromDataEntities('startAt');
        let tz = this.getFromDataEntities('timezone');


        if(this.data.entities.tournament.startAt && this.data.entities.tournament.timezone) {
            let time = moment.unix(startAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            let zone = moment.tz(tz).zoneName();
            return time + " " + zone;
        }
        else{
            log.error('Tournament.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    }

    getEndTime(){
        let endAt = this.getFromDataEntities('endAt');
        let tz = this.getFromDataEntities('timezone');

        if(this.data.entities.tournament.startAt && this.data.entities.tournament.timezone) {
            let time = moment.unix(endAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            let zone = moment.tz(tz).zoneName();
            return time + " " + zone;
        }
        else{
            log.error('Tournament.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    }

    getWhenRegistrationCloses(){
        let closesAt = this.getFromDataEntities('eventRegistrationClosesAt');
        let tz = this.getFromDataEntities('timezone');


        if(this.data.entities.tournament.startAt && this.data.entities.tournament.timezone) {
            let time = moment.unix(closesAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            let zone = moment.tz(tz).zoneName();
            return time + " " + zone;
        }
        else{
            log.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present');
            return null;
        }
    }

    getCity(){
        return this.getFromDataEntities('city');
    }

    getState(){
        return this.getFromDataEntities('addrState');
    }

    getZipCode(){
        return this.getFromDataEntities('postalCode');
    }

    getContactEmail(){
        return this.getFromDataEntities('contactEmail');
    }

    getContactTwitter(){
        return this.getFromDataEntities('contactTwitter');
    }

    getOwnerId(){
        return this.getFromDataEntities('ownerId');
    }

    getVenueFee(){
        return this.getFromDataEntities('venueFee');
    }

    getProcessingFee(){
        return this.getFromDataEntities('processingFee');
    }

    /** NULL VALUES **/
    nullValueString(prop){
        return prop + ' not available for tournament ' + this.data.entities.tournament.name;
    }

    /** EVENTS **/
    emitTournamentReady(){
        this.emit('ready');
    }

    emitTournamentError(err){
        this.emit('error', err)
    }
}

module.exports = Tournament;