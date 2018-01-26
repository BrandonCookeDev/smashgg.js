'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

class Player extends EventEmitter{

    constructor(id, tag, name, country, state, sponsor, participantId){
        super();

        if(!id)
            throw new Error('Player ID cannot be null');

        this.id = id;
        this.tag = tag;
        this.name = name;
        this.country = country;
        this.state = state;
        this.sponsor = sponsor;
        this.participantId = participantId;
    }

    loadData(data){
        this.data = data;
    }

    static resolve(data){
        let playerId = 0;
        let participantId = 0;

        //for(let id in data.mutations.participants)
        //    participantId = id;

        for(let id in data.mutations.players)
            playerId = id;

        let playerDetails = data.mutations.players[playerId];

        let P = new Player(
            parseInt(playerId),
            playerDetails.gamerTag,
            playerDetails.name,
            playerDetails.country,
            playerDetails.state,
            playerDetails.prefix,
            parseInt(data.id)
        );
        P.loadData(data);
        return P;
    }

    /** SIMPLE GETTERS **/
    getId(){
        return this.id;
    }

    getTag(){
        return this.tag;
    }

    getName(){
        return this.name;
    }

    getCountry(){
        return this.country;
    }

    getState(){
        return this.state;
    }

    getSponsor(){
        return this.sponsor;
    }

    getParticipantId(){
        return this.participantId;
    }

}

module.exports = Player;