'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

class Player extends EventEmitter{

    constructor(id, tag, name, country, region, participantId){
        super();

        if(!id)
            throw new Error('Player ID cannot be null');

        this.id = id;
        this.tag = tag;
        this.name = name;
        this.country = country;
        this.region = region;
        this.participantId = participantId;
    }

    loadData(data){
        this.data = data;
    }

    static resolve(data){
        let playerId = 0;
        let participantId = 0;

        for(let id in data.mutations.participants)
            participantId = id;

        for(let id in data.mutations.players)
            playerId = id;

        let playerDetails = data.mutations.players[playerId];

        let P = new Player(
            playerId,
            playerDetails.gamerTag,
            playerDetails.name,
            playerDetails.country,
            playerDetails.state,
            participantId
        );
        P.loadData(data);
        return P;
    }

}

module.exports = Player;