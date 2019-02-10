import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import _ from 'lodash'
import moment from 'moment'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {GGSet, IGGSet} from '../lib/GGSet'
import {Game, IGame} from '../lib/Game'
import {Entrant} from '../lib/Entrant'
import {Attendee} from '../lib/Attendee'
import Cache from '../lib/util/Cache'
import * as testData from './data/sets.testData'
import * as gameData from './data/games.testData'
import Initializer from '../lib/util/Initializer';

let set1: GGSet, set2: GGSet, set3: GGSet;
const SET_ID_1 = +'11186682'
const SET_ID_2 = +'11186683'
const SET_ID_3 = +'8798920'

describe('Smash GG Set', function(){
	this.timeout(10000)

	before(async function(){
		await Initializer(process.env.API_TOKEN!)

		console.log('Testing displayScore parsing first...')
		expect(GGSet.parseDisplayScore(testData.set1.displayScore)).to.deep.equal(testData.parsedDisplayScore1)
		expect(GGSet.parseDisplayScore(testData.set2.displayScore)).to.deep.equal(testData.parsedDisplayScore2)
		expect(GGSet.parseDisplayScore(testData.set3.displayScore)).to.deep.equal(testData.parsedDisplayScore3)
		console.log('Success!')

		set1 = await GGSet.get(SET_ID_1)
		set2 = await GGSet.get(SET_ID_2)
		set3 = await GGSet.get(SET_ID_3)
		return true;
	})

	// event id
	it('should return the correct event id 1', function(){
		expect(set1.getEventId()).to.be.equal(testData.set1.eventId)
	})
	it('should return the correct event id 2', function(){
		expect(set2.getEventId()).to.be.equal(testData.set2.eventId)
	})
	it('should return the correct event id 3', function(){
		expect(set3.getEventId()).to.be.equal(testData.set3.eventId)
	})

	// phase group id
	it('should return the correct phase group 1', function(){
		expect(set1.getPhaseGroupId()).to.be.equal(testData.set1.phaseGroupId)
	})
	it('should return the correct phase group 2', function(){
		expect(set2.getPhaseGroupId()).to.be.equal(testData.set2.phaseGroupId)
	})
	it('should return the correct phase group 3', function(){
		expect(set3.getPhaseGroupId()).to.be.equal(testData.set3.phaseGroupId)
	})

	// started at time
	it('should return the correct starting timestamp 1', function(){
		expect(set1.getStartedAtTimestamp()).to.be.equal(set1.startedAt)
	})
	it('should return the correct starting timestamp 2 ', function(){
		expect(set2.getStartedAtTimestamp()).to.be.equal(set2.startedAt)
	})
	it('should return the correct starting timestamp 3', function(){
		expect(set3.getStartedAtTimestamp()).to.be.equal(set3.startedAt)
	})

	// completed at time
	it('should return the correct completed timestamp 1', function(){
		expect(set1.getCompletedAtTimestamp()).to.be.equal(set1.completedAt)
	})
	it('should return the correct completed timestamp 2', function(){
		expect(set2.getCompletedAtTimestamp()).to.be.equal(set2.completedAt)
	})
	it('should return the correct completed timestamp 3', function(){
		expect(set3.getCompletedAtTimestamp()).to.be.equal(set3.completedAt)
	})

	// completed at time date
	it('should return the correct completed Datetime 1', function(){
		let expected = moment.unix(set1.completedAt!).toDate()
		expect(moment(set1.getCompletedAt()!).isSame(expected)).to.to.true
	})
	it('should return the correct completed Datetime 2', function(){
		let expected = moment.unix(set2.completedAt!).toDate()
		expect(moment(set2.getCompletedAt()!).isSame(expected)).to.to.true
	})
	it('should return the correct completed Datetime 3', function(){
		let expected = moment.unix(set3.completedAt!).toDate()
		expect(moment(set3.getCompletedAt()!).isSame(expected)).to.to.true
	})

	// display score
	it('should return the correct display score string 1', function(){
		expect(set1.getDisplayScore()).to.be.equal(set1.displayScore)
	})
	it('should return the correct display score string 2', function(){
		expect(set2.getDisplayScore()).to.be.equal(set2.displayScore)
	})
	it('should return the correct display score string 3', function(){
		expect(set3.getDisplayScore()).to.be.equal(set3.displayScore)
	})

	// full round text
	it('should return the full round text 1', function(){
		expect(set1.getFullRoundText()).to.be.equal(set1.fullRoundText)
	})
	it('should return the full round text 2', function(){
		expect(set2.getFullRoundText()).to.be.equal(set2.fullRoundText)
	})
	it('should return the full round text 3', function(){
		expect(set3.getFullRoundText()).to.be.equal(set3.fullRoundText)
	})

	// round
	it('should return the round 1', function(){
		expect(set1.getRound()).to.be.equal(set1.round)
	})
	it('should return the round 2', function(){
		expect(set2.getRound()).to.be.equal(set2.round)
	})
	it('should return the round 3', function(){
		expect(set3.getRound()).to.be.equal(set3.round)
	})

	// state
	it('should return the state 1', function(){
		expect(set1.getState()).to.be.equal(set1.state)
	})
	it('should return the state 2', function(){
		expect(set2.getState()).to.be.equal(set2.state)
	})
	it('should return the state 3', function(){
		expect(set3.getState()).to.be.equal(set3.state)
	})

	// player 1
	it('should return player1 1', function(){
		expect(set1.getPlayer1()).to.deep.equal(testData.p1)
	})
	it('should return player1 2', function(){
		expect(set2.getPlayer1()).to.deep.equal(testData.p3)
	})
	it('should return player1 3', function(){
		expect(set3.getPlayer1()).to.deep.equal(testData.p5)
	})

	// player 1 playerId
	it('should return player1 1 playerId', function(){
		expect(set1.getPlayer1PlayerId()).to.be.equal(testData.p1.entrantId)
	})
	it('should return player1 2 playerId', function(){
		expect(set2.getPlayer1PlayerId()).to.be.equal(testData.p3.entrantId)
	})
	it('should return player1 3 playerId', function(){
		expect(set3.getPlayer1PlayerId()).to.be.equal(testData.p5.entrantId)
	})

	// player 1 attendee id
	it('should return player1 1 attendeeId', function(){
		expect(set1.getPlayer1AttendeeIds()).to.have.members(testData.p1.attendeeIds)
	})
	it('should return player1 2 attendeeId', function(){
		expect(set2.getPlayer1AttendeeIds()).to.have.members(testData.p3.attendeeIds)
	})
	it('should return player1 3 attendeeId', function(){
		expect(set3.getPlayer1AttendeeIds()).to.have.members(testData.p5.attendeeIds)
	})

	// player 2
	it('should return player1 1', function(){
		expect(set1.getPlayer2()).to.deep.equal(testData.p2)
	})
	it('should return player1 2', function(){
		expect(set2.getPlayer2()).to.deep.equal(testData.p4)
	})
	it('should return player1 3', function(){
		expect(set3.getPlayer2()).to.deep.equal(testData.p6)
	})

	// player 2 playerId
	it('should return player1 1 playerId', function(){
		expect(set1.getPlayer2PlayerId()).to.be.equal(testData.p2.entrantId)
	})
	it('should return player1 2 playerId', function(){
		expect(set2.getPlayer2PlayerId()).to.be.equal(testData.p4.entrantId)
	})
	it('should return player1 3 playerId', function(){
		expect(set3.getPlayer2PlayerId()).to.be.equal(testData.p6.entrantId)
	})

	// player 2 attendee id
	it('should return player1 1 attendeeId', function(){
		expect(set1.getPlayer2AttendeeIds()).to.have.members(testData.p2.attendeeIds)
	})
	it('should return player1 2 attendeeId', function(){
		expect(set2.getPlayer2AttendeeIds()).to.have.members(testData.p4.attendeeIds)
	})
	it('should return player1 3 attendeeId', function(){
		expect(set3.getPlayer2AttendeeIds()).to.have.members(testData.p6.attendeeIds)
	})

	// getting winner id
	it('should give the correct Winner ID 1', function(){
		expect(set1.getWinnerId()).to.deep.equal(testData.set1.winnerId)
	})
	it('should give the correct Winner ID 2', function(){
		expect(set2.getWinnerId()).to.deep.equal(testData.set2.winnerId)
	})
	it('should give the correct Winner ID 3', function(){
		expect(set3.getWinnerId()).to.deep.equal(testData.set3.winnerId)
	})

	// getting loser id
	it('should give the correct Loser ID 1', function(){
		expect(set1.getLoserId()).to.deep.equal(testData.p2.entrantId)
	})
	it('should give the correct Loser ID 2', function(){
		expect(set2.getLoserId()).to.deep.equal(testData.p4.entrantId)
	})
	it('should give the correct Loser ID 3', function(){
		expect(set3.getLoserId()).to.deep.equal(testData.p6.entrantId)
	})

	// getting winner
	it('should give the correct Winner 1', function(){
		expect(set1.getWinner()).to.deep.equal(testData.p1)
	})
	it('should give the correct Winner 2', function(){
		expect(set2.getWinner()).to.deep.equal(testData.p3)
	})
	it('should give the correct Winner 3', function(){
		expect(set3.getWinner()).to.deep.equal(testData.p5)
	})

	// getting loser
	it('should give the correct Loser 1', function(){
		expect(set1.getLoser()).to.deep.equal(testData.p2)
	})
	it('should give the correct Loser 2', function(){
		expect(set2.getLoser()).to.deep.equal(testData.p4)
	})
	it('should give the correct Loser 3', function(){
		expect(set3.getLoser()).to.deep.equal(testData.p6)
	})

	// total games
	it('should give the correct bestOf count 1', function(){
		expect(set1.getBestOfCount()).to.be.equal(5)
	})
	it('should give the correct bestOf count 2', function(){
		expect(set2.getBestOfCount()).to.be.equal(5)
	})
	it('should give the correct bestOf count 3', function(){
		expect(set3.getBestOfCount()).to.be.equal(5)
	})

	// Winner score
	it('should give the correct Winner score 1', function(){
		expect(set1.getWinnerScore()).to.be.equal(3)
	})
	it('should give the correct Winner score 2', function(){
		expect(set2.getWinnerScore()).to.be.equal(3)
	})
	it('should give the correct Winner score 3', function(){
		expect(set3.getWinnerScore()).to.be.equal(3)
	})

	// Loser score
	it('should give the correct Loser score 1', function(){
		expect(set1.getLoserScore()).to.be.equal(0)
	})
	it('should give the correct Loser score 2', function(){
		expect(set2.getLoserScore()).to.be.equal(0)
	})
	it('should give the correct Loser score 3', function(){
		expect(set3.getLoserScore()).to.be.equal(1)
	})


	// games
	it('should get the list of games played in the set 1', async function(){
		let expected = gameData.games1.map(gameData => Game.parse(gameData))
		expect(await set1.getGames()).to.have.deep.members(expected)
		return true
	})
	it('should get the list of games played in the set 2', async function(){
		let expected = gameData.games2.map(gameData => Game.parse(gameData))
		expect(await set2.getGames()).to.have.deep.members(expected)
		return true
	})
	it('should get the list of games played in the set 3', async function(){
		let expected = gameData.games3.map(gameData => Game.parse(gameData))
		expect(await set3.getGames()).to.have.deep.members(expected)
		return true		
	})


	// entrants
	it('should get the correct entrants who played in the set 1', async function(){
		let entrants = await set1.getEntrants()

		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(2);
		return true;
	})
	it('should get the correct entrants who played in the set 2', async function(){
		let entrants = await set2.getEntrants()

		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(2);
		return true;
	})
	it('should get the correct entrants who played in the set 3', async function(){
		let entrants = await set3.getEntrants()

		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(2);
		return true;
	})

	
	// participants
	it('should get the correct attendees who played in the set 1', async function(){
		let attendees = await set1.getAttendees()

		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(2);
		return true;
	})
	it('should get the correct attendees who played in the set 2', async function(){
		let attendees = await set2.getAttendees()

		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(2);
		return true;
	})
	it('should get the correct participants who played in the set 3', async function(){
		let attendees = await set3.getAttendees()

		var hasDuplicates = function(a: Attendee[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(attendees)).to.be.false;
		attendees.forEach(attendee => {
			expect(attendee).to.be.an.instanceof(Attendee);
		});
		expect(attendees.length).to.be.equal(2);
		return true;
	})

	xit('should give the correct Bracket ID', function(done){
		//expect(set1.getBracketId()).to.be.equal('58df119c60fbb')
		//expect(set2.getBracketId()).to.be.equal('58df119c60fbb')
		//expect(set3.getBracketId()).to.be.equal('58df119c60fbb')
		done()
	})

	xit('should give the correct Winners Tournament Placement', function(done){
		/*
		let winner1 = set1.getWinner() as Player
		let data1 = winner1.data as IPlayer.Entity
		expect(set1.getWinnersTournamentPlacement()).to.be.equal(data1.finalPlacement);

		done();
		*/
	});

	xit('should give the correct Winners Tournament Placement 2', function(done){
		/*
		let winner2 = set2.getWinner() as Player
		let data2 = winner2.data as IPlayer.Entity
		expect(set2.getWinnersTournamentPlacement()).to.be.equal(data2.finalPlacement);
		
		done()
		*/
	})

	xit('should give the correct Winners Tournament Placement 3', function(done){
		/*
		let winner3 = set3.getWinner() as Player
		let data3 = winner3.data as IPlayer.Entity
		expect(set3.getWinnersTournamentPlacement()).to.be.equal(data3.finalPlacement);

		done();
		*/
	})

	xit('should give the correct Losers Tournament Placement', function(done){
		/*
		let loser1 = set1.getLoser() as Player
		let data1 = loser1.data as IPlayer.Entity
		expect(set1.getLosersTournamentPlacement()).to.be.equal(data1.finalPlacement);

		done()
		*/;
	});

	xit('should give the correct Losers Tournament Placement 2', function(done){
		/*
		let loser2 = set2.getLoser() as Player
		let data2 = loser2.data as IPlayer.Entity
		expect(set2.getLosersTournamentPlacement()).to.be.equal(data2.finalPlacement);

		done()
		*/
	})

	xit('should give the correct Losers Tournament Placement 3', function(done){
		/*
		let loser3 = set3.getLoser() as Player
		let data3 = loser3.data as IPlayer.Entity
		expect(set3.getLosersTournamentPlacement()).to.be.equal(data3.finalPlacement);

		done()
		*/
	})


	xit('should give the correct Midsize Round Text', function(done){
		/*
		expect(set1.getMidsizeRoundText()).to.be.equal('Winners 1')
		expect(set2.getMidsizeRoundText()).to.be.equal('Winners Quarters')
		expect(set3.getMidsizeRoundText()).to.be.equal('Winners Quarters')
		done()
		*/
	})
})