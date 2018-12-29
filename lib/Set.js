'use strict';

let _ = require('lodash');
let log = require('winston');
let {format} = require('util');
let moment = require('moment');
let EventEmitter = require('events');
let request = require('request-promise');
let Cache = require('./util/Cache');

let Player = require('./Player');
let API_URL = 'https://api.smash.gg/set/%s';

class Set extends EventEmitter{

	constructor(id, eventId, round, player1, player2, isComplete=false, score1=0, score2=0, winnerId, loserId, data){
		super();

		if(!id)
			throw new Error('Id for Set cannot be null');
		if(!eventId)
			throw new Error('Event Id for Set cannot be null');
		if(!round)
			throw new Error('Round for Set cannot be null');
		if(!player1 && !(player1 instanceof Player))
			throw new Error('Winner Player for Set cannot be null, and must be an instance of Player');
		if(!player2 && !(player2 instanceof Player))
			throw new Error('Loser Player for Set cannot be null, and must be an instance of Player');

		this.id = id;
		this.eventId = eventId;
		this.round = round;
		this.player1 = player1;
		this.player2 = player2;
		this.score1 = score1;
		this.score2 = score2;
		this.isComplete = isComplete;
		this.winnerId = winnerId;
		this.loserId = loserId;

		this.data = data;
	}

	loadData(data){
		this.data = data;
	}

	static async getSet(id, options={}){
		log.verbose('Set getSet called');
		try{
			// parse options
			let isCached = options.isCached != undefined ? isCached == true : true;

			let cacheKey = format('set::%s', id);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey);
				if(cached) return cached;
			}

			let req = {
				uri: format(API_URL, id),
				headers:{
					'X-SOURCE': 'smashgg.js'
				},
				method: 'GET'
			};

			let resp = JSON.parse(await request(req));
			let set = Set.resolve(resp);

			await Cache.getInstance().set(cacheKey, set);
			return set;

		} catch(e){
			log.error('Set getSet error: %s', e);
			throw e;
		}
	}

	
	static async resolve(data){
		log.verbose('Set resolve called');
		try{
			let PhaseGroup = require('./PhaseGroup');
			let set = data.entities.sets;
			let group = await PhaseGroup.getPhaseGroup(set.phaseGroupId);
			let groupParticipants = await group.getPlayers();

			if (!set.entrant1Id || !set.entrant2Id)
				return null; // HANDLES BYES

			let Player1 = _.find(groupParticipants, {'participantId': set.entrant1Id});
			let Player2 = _.find(groupParticipants, {'participantId': set.entrant2Id});

			if (!Player1 || !Player2)
				return null; // HANDLES Error of some sort

			let isComplete = false;
			if(set.winnerId && set.loserId)
				isComplete = true;

			let S;
			if(isComplete)
				S = new Set(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, set.entrant1Score, set.entrant2Score, set.winnerId, set.loserId);
			else
				S = new Set(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete);
			
			S.loadData(set);
			return S;
		} catch(e){
			log.error('Set resolve error: %s', e);
			throw e;
		}
	}
	

	getRound(){
		return this.round;
	}

	getPlayer1(){
		return this.player1;
	}

	getPlayer2(){
		return this.player2;
	}
	
	getWinnerId(){
		return this.winnerId;
	}

	getLoserId(){
		return this.loserId;
	}

	getIsComplete(){
		return this.isComplete;
	}

	getPlayer1Score(){
		return this.score1;
	}

	getPlayer2Score(){
		return this.score2;
	}

	getWinner(){
		if(this.winnerId)
			return this.player1.id == this.winnerId ? this.player1 : this.player2;
		else throw new Error('Set must be complete to get the Winning Player');
	}

	getLoser(){
		if(this.loserId)
			return this.player1.id == this.loserId ? this.player1 : this.player2;
		else throw new Error('Set must be complete to get the Losing Player');
	}

	getGames(){
		if(this.data)
			return this.data.games || this.nullValueString('Games');
		else throw new Error('No data to get Set property Games');
	}

	getBestOfCount(){
		if(this.data)
			return this.data.bestOf || this.nullValueString('Best-Of Count');
		else throw new Error('No data to get Set property Best-Of Count');
	}

	getWinnerScore(){
		if(this.data && this.isComplete)
			return this.data.entrant1Score > this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
		else throw new Error('No data to get Set property Winner Score');
	}

	getLoserScore(){
		if(this.data && this.isComplete)
			return this.data.entrant1Score < this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
		else throw new Error('No data to get Set property Loser Score');
	}

	getBracketId(){
		if(this.data)
			return this.data.bracketId || this.nullValueString('Bracket ID');
		else throw new Error('No data to get Set property Bracket ID');
	}

	getMidsizeRoundText(){
		if(this.data)
			return this.data.midRoundText || this.nullValueString('Midsize Round Text');
		else throw new Error('No data to get Set property Midsize Round Text');
	}

	getPhaseGroupId(){
		if(this.data)
			return this.data.phaseGroupId || this.nullValueString('Phase Group Id');
		else throw new Error('No data to get Set property Phase Group Id');
	}

	getWinnersTournamentPlacement(){
		if(this.isComplete)
			return this.getWinner().getFinalPlacement() || this.nullValueString('Winner Tournament Placement');
		else throw new Error('Set must be complete to get Winner\'s tournament placement');
	}

	getLosersTournamentPlacement(){
		if(this.isComplete)
			return this.getLoser().getFinalPlacement() || this.nullValueString('Loser Tournament Placement');
		else throw new Error('Set must be complete to get Loser\'s tournament placement');
	}

	// Todo needs coverage
	getStartedAt(){
		return moment.unix(this.data.startedAt).toDate();
	}

	// Todo needs coverage
	getCompletedAt(){
		return moment.unix(this.data.completedAt).toDate();
	}

	/** NULL VALUES **/
	nullValueString(prop){
		return prop + ' not available for Set ' + this.id;
	}

}

Set.prototype.toString = function(){
	return 'Set: ' + 
		'\nID: ' + this.id + 
		'\nEvent ID: ' + this.eventId + 
		'\nRound: ' + this.round + 
		'\nPlayer1: ' + this.Player1 + 
		'\nPlayer2: ' + this.Player2 + 
		'\nIs Complete: ' + this.isComplete + 
		'\nPlayer1 Score: ' + this.score1 + 
		'\nPlayer2 Score: ' + this.score2 + 
		'\nWinner ID: ' + this.winnerId + 
		'\nLoser ID: ' + this.loserId;
};

module.exports = Set;