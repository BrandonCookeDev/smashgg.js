/* eslint-disable */
'use strict';

let chai = require('chai');
let expect = chai.expect;

let Character = require('../lib/Character');
let Cache = require('../lib/util/Cache');

describe('Smashgg Character', function(){

	beforeEach(async function(){
		await Cache.getInstance().flush()
	})

	it('should get all characters', async function(){
		this.timeout(10000);

		let characters = await Character.getAll({isCached: false});
		expect(characters.length > 0).to.be.true;

		characters.forEach(character => {
			expect(character).to.be.instanceof(Character);
		});

		return true;
	})

	it('should get all characters for a game by game id', async function(){
		this.timeout(10000);

		let meleeCharacters = await Character.getCharactersByGameId(1, {isCached: false});
		let pmCharacters = await Character.getCharactersByGameId(2, {isCached: false});

		expect(meleeCharacters.length).to.be.equal(27);
		expect(pmCharacters.length).to.be.equal(42);

		meleeCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character);
		})

		pmCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character);
		})

		return true;
	})

	it('should get all characters for a game by game name', async function(){
		this.timeout(10000);

		let meleeCharacters = await Character.getCharactersByGameName('melee', {isCached: false});
		let pmCharacters = await Character.getCharactersByGameName('pm', {isCached: false});

		expect(meleeCharacters.length).to.be.equal(27);
		expect(pmCharacters.length).to.be.equal(42);

		meleeCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character);
		})

		pmCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character);
		})

		return true;
	})

	it('should get characters by their name', async function(){
		this.timeout(10000);

		let bowser = await Character.getCharactersByName('bowser', {isCached: false});
		let wolf = await Character.getCharactersByName('wolf', {isCached: false});

		expect(bowser.length).to.be.equal(5);
		expect(wolf.length).to.be.equal(2);

		bowser.forEach(character => {
			expect(character).to.be.instanceof(Character);
		})
		wolf.forEach(character => {
			expect(character).to.be.instanceof(Character);
		})

		expect(bowser[0].id).to.be.equal(1);
		expect(bowser[0].videogameId).to.be.equal(1);

		expect(wolf[0].id).to.be.equal(116);
		expect(wolf[0].videogameId).to.be.equal(2);

		return true;
	})
})