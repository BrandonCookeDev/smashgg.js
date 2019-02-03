import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import sinon from 'sinon'
import {expect, assert} from 'chai'
import {Game, Selections} from '../lib/Game'
import Initializer from '../lib/util/Initializer'

import * as testData from './data/games.testData';
let games1: Game[], games2: Game[], games3: Game[]
let selections1: Selections, selections2: Selections, selections3: Selections

describe('smash.gg Game', function(){
	before(async function(){
		await Initializer(process.env.API_TOKEN!)
		games1 = Game.parseFull(testData.games1Full)
		games2 = Game.parseFull(testData.games2Full)
		games3 = Game.parseFull(testData.games3Full)
		selections1 = Selections.parse(testData.selectionsS1G1P2)
		selections2 = Selections.parse(testData.selectionsS1G2P2)
		selections3 = Selections.parse(testData.selectionsS1G3P2)
		return true
	})

	// id
	it('should return the id of a game 1', function(){
		for(var i = 0; i < games1.length; i++){
			let game = games1[i]
			expect(game.getId()).to.be.equal(+testData.games1[i].id)
		}
	})
	it('should return the id of a game 2', function(){
		for(var i = 0; i < games2.length; i++){
			let game = games2[i]
			expect(game.getId()).to.be.equal(+testData.games2[i].id)
		}
	})
	it('should return the id of a game 3', function(){
		for(var i = 0; i < games3.length; i++){
			let game = games3[i]
			expect(game.getId()).to.be.equal(+testData.games3[i].id)
		}
	})

	// state
	it('should return the state of a game 1', function(){
		for(var i = 0; i < games1.length; i++){
			let game = games1[i]
			expect(game.getState()).to.be.equal(testData.games1[i].state)
		}
	})
	it('should return the state of a game 2', function(){
		for(var i = 0; i < games2.length; i++){
			let game = games2[i]
			expect(game.getState()).to.be.equal(testData.games2[i].state)
		}
	})
	it('should return the state of a game 3', function(){
		for(var i = 0; i < games3.length; i++){
			let game = games3[i]
			expect(game.getState()).to.be.equal(testData.games3[i].state)
		}
	})

	// winner id
	it('should return the winner id of a game 1', function(){
		for(var i = 0; i < games1.length; i++){
			let game = games1[i]
			expect(game.getWinnerId()).to.be.equal(testData.games1[i].winnerId)
		}
	})
	it('should return the winner id of a game 2', function(){
		for(var i = 0; i < games2.length; i++){
			let game = games2[i]
			expect(game.getWinnerId()).to.be.equal(testData.games2[i].winnerId)
		}
	})
	it('should return the winner id of a game 3', function(){
		for(var i = 0; i < games3.length; i++){
			let game = games3[i]
			expect(game.getWinnerId()).to.be.equal(testData.games3[i].winnerId)
		}
	})

	// order number
	it('should return the order number of a game 1', function(){
		for(var i = 0; i < games1.length; i++){
			let game = games1[i]
			expect(game.getOrderNumber()).to.be.equal(testData.games1[i].orderNum)
		}
	})
	it('should return the order number of a game 2', function(){
		for(var i = 0; i < games2.length; i++){
			let game = games2[i]
			expect(game.getOrderNumber()).to.be.equal(testData.games2[i].orderNum)
		}
	})
	it('should return the order number of a game 3', function(){
		for(var i = 0; i < games3.length; i++){
			let game = games3[i]
			expect(game.getOrderNumber()).to.be.equal(testData.games3[i].orderNum)
		}
	})

	// selections
	it('should return the correct array of selections 1', function(){
		for(var i = 0; i < games1.length; i++){
			let game = games1[i]
			expect(game.getSelections()).to.have.deep.members(Selections.parseArray(testData.games1[i].selections))
		}
	})
	it('should return the correct array of selections 3', function(){
		for(var i = 0; i < games2.length; i++){
			let game = games2[i]
			expect(game.getSelections()).to.have.deep.members(Selections.parseArray(testData.games2[i].selections))
		}
	})
	it('should return the correct array of selections 2', function(){
		for(var i = 0; i < games3.length; i++){
			let game = games3[i]
			expect(game.getSelections()).to.have.deep.members(Selections.parseArray(testData.games3[i].selections))
		}
	})

	// selection by entrant id
	it('should return the correct selections for a given entrant id 1', function(){
		expect(games1[0].getSelectionsForEntrantId(games1[0].getWinnerId())).to.deep.equal(selections1);
	})
	it('should return the correct selections for a given entrant id 1', function(){
		expect(games1[0].getSelectionsForEntrantId(games1[1].getWinnerId())).to.deep.equal(selections2);
	})
	it('should return the correct selections for a given entrant id 1', function(){
		expect(games1[0].getSelectionsForEntrantId(games1[2].getWinnerId())).to.deep.equal(selections3);
	})

	// selection type
	it('should return the correct selection type for a selection 1', function(){
		expect(selections1.getSelectionType()).to.be.equal(testData.selectionsS1G1P2.selectionType);
	})
	it('should return the correct selection type for a selection 2', function(){
		expect(selections2.getSelectionType()).to.be.equal(testData.selectionsS1G2P2.selectionType);
	})
	it('should return the correct selection type for a selection 3', function(){
		expect(selections3.getSelectionType()).to.be.equal(testData.selectionsS1G3P2.selectionType);
	})

	// selection value
	it('should return the correct selection value for a selection 1', function(){
		expect(selections1.getSelectionValue()).to.be.equal(testData.selectionsS1G1P2.selectionValue);
	})
	it('should return the correct selection value for a selection 2', function(){
		expect(selections2.getSelectionValue()).to.be.equal(testData.selectionsS1G2P2.selectionValue);
	})
	it('should return the correct selection value for a selection 3', function(){
		expect(selections3.getSelectionValue()).to.be.equal(testData.selectionsS1G3P2.selectionValue);
	})

	// entrant id
	it('should return the correct entrantId for a selection 1', function(){
		expect(selections1.getEntrantId()).to.be.equal(testData.selectionsS1G1P2.entrantId);
	})
	it('should return the correct entrantId for a selection 2', function(){
		expect(selections2.getEntrantId()).to.be.equal(testData.selectionsS1G2P2.entrantId);
	})
	it('should return the correct entrantId for a selection 3', function(){
		expect(selections3.getEntrantId()).to.be.equal(testData.selectionsS1G3P2.entrantId);
	})

	// participant id
	it('should return the correct attendeeId for a selection 1', function(){
		expect(selections1.getAttendeeId()).to.be.equal(testData.selectionsS1G1P2.participantId);
	})
	it('should return the correct attendeeId for a selection 2', function(){
		expect(selections2.getAttendeeId()).to.be.equal(testData.selectionsS1G2P2.participantId);
	})
	it('should return the correct attendeeId for a selection 3', function(){
		expect(selections3.getAttendeeId()).to.be.equal(testData.selectionsS1G3P2.participantId);
	})
})