/* eslint-disable */
'use strict';

let _ = require('lodash');

let Event = require('../lib/Event');
let Phase = require('../lib/Phase');
let PhaseGroup = require('../lib/PhaseGroup');
let Cache = require('../lib/util/Cache').getInstance();
let Set = require('../lib/Set');
let Player = require('../lib/Player');

let moment = require('moment');
let sinon = require('sinon');
let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let expected = _.extend(
	require('./data/testSets')
);

let ID1 = 111483;
let ID2 = 45262;
let ID3 = 100046;

let phase1, phase2, phase3;
let concurrency = 4;


function loadPhase(id, options){
	return new Promise(function(resolve, reject){
		let P = new Phase(id, options);
		P.on('ready', function(){
			resolve(P);
		})
	})
}

describe('Smash GG Phase', function(){

	before( () => console.log('concurrency set to %s', concurrency) );

	beforeEach(function(){
		Cache.flush();
	});

	it('should correctly load the Phase', async function(){
		this.timeout(10000);

		phase1 = await loadPhase(ID1, {rawEncoding: 'utf8'});
		phase2 = await loadPhase(ID2);
		phase3 = await loadPhase(ID3, {rawEncoding: 'base64'});
		return true;
	});

	it('should implement the convenience methods correctly', async function(){
		this.timeout(10000);

		let cPhase1 = await Phase.getPhase(ID1, {rawEncoding: 'utf8'});
		let cPhase2 = await Phase.getPhase(ID2);
		let cPhase3 = await Phase.getPhase(ID3, {rawEncoding: 'base64'});

		expect(cPhase1.data).to.deep.equal(phase1.data);
		expect(cPhase2.data).to.deep.equal(phase2.data);
		expect(cPhase3.data).to.deep.equal(phase3.data);

		return true;
	})

	it('should get the name of the Phase', function(done){
		expect(phase1.getName()).to.be.equal('Pools');
		expect(phase2.getName()).to.be.equal('Pools');
		expect(phase3.getName()).to.be.equal('Bracket Pools');
		done();
	});

	it('should get the event id', function(done){
		expect(phase1.getEventId()).to.be.equal(25545);
		expect(phase2.getEventId()).to.be.equal(11787);
		expect(phase3.getEventId()).to.be.equal(23596);
		done();
	});

	it('should correctly get all phase groups', async function(){
		this.timeout(45000);

		let phaseGroups1 = await phase1.getPhaseGroups({concurrency: concurrency});
		let phaseGroups2 = await phase2.getPhaseGroups({concurrency: concurrency});
		let phaseGroups3 = await phase3.getPhaseGroups({concurrency: concurrency});

		expect(phaseGroups1.length).to.be.equal(16);
		expect(phaseGroups2.length).to.be.equal(32);
		expect(phaseGroups3.length).to.be.equal(16);

		var hasDuplicates = function(a) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phaseGroups1)).to.be.false;
		expect(hasDuplicates(phaseGroups2)).to.be.false;
		expect(hasDuplicates(phaseGroups3)).to.be.false;

		phaseGroups1.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});
		phaseGroups2.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});
		phaseGroups3.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});

		return true;
	});

	it('should correctly get all sets for a phase', async function(){
		this.timeout(30000);

		let sets1 = await phase1.getSets({concurrency: concurrency});
		let sets2 = await phase2.getSets({concurrency: concurrency});

		expect(sets1.length).to.be.equal(248);
		expect(sets2.length).to.be.equal(1292);

		sets1.forEach(set => {
			expect(set).to.be.instanceof(Set);
		})
		sets2.forEach(set => {
			expect(set).to.be.instanceof(Set);
		})

		return true;
	})

	it('should correctly get all players for a phase', async function(){
		this.timeout(30000);
		
		let players1 = await phase1.getPlayers({concurrency: concurrency});
		let players2 = await phase2.getPlayers({concurrency: concurrency});

		expect(players1.length).to.be.equal(156);
		expect(players2.length).to.be.equal(678);

		players1.forEach(set => {
			expect(set).to.be.instanceof(Player);
		})
		players2.forEach(set => {
			expect(set).to.be.instanceof(Player);
		})

		return true;
	})

	it('should correctly get sets x minutes back', async function(){
		this.timeout(30000);

		let minutesBack = 5;
		let event = await Event.getEvent(phase1.getEventId());
		let eventDate = moment(event.getStartTime()).add(30, 'minutes').toDate();

		let clock = sinon.useFakeTimers(eventDate);
		let sets = await phase1.getSetsXMinutesBack(minutesBack);
		expect(sets.length).to.be.equal(5);
		sets.forEach(set=> {
			expect(set).to.be.instanceof(Set);

			let now = moment();
			let then = moment(set.getCompletedAt());
			let diff = moment.duration(now.diff(then)).minutes();
			expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
		})
		clock.restore();
		return true;
	})
});