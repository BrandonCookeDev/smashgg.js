/* eslint-disable */
'use strict';

let chai = require('chai');
let expect = chai.expect;

let VideoGame = require('../lib/VideoGame');
let Cache = require('../lib/util/Cache');

let expected = {
	Melee: {id:1,name:'Super Smash Bros. Melee',abbrev:'Melee',displayName:'Melee',minPerEntry:1,maxPerEntry:2,approved:true,slug:'melee',isCardGame:null},
	PM: {id:2,name:'Project M',abbrev:'pm',displayName:'PM',minPerEntry:null,maxPerEntry:null,approved:true,slug:'pm',isCardGame:null}
}

describe('SmashGG VideoGame', function(){
	
	before(async function(){
		Cache.getInstance().flush();
	})

	it('should get all video games from api', async function(){
		let videoGames = await VideoGame.getAll();
		videoGames.forEach(e => {
			expect(e).to.be.instanceof(VideoGame);
		})
		return true;
	})

	it('should get correct video game by id', async function(){
		let vg1 = await VideoGame.getById(1);
		let vg2 = await VideoGame.getById(2);

		expect(vg1).to.deep.equal(expected.Melee);
		expect(vg2).to.deep.equal(expected.PM);

		return true;
	})

	it('should get correct video game by name', async function(){
		let vg1 = await VideoGame.getByName('Super Smash Bros. Melee');
		let vg2 = await VideoGame.getByName('pm');

		expect(vg1).to.deep.equal(expected.Melee);
		expect(vg2).to.deep.equal(expected.PM);

		return true;
	})
})