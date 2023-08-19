import _ from 'lodash'
import moment from 'moment-timezone'
import {EventEmitter} from 'events'
import log from '../util/Logger'
import NI from '../util/NetworkInterface'
import * as queries from '../scripts/setQueries'

import {
	IGGSet, 
	IGGSetData, 
	IGGSetOptions,
	IGGSetSlots,
	IGGSetDataFull,
	IGGSetSlotAttendeeData,
	IGGSetSlotEntrantData
} from '../interfaces/IGGSet'
import {IPlayerLite} from '../interfaces/IPlayerLite'
import {IGame, IGameDataFull} from '../interfaces/IGame'
import {IAttendee} from '../interfaces/IAttendee'
import {IEntrant} from '../interfaces/IEntrant'

import {Game} from './Game'
import {Attendee} from './Attendee'
import {Entrant} from './Entrant'
import {PlayerLite} from './PlayerLite'

const DISPLAY_SCORE_REGEX = new RegExp(/^([\S\s]*) (\d{1,3}) - ([\S\s]*) (\d{1,3})$/)

export class GGSet extends EventEmitter implements IGGSet{

	public static parseDisplayScore(displayScore: string){
		const parsed = DISPLAY_SCORE_REGEX.exec(displayScore)
		let tag1, score1, tag2, score2
		if(parsed){
			tag1 = parsed[1]
			score1 = +parsed[2]
			tag2 = parsed[3]
			score2 = +parsed[4]
		}
		return {
			tag1: tag1 ?? null,
			tag2: tag2 ?? null,
			score1: score1 ?? 0,
			score2: score2 ?? 0
		}
	}

	public static async get(id: number | string): Promise<IGGSet> {
		log.info('Getting set with id %s', id)
		const data: IGGSetDataFull = await NI.query(queries.set, {id: id.toString()})
		return GGSet.parseFull(data)
	}

	public static parse(data: IGGSetData): IGGSet{
		const displayScoreParsed = GGSet.parseDisplayScore(data.displayScore!)
		const p1 = PlayerLite.parse(displayScoreParsed.tag1, data.slots[0])
		const p2 = PlayerLite.parse(displayScoreParsed.tag2, data.slots[1])
		return new GGSet(
			+data.id,
			data.completedAt,
			data.displayScore,
			data.event,
			data.fullRoundText,
			data.identifier,
			data.phaseGroup,
			data.round,
			data.startedAt,
			data.slots,
			data.state,
			data.totalGames,
			data.winnerId,
			p1,
			p2,
			displayScoreParsed.score1,
			displayScoreParsed.score2
		)
	}

	public static parseFull(data: IGGSetDataFull): IGGSet {
	    return GGSet.parse(data.set)
	}

	public static filterOutDQs(sets: IGGSet[]): IGGSet[]{
		log.debug('GGSet.filterOutDQs called')
		const displayScores = sets.map(set => set.getDisplayScore())
		return displayScores.includes('DQ') ? 
			sets.filter(set => set.getDisplayScore() !== 'DQ') 
			: 
			sets
	}

	public static filterOutByes(sets: IGGSet[]): IGGSet[]{
		log.debug('GGSet.filterOutByes called')
		const displayScores = sets.map(set => set.getDisplayScore())
		return displayScores.includes('BYE') ? 
			sets.filter(set => set.getDisplayScore() !== 'BYE') 
			: 
			sets
	}

	public static filterOutResets(sets: IGGSet[]): IGGSet[]{
		log.debug('GGSet.filterOutResets called')
		const fullRoundTexts = sets.map(set => set.getFullRoundText())
		return fullRoundTexts.includes('Grand Final Reset') ? 
			sets.filter(set => set.getFullRoundText() !== 'Grand Final Reset') 
			: 
			sets
	}

	public static filterForCompleteSets(sets: IGGSet[]): IGGSet[]{
		log.debug('GGSet.filterForCompleteSets called')
		return sets.filter(set => set.getIsComplete())
	}

	public static filterForIncompleteSets(sets: IGGSet[]): IGGSet[]{
		log.debug('GGSet.filterForCompleteSets called')
		return sets.filter(set => !set.getIsComplete())
	}

	public static filterForXMinutesBack(sets: IGGSet[], minutesBack: number): IGGSet[]{
		log.debug('GGSet.filterForCompleteSets called')

		const now = moment()
		const filtered: IGGSet[] = sets.filter(set => {
			const then = moment(set.getCompletedAt() as Date)
			const diff = moment.duration(now.diff(then))

			const diffMinutes = diff.minutes()
			if(diff.hours() > 0 || diff.days() > 0 || diff.months() > 0 || diff.years() > 0) 
				return false
			else 
				return diffMinutes <= minutesBack && diffMinutes >= 0 && set.getIsComplete()
		})
		return filtered
	}

	public static getDefaultSetOptions(): IGGSetOptions{
		return {
			page: null,
			perPage: null,
			sortBy: null,
			filters: null
		}
	}

	public id: number 
	public completedAt: number | null
	public displayScore: string | null
	public event: {
	    id: number | null
	}
	public fullRoundText: string | null
	public identifier: string | null
	public phaseGroup:{
	    id: number | null
	}
	public round: number | null
	public startedAt: number | null
	public slots: IGGSetSlots[]
	public state: number | null
	public totalGames: number | null
	public winnerId: number | null
	public player1: IPlayerLite
	public player2: IPlayerLite
	public score1: number | null
	public score2: number | null

    // SonarLint TODO: Need restructuring so we dont have as many parameters
	constructor(
		id: number,
		completedAt: number | null,
		displayScore: string | null,
		event: {
        	    id: number | null
        	},
		fullRoundText: string | null,
        identifier: string | null,
        phaseGroup:{
            id: number | null
        },
        round: number | null,
        startedAt: number | null,
        slots: IGGSetSlots[],
        state: number | null,
        totalGames: number | null,
        winnerId: number | null,
		player1: IPlayerLite,
		player2: IPlayerLite,
		score1: number | null,
		score2: number | null
	){
		super()

		this.id =id 
		this.completedAt = completedAt
		this.displayScore =	displayScore
		this.event = event
		this.fullRoundText = fullRoundText
		this.identifier = identifier
		this.phaseGroup = phaseGroup
		this.round = round
		this.startedAt = startedAt
		this.slots = slots
		this.state = state
		this.totalGames = totalGames
		this.winnerId =	winnerId
		this.player1 = player1
		this.player2 = player2
		this.score1 = score1 
		this.score2 = score2 
	}

	// simple
	public getId(): number | null {
		return this.id
	}

	public getEventId(): number | null { 
		return this.event.id
	}

	public getPhaseGroupId(): number | null {
		return this.phaseGroup.id
	}

	public getDisplayScore(): string | null{
		return this.displayScore
	}

	public getFullRoundText(): string | null{
		return this.fullRoundText
	}

	public getRound(): number | null{
		return this.round
	}

	public getState(): number | null{
		return this.state
	}

	public getPlayer1(): IPlayerLite {
		return this.player1
	}

	public getPlayer1Tag(): string | null {
		return this.player1.tag
	}

	public getPlayer1AttendeeIds(): number[] | null {
		return this.player1.attendeeIds
	}

	public getPlayer1PlayerId(): number | null {
		return this.player1.entrantId
	}

	public getPlayer2(): IPlayerLite {
		return this.player2
	}

	public getPlayer2Tag(): string | null {
		return this.player2.tag
	}

	public getPlayer2AttendeeIds(): number[] | null {
		return this.player2.attendeeIds
	}

	public getPlayer2PlayerId(): number | null {
		return this.player2.entrantId
	}

	public getStartedAtTimestamp(): number | null {
		return this.startedAt
	}

	public getCompletedAtTimestamp(): number | null {
		return this.completedAt
	}

	// Todo needs coverage
	public getStartedAt(): Date | null {
		if(this.startedAt)	
			return moment.unix(this.startedAt).toDate()
		else return null
	}

	public getCompletedAt(): Date | null {
		if(this.completedAt)
			return moment.unix(this.completedAt).toDate()
		else return null
	}
	
	// calculated
	public getWinnerId(): number | null{
		return this.winnerId ? this.winnerId : null
	}

	public getLoserId(): number | null{
		switch(this.winnerId){
		case this.player1.entrantId:
			return this.player2.entrantId ? this.player2.entrantId : null
		case this.player2.entrantId:
			return this.player1.entrantId ? this.player1.entrantId : null
		default:
			return null
		}
	}

	public getIsComplete(): boolean | null{
		return this.completedAt != null
	}

// 	public getCompletedTime(): Date | null{
// 		if(this.completedAt)
// 			return moment.unix(this.completedAt).toDate()
// 		else return null
// 	}

	public getPlayer1Score(): number | null{
		if(this.score1)
			return this.score1
		else return 0
	}

	public getPlayer2Score(): number | null{
		if(this.score2)
			return this.score2
		else return 0
	}

	public getWinner(): IPlayerLite | undefined {
		if(this.winnerId && this.player2.entrantId && this.player1.entrantId)
			switch(this.winnerId){
			case this.player1.entrantId:
				return this.player1
			case this.player2.entrantId:
				return this.player2
			default:
				throw new Error(
					`Winner ID ${this.winnerId} does not match either player ID: 
					[${[this.player1.entrantId, this.player2.entrantId].join(',')}]`
				)
			}
		else throw new Error(`Set (${this.id}) must be complete to get the Winning Player`)
	}

	public getLoser(): IPlayerLite | undefined {
		if(this.winnerId && this.player1.entrantId && this.player2.entrantId)
			switch(this.winnerId){
			case this.player1.entrantId:
				return this.player2
			case this.player2.entrantId:
				return this.player1
			default:
				throw new Error(
					`Loser ID does not match either player ID: [${[this.player1.entrantId, this.player2.entrantId].join(',')}]`
				)
			}
		else throw new Error(`Set (${this.id}) must be complete to get the Losing Player`)
	}

	public getBestOfCount(): number {
		return this.totalGames ?? 0
	}

	public getWinnerScore(): number {
		if(!this.completedAt)
			throw new Error('Cannot get winner score of incomplete set')
		else if(this.score1 == null || this.score2 == null){
			if(this.score1 == null) return this.score2!
			else return this.score1
		}
		else return this.score1 > this.score2 ? this.score1 : this.score2
	}

	public getLoserScore(): number {
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
	public async getGames(): Promise<IGame[]> {
		log.info('Gettings Games for set (%s)', this.id)
		const data: IGameDataFull = await NI.query(queries.games, {id: this.id})
		return Game.parseFull(data)
	}

	public async getAttendees(): Promise<IAttendee[]> {
		log.info('Getting Attendees who participated in Set [%s]', this.id)
		const data: IGGSetSlotAttendeeData = await NI.query(queries.attendees, {id: this.id})
		const entrants = data.set.slots.map(slot => slot.entrant).filter(entrant => entrant != null)
		const participants = 
			_.flatten(entrants.map(entrant => entrant?.participants)).filter(participant => participant != null)
		const attendees: IAttendee[] = participants.map(participant => Attendee.parse(participant!))
		return attendees
	}

	public async getEntrants(): Promise<IEntrant[]> {
		log.info('Getting Entrants who participated in Set [%s]', this.id)
		const data: IGGSetSlotEntrantData = await NI.query(queries.entrants, {id: this.id})
		const entrantData = data.set.slots.map(slot => slot.entrant).filter(entrant => entrant != null)
		const entrants = entrantData.map(entrant => Entrant.parse(entrant!))
		return entrants
	}
	
	// Statics
}
