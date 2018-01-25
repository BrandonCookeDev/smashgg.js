'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let Player = require('./Player');

class Set extends EventEmitter{

    constructor(setName, WinnerPlayer, LoserPlayer){
        super();

        this.setName = setName;
        this.WinnerPlayer = WinnerPlayer;
        this.LoserPlayer = LoserPlayer;
    }

    loadData(data){
        this.data = data;
    }

    static resolve(data){
        if(!data.entrant1Id || !data.entrant2Id)
            return; //Handles a BYE

        let Player1 = new Player(data.entrant1Id);
        let Player2 = new Player(data.entrant2Id);

        let S = new Set(data.fullRoundText, Player1, Player2, data.winnerId, data.loserId);
        S.loadData(set);
    }
}

module.exports = Set;