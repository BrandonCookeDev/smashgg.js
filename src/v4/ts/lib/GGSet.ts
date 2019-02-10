import _ from 'lodash'
import moment from 'moment-timezone'
import {EventEmitter} from 'events'

import {Game, IGame} from './Game' // TODO change to internal later 
import log from './util/Logger'

import NI from './util/NetworkInterface'
import * as queries from './scripts/setQueries'

import {Attendee, IAttendee} from './Attendee'
import {Entrant, IEntrant} from './Entrant'

const API_URL = 'https://api.smash.gg/set/%s';
const DISPLAY_SCORE_REGEX = new RegExp(/^([\S\s]*) ([0-9]{1,3}) - ([\S\s]*) ([0-9]{1,3})$/);

export class GGSet extends EventEmitter implements IGGSet.GGSet{

	id: number
	eventId: number
	phaseGroupId: number
	displayScore: string 
	fullRoundText: string
	round: number
	startedAt: number | null
	completedAt: number | null
	winnerId: number | null
	totalGames: number | null
	state: number | null
	player1: IGGSet.PlayerLite
	player2: IGGSet.PlayerLite
	score1: number | null
	score2: number | null

	constructor(
		id: number,
		eventId: number,
		phaseGroupId: number,
		displayScore: string ,
		fullRoundText: string,
		round: number,
		startedAt: number | null,
		completedAt: number | null,
		winnerId: number | null,
		totalGames: number | null,
		state: number | null,
		player1: IGGSet.PlayerLite,
		player2: IGGSet.PlayerLite,
		score1: number | null,
		score2: number | null
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
		const DISPLAY_SCORE_REGEX = new RegExp(/^([\S\s]*) ([0-9]{1,3}) - ([\S\s]*) ([0-9]{1,3})$/);
		let parsed = DISPLAY_SCORE_REGEX.exec(displayScore);
		let tag1, score1, tag2, score2;
		if(parsed){
			tag1 = parsed[1]
			score1 = +parsed[2]
			tag2 = parsed[3]
			score2 = +parsed[4]
		}
		return {
			tag1: tag1 || null,
			tag2: tag2 || null,
			score1: score1 || 0,
			score2: score2 || 0
		}
	}

	static async get(id: number | string) : Promise<GGSet> {
		log.info('Getting set with id %s', id);
		let data: IGGSet.Data = await NI.query(queries.set, {id: id.toString()})
		return GGSet.parseFull(data)
	}

	static parse(data: IGGSet.SetData) : GGSet{
		let displayScoreParsed = GGSet.parseDisplayScore(data.displayScore);
		let p1 = IGGSet.PlayerLite.parse(displayScoreParsed.tag1, data.slots[0])
		let p2 = IGGSet.PlayerLite.parse(displayScoreParsed.tag2, data.slots[1])
		return new GGSet(
			+data.id,
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

	static parseFull(data: IGGSet.Data) : GGSet {
		return GGSet.parse(data.set)
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

	getRound() : number{
		return this.round
	}

	getState() : number | null{
		return this.state
	}

	getPlayer1() : IGGSet.PlayerLite {
		return this.player1
	}

	getPlayer1Tag() : string | null {
		return this.player1.tag
	}

	getPlayer1AttendeeIds() : number[] | null {
		return this.player1.attendeeIds
	}

	getPlayer1PlayerId() : number | null {
		return this.player1.entrantId
	}

	getPlayer2() : IGGSet.PlayerLite {
		return this.player2
	}

	getPlayer2Tag() : string | null {
		return this.player2.tag
	}

	getPlayer2AttendeeIds() : number[] | null {
		return this.player2.attendeeIds
	}

	getPlayer2PlayerId() : number | null {
		return this.player2.entrantId
	}

	getStartedAtTimestamp() : number | null {
		return this.startedAt
	}

	getCompletedAtTimestamp(): number | null {
		return this.completedAt
	}

	// Todo needs coverage
	getStartedAt() : Date | null {
		if(this.startedAt)	
			return moment.unix(this.startedAt).toDate();
		else return null
	}

	getCompletedAt() : Date | null {
		if(this.completedAt)
			return moment.unix(this.completedAt).toDate();
		else return null
	}
	
	// calculated
	getWinnerId() : number | null{
		return this.winnerId ? this.winnerId : null
	}

	getLoserId() : number | null{
		switch(this.winnerId){
		case this.player1.entrantId:
			return this.player2.entrantId ? this.player2.entrantId : null
		case this.player2.entrantId:
			return this.player1.entrantId ? this.player1.entrantId : null
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

	getWinner() : IGGSet.PlayerLite | undefined {
		if(this.winnerId && this.player2.entrantId && this.player1.entrantId)
			switch(this.winnerId){
			case this.player1.entrantId:
				return this.player1
			case this.player2.entrantId:
				return this.player2
			default:
				throw new Error(`Winner ID ${this.winnerId} does not match either player ID: [${[this.player1.entrantId, this.player2.entrantId].join(',')}]`)
			}
		else throw new Error(`Set (${this.id}) must be complete to get the Winning Player`);
	}

	getLoser() : IGGSet.PlayerLite | undefined {
		if(this.winnerId && this.player1.entrantId && this.player2.entrantId)
			switch(this.winnerId){
			case this.player1.entrantId:
				return this.player2
			case this.player2.entrantId:
				return this.player1
			default:
				throw new Error(`Loser ID does not match either player ID: [${[this.player1.entrantId, this.player2.entrantId].join(',')}]`)
			}
		else throw new Error(`Set (${this.id}) must be complete to get the Losing Player`);
	}

	getBestOfCount() : number {
		return this.totalGames || 0
	}

	getWinnerScore() : number {
		if(!this.completedAt)
			throw new Error('Cannot get winner score of incomplete set')
		else if(this.score1 == null || this.score2 == null){
			if(this.score1 == null) return this.score2!
			else return this.score2!
		 }
		 else return this.score1 > this.score2 ? this.score1 : this.score2
	}

	getLoserScore() : number {
		if(!this.completedAt)
			throw new Error('Cannot get loser score of incomplete set')
		else if(this.score1 == null || this.score2 == null)
			return 0
		else return this.score1 < this.score2 ? this.score1 : this.score2
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
		log.info('Gettings Games for set (%s)', this.id)
		let data: IGame.Data = await NI.query(queries.games, {id: this.id});
		return Game.parseFull(data)
	}

	async getAttendees() : Promise<Attendee[]> {
		log.info('Getting Attendees who participated in Set [%s]', this.id)
		let data: IGGSet.SlotAttendeeEntrantData = await NI.query(queries.attendees, {id: this.id})
		let entrants = data.set.slots.map(slot => slot.entrant).filter(entrant => entrant != null)
		let participants = _.flatten(entrants.map(entrant => entrant!.participants)).filter(participant => participant != null)
		let attendees: Attendee[] = participants.map(participant => Attendee.parse(participant!))
		return attendees
	}

	async getEntrants() : Promise<Entrant[]> {
		log.info('Getting Entrants who participated in Set [%s]', this.id)
		let data: IGGSet.SlotEntrantData = await NI.query(queries.entrants, {id: this.id})
		let entrantData = data.set.slots.map(slot => slot.entrant).filter(entrant => entrant != null)
		let entrants = entrantData.map(entrant => Entrant.parse(entrant!))
		return entrants
	}
	
	// Statics
	static filterOutDQs(sets: GGSet[]) : GGSet[]{
		log.debug('GGSet.filterOutDQs called')
		let displayScores = sets.map(set => set.displayScore)
		return displayScores.includes('DQ') ? sets.filter(set => set.displayScore != 'DQ') : sets
	}

	static filterOutByes(sets: GGSet[]) : GGSet[]{
		log.debug('GGSet.filterOutByes called')
		let displayScores = sets.map(set => set.displayScore)
		return displayScores.includes('BYE') ? sets.filter(set => set.displayScore != 'BYE') : sets
	}

	static filterOutResets(sets: GGSet[]) : GGSet[]{
		log.debug('GGSet.filterOutResets called')
		let fullRoundTexts = sets.map(set => set.fullRoundText)
		return fullRoundTexts.includes('Grand Final Reset') ? sets.filter(set => set.fullRoundText !== 'Grand Final Reset') : sets
	}

	static filterForCompleteSets(sets: GGSet[]) : GGSet[]{
		log.debug('GGSet.filterForCompleteSets called');
		return sets.filter(set => set.getIsComplete());
	}

	static filterForIncompleteSets(sets: GGSet[]) : GGSet[]{
		log.debug('GGSet.filterForCompleteSets called');
		return sets.filter(set => !set.getIsComplete());
	}

	static filterForXMinutesBack(sets: GGSet[], minutesBack: number) : GGSet[]{
		log.debug('GGSet.filterForCompleteSets called');

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
	}
}

export namespace IGGSet{

	export class PlayerLite{
		tag: string | null
		entrantId: number | null
		attendeeIds: number[]

		constructor(tag: string | null, entrantId: number | null, attendeeIds: number[] | []){
			this.tag = tag;
			this.entrantId = entrantId;
			this.attendeeIds = attendeeIds;
		}

		static parse(tag: string | null, slot: Slots){

			let entrantId = slot.entrant ? slot.entrant.id : null
			let attendeeIds = slot.entrant ? slot.entrant.participants.map(p => p.id) : []

			return new PlayerLite(
				tag,
				entrantId,
				attendeeIds
			)
		}
	}

	export interface GGSet{
		
		id: number
		eventId: number
		phaseGroupId: number
		displayScore: string 
		fullRoundText: string
		round: number
		startedAt: number | null
		completedAt: number | null
		winnerId: number | null
		totalGames: number | null
		state: number | null
		player1: IGGSet.PlayerLite
		player2: IGGSet.PlayerLite
		score1: number | null
		score2: number | null
		
		getEventId() : number
		getPhaseGroupId() : number
		getStartedAt() : Date | null 
		getCompletedAt() : Date | null 
		getDisplayScore() : string
		getFullRoundText() : string
		getRound() : number
		getState() : number | null
		getPlayer1() : PlayerLite | undefined | null
		getPlayer1Tag() : string | undefined | null
		getPlayer1PlayerId() : number | undefined | null
		getPlayer1AttendeeIds() : number[] | undefined | null
		getPlayer2() : PlayerLite | undefined | null
		getPlayer2Tag() : string | undefined | null
		getPlayer2PlayerId() : number | undefined | null
		getPlayer2AttendeeIds() : number[] | undefined | null
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
		set: SetData
	}

	export interface DataWithGames{
		set: {
			games: IGame.GameData[]
		}
	}

	export interface SetData{
		id: string
		eventId: number
		phaseGroupId: number
		displayScore: string
	  	fullRoundText: string
		round: number
		startedAt: number | null
		completedAt: number | null
		winnerId: number | null
		totalGames: number | null
		state: number | null
		slots: Slots[]
	}

	export interface Slots{
		id: string
		entrant: {
			id: number
			name: string
			participants: {
				id: number
			}[]
		}
	}

	export interface SlotEntrantData{
		set:{
			slots: ({
				entrant: IEntrant.EntrantData | null
			})[]
		}
	}

	export interface SlotAttendeeEntrantData{
		set:{
			slots: ({
				entrant: SlotAttendeeData | null
			})[]
		}
	}

	export interface SlotAttendeeData{
		participants: (IAttendee.AttendeeData | null)[]
	}

	export interface SetOptions{
		filterDQs?: boolean,
		filterByes?: boolean,
		filterResets?: boolean,
		page?: number | null,
		perPage?: number | null,
		sortBy?: null | 'NONE' | 'STANDARD' | 'RACE_SPECTATOR' | 'ADMIN',
		filters?: null | {
			entrantIds?: number[],
			state?: number[],
			stationIds?: number[],
			phaseIds?: number[],
			phaseGroupIds?: number[],
			roundNumber?: number
		}
	}

	export function getDefaultSetOptions() : SetOptions{
		return {
			page: 1,
			perPage: 1,
			sortBy: null,
			filters: null
		}
	}
}