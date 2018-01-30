'use strict';

let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let Player = require('./Player');

class Set extends EventEmitter{

    constructor(id, eventId, round, WinnerPlayer, LoserPlayer, data){
        super();

        if(!id)
            throw new Error('Id for Set cannot be null');
        if(!eventId)
            throw new Error('Event Id for Set cannot be null');

        this.id = id;
        this.eventId = eventId;
        this.round = round;
        this.WinnerPlayer = WinnerPlayer;
        this.LoserPlayer = LoserPlayer;

        this.data = data;
    }

    loadData(data){
        this.data = data;
    }

    getRound(){
        return this.round;
    }

    getWinner(){
        return this.WinnerPlayer;
    }

    getLoser(){
        return this.LoserPlayer;
    }

    getGames(){
        if(this.data)
            return this.data.games;
        else throw new Error('No data to get Set property Games');
    }

    getBestOfCount(){
        if(this.data)
            return this.data.bestOf;
        else throw new Error('No data to get Set property Best-Of Count');
    }

    getWinnerScore(){
        if(this.data)
            return this.data.entrant1Score > this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
        else throw new Error('No data to get Set property Winner Score');
    }

    getLoserScore(){
        if(this.data)
            return this.data.entrant1Score < this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
        else throw new Error('No data to get Set property Loser Score');
    }

    getBracketId(){
        if(this.data)
            return this.data.bracketId;
        else throw new Error('No data to get Set property Bracket ID');
    }

    getMidsizeRoundText(){
        if(this.data)
            return this.data.midRoundText;
        else throw new Error('No data to get Set property Midsize Round Text');
    }

    getPhaseGroupId(){
        if(this.data)
            return this.data.phaseGroupId;
        else throw new Error('No data to get Set property Phase Group Id');
    }

    getWinnersTournamentPlacement(){
        return this.WinnerPlayer.getFinalPlacement();
    }

    getLosersTournamentPlacement(){
        return this.LoserPlayer.getFinalPlacement();
    }

}

module.exports = Set;