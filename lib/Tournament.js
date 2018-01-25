'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

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
            event: (expands && expands.event) || false,
            phase: (expands && expands.phase) || false,
            groups: (expands && expands.groups) || false,
            stations: (expands && expands.stations) || false
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