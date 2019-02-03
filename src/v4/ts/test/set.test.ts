import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import _ from 'lodash'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {GGSet, IGGSet, Player, IPlayer} from '../lib/internal'
import Cache from '../lib/util/Cache'
import * as testData from './data/sets.testData'

let set1: GGSet, set2: GGSet, set3: GGSet;
const SET_ID_1 = '11186682'
const SET_ID_2 = '11186683'
const SET_ID_3 = '8798920'

describe('Smash GG Set', function(){

	before(function(done){
		Cache.flush()
	})
	
	it('should get a set by id', async function(){
		this.timeout(5000)
		
		expect(GGSet.parseDisplayScore(testData.set1.displayScore)).to.deep.equal(testData.parsedDisplayScore1)
		expect(GGSet.parseDisplayScore(testData.set2.displayScore)).to.deep.equal(testData.parsedDisplayScore2)
		expect(GGSet.parseDisplayScore(testData.set3.displayScore)).to.deep.equal(testData.parsedDisplayScore3)

		set1 = GGSet.parse(testData.set1)
		set2 = GGSet.parse(testData.set2)
		set3 = GGSet.parse(testData.set3)

		return true
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
	it('should return the correct starting time 1', function(){
		expect(set1.getStartedAt).to.be.equal(set1.startedAt)
	})
	it('should return the correct starting time 2 ', function(){
		expect(set2.getStartedAt).to.be.equal(set2.startedAt)
	})
	it('should return the correct starting time 3', function(){
		expect(set3.getStartedAt).to.be.equal(set3.startedAt)
	})

	// completed at time
	it('should return the correct completed time 1', function(){
		expect(set1.getCompletedAt()).to.be.equal(set1.completedAt)
	})
	it('should return the correct completed time 2', function(){
		expect(set2.getCompletedAt()).to.be.equal(set2.completedAt)
	})
	it('should return the correct completed time 3', function(){
		expect(set3.getCompletedAt()).to.be.equal(set3.completedAt)
	})

	// completed at time date
	it('should return the correct completed Datetime 1', function(){
		let expected = new Date(0)
		expected.setUTCSeconds(set1.completedAt!)
		expect(set1.getCompletedTime()).to.be.equal(expected)
	})
	it('should return the correct completed Datetime 2', function(){
		let expected = new Date(0)
		expected.setUTCSeconds(set2.completedAt!)
		expect(set2.getCompletedTime()).to.be.equal(expected)
	})
	it('should return the correct completed Datetime 3', function(){
		let expected = new Date(0)
		expected.setUTCSeconds(set3.completedAt!)
		expect(set3.getCompletedTime()).to.be.equal(expected)
	})

	// display score

	/*
		getDisplayScore() : string
		getFullRoundText() : string
		getRound() : number
		getState() : number | null
		getPlayer1() : PlayerLite | undefined | null
		getPlayer1Tag() : string | undefined | null
		getPlayer1PlayerId() : number | undefined | null
		getPlayer1AttendeeId() : number | undefined | null
		getPlayer2() : PlayerLite | undefined | null
		getPlayer2Tag() : string | undefined | null
		getPlayer2PlayerId() : number | undefined | null
		getPlayer2AttendeeId() : number | undefined | null
		*/

	// getting winner
	it('should give the correct Winner 1', function(done){
		expect(set1.getWinner()).to.deep.equal(testData.p1)
		done()
	})
	it('should give the correct Winner 2', function(done){
		expect(set1.getWinner()).to.deep.equal(testData.p3)
		done()
	})
	it('should give the correct Winner 3', function(done){
		expect(set1.getWinner()).to.deep.equal(testData.p5)
		done()
	})

	// getting loser
	it('should give the correct Winner 1', function(done){
		expect(set1.getLoser()).to.deep.equal(testData.p2)
		done()
	})
	it('should give the correct Winner 2', function(done){
		expect(set1.getLoser()).to.deep.equal(testData.p4)
		done()
	})
	it('should give the correct Winner 3', function(done){
		expect(set1.getLoser()).to.deep.equal(testData.p6)
		done()
	})

	it('should give the correct round', function(done){
		expect(set1.getRound()).to.be.equal('Winners Round 1')
		expect(set2.getRound()).to.be.equal('Winners Quarter-Final')
		expect(set3.getRound()).to.be.equal('Winners Quarter-Final')
		done()
	})

	it('should give the correct bestOf count', function(done){
		expect(set1.getBestOfCount()).to.be.equal(3)
		expect(set2.getBestOfCount()).to.be.equal(3)
		expect(set3.getBestOfCount()).to.be.equal(3)
		done()
	})

	it('should give the correct Winner score', function(done){
		expect(set1.getWinnerScore()).to.be.equal(2)
		expect(set2.getWinnerScore()).to.be.equal(2)
		expect(set3.getWinnerScore()).to.be.equal(2)
		done()
	})

	it('should give the correct Loser score', function(done){
		expect(set1.getLoserScore()).to.be.equal(0)
		expect(set2.getLoserScore()).to.be.equal(0)
		expect(set3.getLoserScore()).to.be.equal(1)
		done()
	})

	it('should give the correct Bracket ID', function(done){
		expect(set1.getBracketId()).to.be.equal('58df119c60fbb')
		expect(set2.getBracketId()).to.be.equal('58df119c60fbb')
		expect(set3.getBracketId()).to.be.equal('58df119c60fbb')
		done()
	})

	it('should give the correct Winners Tournament Placement', function(done){
		
		let winner1 = set1.getWinner() as Player
		let data1 = winner1.data as IPlayer.Entity
		expect(set1.getWinnersTournamentPlacement()).to.be.equal(data1.finalPlacement);

		done();
	});

	it('should give the correct Winners Tournament Placement 2', function(done){
		let winner2 = set2.getWinner() as Player
		let data2 = winner2.data as IPlayer.Entity
		expect(set2.getWinnersTournamentPlacement()).to.be.equal(data2.finalPlacement);
		
		done()
	})

	it('should give the correct Winners Tournament Placement 3', function(done){
		let winner3 = set3.getWinner() as Player
		let data3 = winner3.data as IPlayer.Entity
		expect(set3.getWinnersTournamentPlacement()).to.be.equal(data3.finalPlacement);

		done();
	})

	it('should give the correct Losers Tournament Placement', function(done){
		let loser1 = set1.getLoser() as Player
		let data1 = loser1.data as IPlayer.Entity
		expect(set1.getLosersTournamentPlacement()).to.be.equal(data1.finalPlacement);

		done();
	});

	it('should give the correct Losers Tournament Placement 2', function(done){
		let loser2 = set2.getLoser() as Player
		let data2 = loser2.data as IPlayer.Entity
		expect(set2.getLosersTournamentPlacement()).to.be.equal(data2.finalPlacement);

		done()
	})

	it('should give the correct Losers Tournament Placement 3', function(done){
		let loser3 = set3.getLoser() as Player
		let data3 = loser3.data as IPlayer.Entity
		expect(set3.getLosersTournamentPlacement()).to.be.equal(data3.finalPlacement);

		done()
	})

	it('should give the correct Phase Group ID', function(done){
		expect(set1.getPhaseGroupId()).to.be.equal(327638)
		expect(set2.getPhaseGroupId()).to.be.equal(327638)
		expect(set3.getPhaseGroupId()).to.be.equal(327638)
		done()
	})

	it('should give the correct Midsize Round Text', function(done){
		expect(set1.getMidsizeRoundText()).to.be.equal('Winners 1')
		expect(set2.getMidsizeRoundText()).to.be.equal('Winners Quarters')
		expect(set3.getMidsizeRoundText()).to.be.equal('Winners Quarters')
		done()
	})
})