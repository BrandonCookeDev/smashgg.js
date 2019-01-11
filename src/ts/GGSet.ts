import _ from 'lodash'
import log from 'winston'
import {format} from 'util'
import moment from 'moment-timezone'
import {EventEmitter} from 'events'
import request from 'request-promise'
import Cache from './util/Cache'

import { ICommon } from './util/Common'
import {PhaseGroup, Player} from './internal' 

import Entity = IGGSet.Entity
import Options = ICommon.Options
import parseOptions = ICommon.parseOptions

const API_URL = 'https://api.smash.gg/set/%s';

export class GGSet extends EventEmitter implements IGGSet.GGSet{

	id: number
	eventId: number
	round: string
	player1?: Player
	player2?: Player
	isComplete: boolean
	score1?: number
	score2?: number
	winnerId?: number
	loserId?: number
	data?: Entity

	constructor(id: number, eventId: number, round: string, 
			player1: Player, player2: Player, isComplete: boolean=false, 
			score1: number=0, score2: number=0, winnerId: number=0, 
			loserId: number=0, data: Entity){
		super();

		if(!id)
			throw new Error('Id for Set cannot be null');
		if(!eventId)
			throw new Error('Event Id for Set cannot be null');
		if(!round)
			throw new Error('Round for Set cannot be null');

		//if(!player1 && !(player1 instanceof Player))
		//	throw new Error('Winner Player for Set cannot be null, and must be an instance of Player');
		//if(!player2 && !(player2 instanceof Player))
		//	throw new Error('Loser Player for Set cannot be null, and must be an instance of Player');

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

	loadData(data: Entity) : void{
		this.data = data;
	}

	static async getSet(id: number, options: Options={}) : Promise<GGSet> {
		log.verbose('Set getSet called');
		try{
			// parse options
			options = parseOptions(options);

			let cacheKey: string = format('set::%s', id);
			if(options.isCached){
				let cached = await Cache.get(cacheKey);
				if(cached) return cached;
			}

			let req = {
				uri: format(API_URL, id),
				headers:{
					'X-SOURCE': 'smashgg.js'
				},
				method: 'GET'
			};

			let resp: Entity = JSON.parse(await request(req));
			let set: GGSet = await GGSet.resolve(resp);

			await Cache.set(cacheKey, set);
			return set;

		} catch(e){
			log.error('Set getSet error: %s', e);
			throw e;
		}
	}

	
	static async resolve(data: Entity) : Promise<GGSet> {
		log.verbose('Set resolve called');
		try{
			let isBye = false
			let set = data.entities.sets;
			let group = await PhaseGroup.getPhaseGroup(set.phaseGroupId);
			let groupParticipants = await group.getPlayers();

			if (!set.entrant1Id || !set.entrant2Id)
				isBye = true; // HANDLES BYES

			let Player1 = _.find(groupParticipants, {'participantId': set.entrant1Id}) as Player;
			let Player2 = _.find(groupParticipants, {'participantId': set.entrant2Id}) as Player;

			if (!Player1 || !Player2)
				throw new Error('Unknown error occured in Player.resolve'); // HANDLES Error of some sort

			let isComplete = false;
			if(set.winnerId && set.loserId)
				isComplete = true;

			let S;
			if(isBye)
				S = new GGSet(set.id, set.eventId, 'BYE', Player1, Player2, isComplete, undefined, undefined, undefined, undefined, data)
			else if(isComplete)
				S = new GGSet(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, set.entrant1Score, set.entrant2Score, set.winnerId, set.loserId, data);
			else
				S = new GGSet(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, undefined, undefined, undefined, undefined, data);
			
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

	getPlayer1() : Player | null {
		if(this.player1)
			return this.player1;
		else return null
	}

	getPlayer2() : Player | null {
		if(this.player2)
			return this.player2;
		else return null
	}
	
	getWinnerId() : number | null{
		if(this.winnerId)
			return this.winnerId;
		else return null
	}

	getLoserId() : number | null{
		if(this.loserId)
			return this.loserId;
		else return null
		
	}

	getIsComplete() : boolean | null{
		return this.isComplete;
	}

	getPlayer1Score() : number | null{
		if(this.score1)
			return this.score1;
		else return null
	}

	getPlayer2Score() : number | null{
		if(this.score2)
			return this.score2;
		else return null
	}

	getWinner() : Player | undefined {
		if(this.winnerId && this.loserId && this.player1 && this.player2)
			return this.player1.id == this.winnerId ? this.player1 : this.player2;
		else throw new Error('Set must be complete to get the Winning Player');
	}

	getLoser() : Player | undefined {
		if(this.winnerId && this.loserId && this.player1 && this.player2)
			return this.player1.id == this.loserId ? this.player1 : this.player2;
		else throw new Error('Set must be complete to get the Losing Player');
	}

	getGames(){
		if(this.data)
			return this.data.games || this.nullValueString('Games');
		else throw new Error('No data to get Set property Games');
	}

	getBestOfCount() : number | string {
		if(this.data)
			return this.data.bestOf || this.nullValueString('Best-Of Count');
		else throw new Error('No data to get Set property Best-Of Count');
	}

	getWinnerScore() : number | string {
		if(this.data && this.isComplete)
			return this.data.entrant1Score > this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
		else throw new Error('No data to get Set property Winner Score');
	}

	getLoserScore() : number | string {
		if(this.data && this.isComplete)
			return this.data.entrant1Score < this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
		else throw new Error('No data to get Set property Loser Score');
	}

	getBracketId() : number | string {
		if(this.data)
			return this.data.bracketId || this.nullValueString('Bracket ID');
		else throw new Error('No data to get Set property Bracket ID');
	}

	getMidsizeRoundText() : string{
		if(this.data)
			return this.data.midRoundText || this.nullValueString('Midsize Round Text');
		else throw new Error('No data to get Set property Midsize Round Text');
	}

	getPhaseGroupId() : number | string {
		if(this.data)
			return this.data.phaseGroupId || this.nullValueString('Phase Group Id');
		else throw new Error('No data to get Set property Phase Group Id');
	}

	getWinnersTournamentPlacement() : number | string{
		let winner = this.getWinner()
		if(winner && this.isComplete)
			return winner.getFinalPlacement() || this.nullValueString('Winner Tournament Placement');
		else throw new Error('Set must be complete to get Winner\'s tournament placement');
	}

	getLosersTournamentPlacement() : number | string{
		let loser = this.getLoser()
		if(loser && this.isComplete)
			return loser.getFinalPlacement() || this.nullValueString('Loser Tournament Placement');
		else throw new Error('Set must be complete to get Loser\'s tournament placement');
	}

	// Todo needs coverage
	getStartedAt() : Date | null {
		if(this.data && this.data.startedAt)	
			return moment.unix(this.data.startedAt).toDate();
		else return null
	}

	// Todo needs coverage
	getCompletedAt() : Date | null {
		if(this.data && this.data.completedAt)
			return moment.unix(this.data.completedAt).toDate();
		else return null
	}

	/** NULL VALUES **/
	nullValueString(prop: string) : string{
		return prop + ' not available for Set ' + this.id;
	}

}

GGSet.prototype.toString = function(){
	return 'Set: ' + 
		'\nID: ' + this.id + 
		'\nEvent ID: ' + this.eventId + 
		'\nRound: ' + this.round + 
		'\nPlayer1: ' + this.player1 + 
		'\nPlayer2: ' + this.player2 + 
		'\nIs Complete: ' + this.isComplete + 
		'\nPlayer1 Score: ' + this.score1 + 
		'\nPlayer2 Score: ' + this.score2 + 
		'\nWinner ID: ' + this.winnerId + 
		'\nLoser ID: ' + this.loserId;
};

export namespace IGGSet{

	export interface GGSet{
		id: number
		eventId: number
		round: string
		player1?: Player
		player2?: Player
		isComplete: boolean
		score1?: number
		score2?: number
		winnerId?: number
		loserId?: number
		data?: Entity

		//getSet(id: number, options: ICommon.Options) : Promise<GGSet>
		//resolve(data: Entity) : Promise<GGSet>
		
		getRound() : string
		getPlayer1() : Player | null
		getPlayer2() : Player | null
		getWinnerId() : number | null
		getLoserId() : number | null
		getIsComplete() : boolean | null
		getPlayer1Score() : number | null
		getPlayer2Score() : number | null
		getWinner() : Player | undefined
		getLoser() : Player | undefined
		getGames() : number | string
		getBestOfCount() : number | string
		getWinnerScore() : number | string
		getLoserScore() : number | string
		getBracketId() : number | string 
		getMidsizeRoundText() : string
		getPhaseGroupId() : number | string
		getWinnersTournamentPlacement() : number | string
		getLosersTournamentPlacement() : number | string
		getStartedAt() : Date | null 
		getCompletedAt() : Date | null 
		nullValueString(prop: string) : string
	}

	export interface Data{
		entities: [Entity]
	}

	export interface Entity{
		id: number,
		eventId: number,
		fullRoundText: string,
		entrant1Score: number,
		entrant2Score: number,
		entrant1Id?: number,
		entrant2Id?: number,
		winnerId?: number,
		loserId?: number,
		startedAt?: number,
		completedAt?: number,
		[x: string]: any
	}
}