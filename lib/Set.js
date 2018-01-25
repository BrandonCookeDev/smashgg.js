'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let Player = require('./Player');

class Set extends EventEmitter{

    constructor(id, eventId, setName, WinnerPlayer, LoserPlayer){
        super();

        this.id = id;
        this.eventId = eventId;
        this.setName = setName;
        this.WinnerPlayer = WinnerPlayer;
        this.LoserPlayer = LoserPlayer;
    }

    loadData(data){
        this.data = data;
    }

}

module.exports = Set;