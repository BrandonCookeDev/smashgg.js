/* eslint-disable */
'use strict';

Promise = require('bluebird');
let _ = require('lodash');

let Set = require('../lib/Set');
let PhaseGroup = require('../lib/PhaseGroup');
let Cache = require('../lib/util/Cache').getInstance();

let sinon = require('sinon');
let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let phaseGroup1 = {};
let phaseGroup2 = {};
let phaseGroup3 = {};
let phaseGroup4 = {};

const ID1 = 0;
const ID2 = 44445;
const ID3 = 301994;

let expected = _.extend(

);


function loadPhaseGroup(id, options){
	return new Promise(function(resolve, reject){
		let PG = new PhaseGroup(id, options);
		PG.on('ready', function(){
			resolve(PG);
		})
	})
}


describe('Smash GG Phase Group', function(){

	beforeEach(function(){
		Cache.flush();
	});

	it('should correctly load Phase Group data', function(done){
		this.timeout(5000);

		phaseGroup3 = new PhaseGroup(ID3, {rawEncoding: 'base64'});
		phaseGroup3.on('ready', done);
	});

	it('should implement the convenience methods correctly', async function(){
		this.timeout(5000);
		let cPhaseGroup3 = await PhaseGroup.getPhaseGroup(ID3, {rawEncoding: 'base64'});
		expect(cPhaseGroup3.data).to.deep.equal(phaseGroup3.data);
		return true;
	})

	it('should correctly return the phase id', function(done){
		let phaseId1 = phaseGroup3.getPhaseId();
		expect(phaseId1).to.be.equal(100046);
		done();
	});

	it('should get all entrants', async function(){
		this.timeout(5000);

		let players = await phaseGroup3.getPlayers();
		expect(players.length).to.be.equal(15);
		return true;
	});

	it('should get all sets', async function(){
		this.timeout(5000);

		let sets = await phaseGroup3.getSets();
		expect(sets.length).to.be.equal(27);
		return true;
	});

	it('should get sets completed within x minutes ago', async function(){
		this.timeout(5000);

		let clock = sinon.useFakeTimers(new Date('Sat Nov 11 2017 11:50:47 GMT-0500 (EST)'));
		let sets = await phaseGroup3.getSetsXMinutesBack(5);

		expect(sets.length).to.be.equal(4);
		sets.forEach(set => {
			expect(set).to.be.instanceof(Set);
		})

		clock.restore();
		return true;
	})

});