import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import moment from 'moment'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import { IGGSet } from '../lib/interfaces/IGGSet'
import {IEntrant} from '../lib/interfaces/IEntrant'
import {IAttendee} from '../lib/interfaces/IAttendee'

import {GGSet} from '../lib/models/GGSet'
import {Game} from '../lib/models/Game'
import {Entrant} from '../lib/models/Entrant'
import {Attendee} from '../lib/models/Attendee'
import * as testData from './data/sets.testData'
import * as gameData from './data/games.testData'
import Initializer from '../lib/util/Initializer'

let set1: IGGSet, set2: IGGSet, set3: IGGSet
const SET_ID_1 = +'54170233'
const SET_ID_2 = +'51002303'
const SET_ID_3 = +'56194829'

describe('startgg Set (has still pending)', function() {
	this.timeout(10000)

	before(async () => {
		Initializer(process.env.API_TOKEN!)

		console.log('Testing displayScore parsing first...')
		expect(GGSet.parseDisplayScore(testData.set1.displayScore!)).to.deep.equal(testData.parsedDisplayScore1)
		expect(GGSet.parseDisplayScore(testData.set2.displayScore!)).to.deep.equal(testData.parsedDisplayScore2)
		expect(GGSet.parseDisplayScore(testData.set3.displayScore!)).to.deep.equal(testData.parsedDisplayScore3)
		console.log('Success!')
        console.log('Retrieving sets...')
		set1 = await GGSet.get(SET_ID_1)
		set2 = await GGSet.get(SET_ID_2)
		set3 = await GGSet.get(SET_ID_3)
		return true
	})

	// event id
	it('should return the correct event id 1', () => {
		expect(set1.getEventId()).to.be.equal(testData.set1.event.id)
	})
	it('should return the correct event id 2', () => {
		expect(set2.getEventId()).to.be.equal(testData.set2.event.id)
	})
	it('should return the correct event id 3', () => {
		expect(set3.getEventId()).to.be.equal(testData.set3.event.id)
	})

	// phase group id
	it('should return the correct phase group 1', () => {
		expect(set1.getPhaseGroupId()).to.be.equal(testData.set1.phaseGroup.id)
	})
	it('should return the correct phase group 2', () => {
		expect(set2.getPhaseGroupId()).to.be.equal(testData.set2.phaseGroup.id)
	})
	it('should return the correct phase group 3', () => {
		expect(set3.getPhaseGroupId()).to.be.equal(testData.set3.phaseGroup.id)
	})

	// started at time
	it('should return the correct starting timestamp 1', () => {
		expect(set1.getStartedAtTimestamp()).to.be.equal(testData.set1.startedAt)
	})
	it('should return the correct starting timestamp 2 ', () => {
		expect(set2.getStartedAtTimestamp()).to.be.equal(testData.set2.startedAt)
	})
	it('should return the correct starting timestamp 3', () => {
		expect(set3.getStartedAtTimestamp()).to.be.equal(testData.set3.startedAt)
	})

	// completed at time
	it('should return the correct completed timestamp 1', () => {
		expect(set1.getCompletedAtTimestamp()).to.be.equal(testData.set1.completedAt)
	})
	it('should return the correct completed timestamp 2', () => {
		expect(set2.getCompletedAtTimestamp()).to.be.equal(testData.set2.completedAt)
	})
	it('should return the correct completed timestamp 3', () => {
		expect(set3.getCompletedAtTimestamp()).to.be.equal(testData.set3.completedAt)
	})

	// completed at time date
	it('should return the correct completed Datetime 1', () => {
		const expected = moment.unix(testData.set1.completedAt!).toDate()
		expect(moment(set1.getCompletedAt()).isSame(expected)).to.to.true
	})
	it('should return the correct completed Datetime 2', () => {
		const expected = moment.unix(testData.set2.completedAt!).toDate()
		expect(moment(set2.getCompletedAt()).isSame(expected)).to.to.true
	})
	it('should return the correct completed Datetime 3', () => {
		const expected = moment.unix(testData.set3.completedAt!).toDate()
		expect(moment(set3.getCompletedAt()).isSame(expected)).to.to.true
	})

	// display score
	it('should return the correct display score string 1', () => {
		expect(set1.getDisplayScore()).to.be.equal(testData.set1.displayScore)
	})
	it('should return the correct display score string 2', () => {
		expect(set2.getDisplayScore()).to.be.equal(testData.set2.displayScore)
	})
	it('should return the correct display score string 3', () => {
		expect(set3.getDisplayScore()).to.be.equal(testData.set3.displayScore)
	})

	// full round text
	it('should return the full round text 1', () => {
		expect(set1.getFullRoundText()).to.be.equal(testData.set1.fullRoundText)
	})
	it('should return the full round text 2', () => {
		expect(set2.getFullRoundText()).to.be.equal(testData.set2.fullRoundText)
	})
	it('should return the full round text 3', () => {
		expect(set3.getFullRoundText()).to.be.equal(testData.set3.fullRoundText)
	})

	// round
	it('should return the round 1', () => {
		expect(set1.getRound()).to.be.equal(testData.set1.round)
	})
	it('should return the round 2', () => {
		expect(set2.getRound()).to.be.equal(testData.set2.round)
	})
	it('should return the round 3', () => {
		expect(set3.getRound()).to.be.equal(testData.set3.round)
	})

	// state
	it('should return the state 1', () => {
		expect(set1.getState()).to.be.equal(testData.set1.state)
	})
	it('should return the state 2', () => {
		expect(set2.getState()).to.be.equal(testData.set2.state)
	})
	it('should return the state 3', () => {
		expect(set3.getState()).to.be.equal(testData.set3.state)
	})

	// player 1
	it('should return player1 1', () => {
		expect(set1.getPlayer1()).to.deep.equal(testData.p1)
	})
	it('should return player1 2', () => {
		expect(set2.getPlayer1()).to.deep.equal(testData.p3)
	})
	it('should return player1 3', () => {
		expect(set3.getPlayer1()).to.deep.equal(testData.p5)
	})

	// player 1 playerId
	it('should return player1 1 playerId', () => {
		expect(set1.getPlayer1PlayerId()).to.be.equal(testData.p1.entrantId)
	})
	it('should return player1 2 playerId', () => {
		expect(set2.getPlayer1PlayerId()).to.be.equal(testData.p3.entrantId)
	})
	it('should return player1 3 playerId', () => {
		expect(set3.getPlayer1PlayerId()).to.be.equal(testData.p5.entrantId)
	})

	// player 1 attendee id
	it('should return player1 1 attendeeId', () => {
		expect(set1.getPlayer1AttendeeIds()).to.have.members(testData.p1.attendeeIds)
	})
	it('should return player1 2 attendeeId', () => {
		expect(set2.getPlayer1AttendeeIds()).to.have.members(testData.p3.attendeeIds)
	})
	it('should return player1 3 attendeeId', () => {
		expect(set3.getPlayer1AttendeeIds()).to.have.members(testData.p5.attendeeIds)
	})

	// player 2
	it('should return player1 1', () => {
		expect(set1.getPlayer2()).to.deep.equal(testData.p2)
	})
	it('should return player1 2', () => {
		expect(set2.getPlayer2()).to.deep.equal(testData.p4)
	})
	it('should return player1 3', () => {
		expect(set3.getPlayer2()).to.deep.equal(testData.p6)
	})

	// player 2 playerId
	it('should return player1 1 playerId', () => {
		expect(set1.getPlayer2PlayerId()).to.be.equal(testData.p2.entrantId)
	})
	it('should return player1 2 playerId', () => {
		expect(set2.getPlayer2PlayerId()).to.be.equal(testData.p4.entrantId)
	})
	it('should return player1 3 playerId', () => {
		expect(set3.getPlayer2PlayerId()).to.be.equal(testData.p6.entrantId)
	})

	// player 2 attendee id
	it('should return player1 1 attendeeId', () => {
		expect(set1.getPlayer2AttendeeIds()).to.have.members(testData.p2.attendeeIds)
	})
	it('should return player1 2 attendeeId', () => {
		expect(set2.getPlayer2AttendeeIds()).to.have.members(testData.p4.attendeeIds)
	})
	it('should return player1 3 attendeeId', () => {
		expect(set3.getPlayer2AttendeeIds()).to.have.members(testData.p6.attendeeIds)
	})

	// getting winner id
	it('should give the correct Winner ID 1', () => {
		expect(set1.getWinnerId()).to.deep.equal(testData.set1.winnerId)
	})
	it('should give the correct Winner ID 2', () => {
		expect(set2.getWinnerId()).to.deep.equal(testData.set2.winnerId)
	})
	it('should give the correct Winner ID 3', () => {
		expect(set3.getWinnerId()).to.deep.equal(testData.set3.winnerId)
	})

	// getting loser id
	it('should give the correct Loser ID 1', () => {
		expect(set1.getLoserId()).to.deep.equal(testData.p2.entrantId)
	})
	it('should give the correct Loser ID 2', () => {
	    //console.log("--" + set2.getLoserId() + " and " + testData.p3.entrantId)
		expect(set2.getLoserId()).to.deep.equal(testData.p3.entrantId)
	})
	it('should give the correct Loser ID 3', () => {
		expect(set3.getLoserId()).to.deep.equal(testData.p5.entrantId)
	})

	// getting winner
	it('should give the correct Winner 1', () => {
		expect(set1.getWinner()).to.deep.equal(testData.p1)
	})
	it('should give the correct Winner 2', () => {
		expect(set2.getWinner()).to.deep.equal(testData.p4)
	})
	it('should give the correct Winner 3', () => {
		expect(set3.getWinner()).to.deep.equal(testData.p6)
	})

	// getting loser
	it('should give the correct Loser 1', () => {
		expect(set1.getLoser()).to.deep.equal(testData.p2)
	})
	it('should give the correct Loser 2', () => {
		expect(set2.getLoser()).to.deep.equal(testData.p3)
	})
	it('should give the correct Loser 3', () => {
		expect(set3.getLoser()).to.deep.equal(testData.p5)
	})

	// total games
	it('should give the correct bestOf count 1', () => {
		expect(set1.getBestOfCount()).to.be.equal(5)
	})
	it('should give the correct bestOf count 2', () => {
		expect(set2.getBestOfCount()).to.be.equal(5)
	})
	it('should give the correct bestOf count 3', () => {
		expect(set3.getBestOfCount()).to.be.equal(5)
	})

	// Winner score
	it('should give the correct Winner score 1', () => {
		expect(set1.getWinnerScore()).to.be.equal(3)
	})
	it('should give the correct Winner score 2', () => {
		expect(set2.getWinnerScore()).to.be.equal(3)
	})
	it('should give the correct Winner score 3', () => {
		expect(set3.getWinnerScore()).to.be.equal(3)
	})

	// Loser score
	it('should give the correct Loser score 1', () => {
		expect(set1.getLoserScore()).to.be.equal(2)
	})
	it('should give the correct Loser score 2', () => {
		expect(set2.getLoserScore()).to.be.equal(1)
	})
	it('should give the correct Loser score 3', () => {
		expect(set3.getLoserScore()).to.be.equal(1)
	})

	// games
	it('should get the list of games played in the set 1', async () => {
		const expected = gameData.games1.map(data => Game.parse(data))
		expect(await set1.getGames()).to.have.deep.members(expected)
		return true
	})
	it('should get the list of games played in the set 2', async () => {
		const expected = gameData.games2.map(data => Game.parse(data))
		expect(await set2.getGames()).to.have.deep.members(expected)
		return true
	})
	it('should get the list of games played in the set 3', async () => {
		const expected = gameData.games3.map(data => Game.parse(data))
		expect(await set3.getGames()).to.have.deep.members(expected)
		return true
	})

	// entrants
	it('should get the correct entrants who played in the set 1', async () => {
		await testGetEntrants(set1)
	})
	it('should get the correct entrants who played in the set 2', async () => {
		await testGetEntrants(set2)
	})
	it('should get the correct entrants who played in the set 3', async () => {
		await testGetEntrants(set3)
	})
	
	// participants
	it('should get the correct attendees who played in the set 1', async () => {
		await testGetAttendees(set1)
	})
	it('should get the correct attendees who played in the set 2', async () => {
		await testGetAttendees(set2)
	})
	it('should get the correct participants who played in the set 3', async () => {
		await testGetAttendees(set3)
	})

	xit('should give the correct Bracket ID', (done) => {
		// expect(set1.getBracketId()).to.be.equal('58df119c60fbb')
		// expect(set2.getBracketId()).to.be.equal('58df119c60fbb')
		// expect(set3.getBracketId()).to.be.equal('58df119c60fbb')
		done()
	})

	xit('should give the correct Winners Tournament Placement', (done) => {
		/*
		let winner1 = set1.getWinner() as Player
		let data1 = winner1.data as IPlayer.Entity
		expect(set1.getWinnersTournamentPlacement()).to.be.equal(data1.finalPlacement)

		done()
		*/
	})

	xit('should give the correct Winners Tournament Placement 2', (done) => {
		/*
		let winner2 = set2.getWinner() as Player
		let data2 = winner2.data as IPlayer.Entity
		expect(set2.getWinnersTournamentPlacement()).to.be.equal(data2.finalPlacement)

		done()
		*/
	})

	xit('should give the correct Winners Tournament Placement 3', (done) => {
		/*
		let winner3 = set3.getWinner() as Player
		let data3 = winner3.data as IPlayer.Entity
		expect(set3.getWinnersTournamentPlacement()).to.be.equal(data3.finalPlacement)

		done()
		*/
	})

	xit('should give the correct Losers Tournament Placement', (done) => {
		/*
		let loser1 = set1.getLoser() as Player
		let data1 = loser1.data as IPlayer.Entity
		expect(set1.getLosersTournamentPlacement()).to.be.equal(data1.finalPlacement)

		done()
		*/
	})

	xit('should give the correct Losers Tournament Placement 2', (done) => {
		/*
		let loser2 = set2.getLoser() as Player
		let data2 = loser2.data as IPlayer.Entity
		expect(set2.getLosersTournamentPlacement()).to.be.equal(data2.finalPlacement)

		done()
		*/
	})

	xit('should give the correct Losers Tournament Placement 3', (done) => {
		/*
		let loser3 = set3.getLoser() as Player
		let data3 = loser3.data as IPlayer.Entity
		expect(set3.getLosersTournamentPlacement()).to.be.equal(data3.finalPlacement)

		done()
		*/
	})

	xit('should give the correct Midsize Round Text', (done) => {
		/*
		expect(set1.getMidsizeRoundText()).to.be.equal('Winners 1')
		expect(set2.getMidsizeRoundText()).to.be.equal('Winners Quarters')
		expect(set3.getMidsizeRoundText()).to.be.equal('Winners Quarters')
		done()
		*/
	})
})

async function testGetEntrants(set: IGGSet){
	const arr: IEntrant[] = await set.getEntrants()

	arr.forEach(entrant => {
		expect(entrant).to.be.an.instanceof(Entrant)
		expect(
			arr.filter(x => x.getId() === entrant.getId()).length,
			'Phase Group array must not have duplicates! Found: ' + entrant.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(2)
	return true
}

async function testGetAttendees(set: IGGSet){
	const arr: IAttendee[] = await set.getAttendees()

	arr.forEach(attendee => {
		expect(attendee).to.be.an.instanceof(Attendee)
		expect(
			arr.filter(x => x.getId() === attendee.getId()).length,
			'Phase Group array must not have duplicates! Found: ' + attendee.getId()
		).to.be.equal(1)
	})
	expect(arr.length).to.be.equal(2)
	return true
}
