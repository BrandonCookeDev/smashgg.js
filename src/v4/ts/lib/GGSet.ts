import _ from 'lodash'
import {format} from 'util'
import moment from 'moment-timezone'
import {EventEmitter} from 'events'
import request from 'request-promise'
import Cache from './util/Cache'

import { ICommon } from './util/Common'
import {PhaseGroup, Player, Attendee, Game, IGame} from './internal' 
import log from './util/Logger'

import NI from './util/NetworkInterface'
import * as queries from './scripts/setQueries'

import Options = ICommon.Options
import parseOptions = ICommon.parseOptions
import PlayerLite = IGGSet.PlayerLite

const API_URL = 'https://api.smash.gg/set/%s';
const DISPLAY_SCORE_REGEX = new RegExp(/^[\S\s]* [0-9]{1,3} - [0-9]{1,3} [\S\s]*$/);

export class GGSet extends EventEmitter implements IGGSet.GGSet{

	/*
	id: number
	eventId: number
	round: string
	player1: IGGSet.PlayerLite
	player2: IGGSet.PlayerLite
	isComplete: boolean
	score1?: number
	score2?: number
	winnerId?: number
	loserId?: number
	data?: IGGSet.SetData
	*/

	id: number
	eventId: number
	phaseGroupId: number
	displayScore: string 
	fullRoundText: string
	round: string
	startedAt: number
	completedAt: number
	winnerId: number
	totalGames: number
	state: number
	player1: IGGSet.PlayerLite
	player2: IGGSet.PlayerLite
	score1: number
	score2: number

	constructor(
		id: number,
		eventId: number,
		phaseGroupId: number,
		displayScore: string ,
		fullRoundText: string,
		round: string,
		startedAt: number,
		completedAt: number,
		winnerId: number,
		totalGames: number,
		state: number,
		player1: IGGSet.PlayerLite,
		player2: IGGSet.PlayerLite,
		score1: number,
		score2: number
	){
		super();

		this.id =id 
		this.eventId = eventId 
		this.phaseGroupId = phaseGroupId
		this.displayScore =	displayScore 
		this.fullRoundText = fullRoundText 
		this.round = round 
		this.startedAt = startedAt 
		this.completedAt = completedAt 
		this.winnerId =	winnerId 
		this.totalGames = totalGames
		this.state = state 
		this.player1 = player1
		this.player2 = player2
		this.score1 = score1 
		this.score2 = score2 
	}

	static parseDisplayScore(displayScore: string){
		const DISPLAY_SCORE_REGEX = new RegExp(/^[\S\s]* [0-9]{1,3} - [0-9]{1,3} [\S\s]*$/);
		let parsed = DISPLAY_SCORE_REGEX.exec(displayScore);
		let tag1, score1, tag2, score2;
		if(parsed){
			tag1 = parsed[1]
			score1 = +parsed[2]
			score2 = +parsed[3]
			tag2 = parsed[4]
		}
		return {
			tag1: tag1,
			tag2: tag2,
			score1: score1 || 0,
			score2: score2 || 0
		}
	}

	static async get(id: number) : Promise<GGSet> {
		let data: IGGSet.Data = await NI.query(queries.set, {id: id})
		let parsed: GGSet[] = GGSet.parseFull(data)
		return parsed[0]
	}

	static parse(data: IGGSet.SetData) : GGSet{
		let displayScoreParsed = GGSet.parseDisplayScore(data.displayScore);
		let p1 = new IGGSet.PlayerLite(displayScoreParsed.tag1, data.slots[0].id, data.slots[0].entrant.id)
		let p2 = new IGGSet.PlayerLite(displayScoreParsed.tag2, data.slots[1].id, data.slots[1].entrant.id)
		return new GGSet(
			data.id,
			data.eventId,
			data.phaseGroupId,
			data.displayScore,
			data.fullRoundText,
			data.round,
			data.startedAt,
			data.completedAt,
			data.winnerId,
			data.totalGames,
			data.state,
			p1,
			p2,
			displayScoreParsed.score1,
			displayScoreParsed.score2
		)
	}

	static parseFull(data: IGGSet.Data) : GGSet[] {
		return data.paginatedSets.nodes.map(setNode => GGSet.parse(setNode))
	}

	/** Instance Based **/

	// simple
	getEventId() : number { 
		return this.eventId
	}

	getPhaseGroupId() : number {
		return this.phaseGroupId
	}

	getDisplayScore() : string{
		return this.displayScore
	}

	getFullRoundText() : string{
		return this.fullRoundText
	}

	getRound() : string{
		return this.round
	}

	getState() : number{
		return this.state
	}

	getPlayer1() : IGGSet.PlayerLite {
		return this.player1
	}

	getPlayer1Tag() : string | undefined {
		return this.player1.tag
	}

	getPlayer1AttendeeId() : number | undefined {
		return this.player1.attendeeId
	}

	getPlayer1PlayerId() : number | undefined {
		return this.player1.playerId
	}

	getPlayer2() : IGGSet.PlayerLite {
		return this.player2
	}

	getPlayer2Tag() : string | undefined {
		return this.player2.tag
	}

	getPlayer2AttendeeId() : number | undefined {
		return this.player2.attendeeId
	}

	getPlayer2PlayerId() : number | undefined {
		return this.player2.playerId
	}
	
	// calculated
	getWinnerId() : number | null{
		return this.winnerId ? this.winnerId : null
	}

	getLoserId() : number | null{
		switch(this.winnerId){
		case this.player1.playerId:
			return this.player2.playerId ? this.player2.playerId : null
		case this.player2.playerId:
			return this.player1.playerId ? this.player1.playerId : null
		default:
			return null
		}
	}

	getIsComplete() : boolean | null{
		return this.completedAt ? true : false;
	}

	getCompletedTime() : Date | null{
		if(this.completedAt)
			return moment.unix(this.completedAt).toDate()
		else return null
	}

	getPlayer1Score() : number | null{
		if(this.score1)
			return this.score1;
		else return 0
	}

	getPlayer2Score() : number | null{
		if(this.score2)
			return this.score2;
		else return 0
	}

	getWinner() : PlayerLite | undefined {
		if(this.winnerId && this.player2.playerId && this.player1.playerId)
			switch(this.winnerId){
			case this.player1.playerId:
				return this.player1
			case this.player2.playerId:
				return this.player2
			default:
				throw new Error(`Winner ID ${this.winnerId} does not match either player ID: [${[this.player1.playerId, this.player2.playerId].join(',')}]`)
			}
		else throw new Error(`Set (${this.id}) must be complete to get the Winning Player`);
	}

	getLoser() : PlayerLite | undefined {
		if(this.winnerId && this.player1.playerId && this.player2.playerId)
			switch(this.winnerId){
			case this.player1.playerId:
				return this.player2
			case this.player2.playerId:
				return this.player1
			default:
				throw new Error(`Loser ID does not match either player ID: [${[this.player1.playerId, this.player2.playerId].join(',')}]`)
			}
		else throw new Error(`Set (${this.id}) must be complete to get the Losing Player`);
	}

	getBestOfCount() : number {
		return this.totalGames || 0
	}

	getWinnerScore() : number | string {
		if(this.completedAt && this.score1 && this.score2)
			return this.score1 > this.score2 ? this.score1 : this.score2;
		else throw new Error('No data to get Set property Winner Score');
	}

	getLoserScore() : number | string {
		if(this.completedAt && this.score1 && this.score2)
			return this.score1 < this.score2 ? this.score1 : this.score2;
		else throw new Error('No data to get Set property Loser Score');
	}

	// Todo needs coverage
	getStartedAt() : Date | null {
		if(this.startedAt)	
			return moment.unix(this.startedAt).toDate();
		else return null
	}

	// Todo needs coverage
	getCompletedAt() : Date | null {
		if(this.completedAt)
			return moment.unix(this.completedAt).toDate();
		else return null
	}

	// deprecated
	/*
	getBracketId() : number | string {
		if(this.data)
			return this.data.bracketId || this.nullValueString('Bracket ID');
		else throw new Error('No data to get Set property Bracket ID');
	}

	// deprecated
	getMidsizeRoundText() : string{
		if(this.data)
			return this.data.midRoundText || this.nullValueString('Midsize Round Text');
		else throw new Error('No data to get Set property Midsize Round Text');
	}
	*/


	// deprecated for the time being
	/*
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
	*/

	// Aggregation
	async getGames() : Promise<Game[]> {
		let data: IGame.Data = await NI.query(queries.games, {id: this.id});
		return Game.parseFull(data)
	}
	
	// Statics

	static filterForCompleteSets(sets: GGSet[]) : GGSet[]{
		log.debug('GGSet.filterForCompleteSets called');

		try{
			return sets.filter(set => set.getIsComplete());
		} catch(e){
			log.error('GGSet.filterForCompleteSets error: %s', e);
			throw e;
		}
	}

	static filterForIncompleteSets(sets: GGSet[]) : GGSet[]{
		log.debug('GGSet.filterForCompleteSets called');

		try{
			return sets.filter(set => !set.getIsComplete());
		} catch(e){
			log.error('GGSet.filterForCompleteSets error: %s', e);
			throw e;
		}
	}

	static filterForXMinutesBack(sets: GGSet[], minutesBack: number) : GGSet[]{
		log.debug('GGSet.filterForCompleteSets called');

		try{
			let now = moment();
			let filtered: GGSet[] = sets.filter(set => {
				let then = moment(set.getCompletedAt() as Date);
				let diff = moment.duration(now.diff(then));

				let diffMinutes = diff.minutes();
				if(diff.hours() > 0 || diff.days() > 0 || diff.months() > 0 || diff.years() > 0) 
					return false;
				else 
					return diffMinutes <= minutesBack && diffMinutes >= 0 && set.getIsComplete();
			});
			return filtered;
		} catch(e){
			log.error('GGSet.filterForCompleteSets error: %s', e);
			throw e;
		}
	}
}

GGSet.prototype.toString = function(){
	return 'Set: ' + 
		'\nID: ' + this.id + 
		'\nEvent ID: ' + this.eventId + 
		'\nRound: ' + this.round + 
		'\nPlayer1: ' + this.player1 + 
		'\nPlayer2: ' + this.player2 + 
		'\nIs Complete: ' + this.getIsComplete() + 
		'\nPlayer1 Score: ' + this.score1 + 
		'\nPlayer2 Score: ' + this.score2 + 
		'\nWinner ID: ' + this.winnerId + 
		'\nLoser ID: ' + this.getLoserId();
};

export namespace IGGSet{

	export class PlayerLite{
		tag?: string
		playerId?: number
		attendeeId?: number

		constructor(tag?: string, playerId?: number, attendeeId?: number){
			this.tag = tag;
			this.playerId = playerId;
			this.attendeeId = attendeeId;
		}

	}

	export interface GGSet{
		
		id: number
		eventId: number
		phaseGroupId: number
		displayScore: string 
		fullRoundText: string
		round: string
		startedAt: number
		completedAt: number
		winnerId: number
		totalGames: number
		state: number
		player1: IGGSet.PlayerLite
		player2: IGGSet.PlayerLite
		score1: number
		score2: number
		
		getEventId() : number
		getPhaseGroupId() : number
		getStartedAt() : Date | null 
		getCompletedAt() : Date | null 
		getDisplayScore() : string
		getFullRoundText() : string
		getRound() : string
		getState() : number
		getPlayer1() : PlayerLite | undefined
		getPlayer1Tag() : string | undefined
		getPlayer1PlayerId() : number | undefined
		getPlayer1AttendeeId() : number | undefined
		getPlayer2() : PlayerLite | undefined
		getPlayer2Tag() : string | undefined
		getPlayer2PlayerId() : number | undefined
		getPlayer2AttendeeId() : number | undefined
		getWinnerId() : number | null
		getLoserId() : number | null
		getIsComplete() : boolean | null
		getCompletedTime(): Date | null
		getPlayer1Score() : number | null
		getPlayer2Score() : number | null
		getWinner() : PlayerLite | undefined
		getLoser() : PlayerLite | undefined
		getBestOfCount() : number | string
		getWinnerScore() : number | string
		getLoserScore() : number | string
		//getBracketId() : number | string 
		//getMidsizeRoundText() : string
		//getWinnersTournamentPlacement() : number | string
		//getLosersTournamentPlacement() : number | string

		getGames() : Promise<Game[]>
	}

	export interface Data{
		paginatedSets: {
			nodes: SetData[]
		}
	}

	export interface SetData{
		id: number
		eventId: number
		phaseGroupId: number
		displayScore: string
	  	fullRoundText: string
		round: string
		startedAt: number
		completedAt: number
		winnerId: number
		totalGames: number
		state: number
		slots: Slots[]
	}

	export interface Slots{
		id: number
		entrant: {
			id: number
			name: string
			participants: {
				id: number
			}
		}
	}
}