/* eslint-disable */
'use strict';
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
require('../lib/util/Initializer')(process.env.API_TOKEN || '<insert your token here>');

Promise = require('bluebird');

let _ = require('lodash');
let moment = require('moment');

let Set = require('../lib/Set');
let Player = require('../lib/Player');
let Event = require('../lib/Event');
let Phase = require('../lib/Phase');
let PhaseGroup = require('../lib/PhaseGroup');
let Cache = require('../lib/util/Cache');

let sinon = require('sinon');
let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, require('./log-options.json'))

let event1 = {};
let event2 = {};
let event3 = {};
let event4 = {};

const TOURNAMENT_NAME1 = 'function1';
const EVENT_NAME1 = 'melee-singles';

const TOURNAMENT_NAME2 = 'ceo2016';
const TOURNAMENT_NAME3 = 'to12';
const BAD_TOURNAMENT_NAME = 'badnamedotexe';

const EVENT_ID_1 = 14335;

let expected = _.extend(

);

let concurrency = 2;

function loadEvent(eventName, tournamentName, options){
	return new Promise(function(resolve, reject){
		let event = new Event(eventName, tournamentName, options);
		event.on('ready', function(){
			resolve(event);
		})
	})
}

function loadEventViaId(id, options){
	return new Promise(function(resolve, reject){
		if(isNaN(id))
			return reject('ID must be an integer');
		let event = new Event(id, null, options);
		event.on('ready', function(){
			resolve(event);
		})
		event.on('error', function(err){
			console.error(err);
		})
	})
}

describe('Smash GG Event', function(){

	before( () => console.log('concurrency set to %s', concurrency) );

	beforeEach(function(){
		Cache.flush();
	});

	it('should correctly load the data', async function(){
		this.timeout(30000);

		event1 = await Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncodng: 'utf8'});
		event2 = await Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME2);
		event3 = await Event.getEventById(EVENT_ID_1, {rawEncoding: 'base64'});

		return true;
	});

	it('should correctly implement convenience methods', async function(){
		this.timeout(15000);

		let cEvent1 = await Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncoding: 'utf8'});
		let cEvent2 = await Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME2);
		let cEvent3 = await Event.getEventById(EVENT_ID_1, {rawEncoding: 'base64'});

		expect(cEvent1.data).to.deep.equal(event1.data);
		expect(cEvent2.data).to.deep.equal(event2.data);
		expect(cEvent3.data).to.deep.equal(event3.data);

		return true;
	})

	it('should correctly get the event name', function(done){
		let name1 = event1.getName();
		let name3 = event3.getName();
		expect(name1).to.be.equal('Melee Singles');
		expect(name3).to.be.equal('Rocket League 3v3');
		done();
	});

	it('should correctly get the event slug', function(done){
		let slug = event1.getSlug();
		expect(slug).to.be.equal('tournament/function-1-recursion-regional/event/melee-singles');
		done();
	});

	it('should correctly get the event start time', function(done){
		let startTime1 = event1.getStartTime();
		let expected = moment('04-01-2017 11:00:00').toDate();
		expect(startTime1.getTime()).to.be.equal(expected.getTime());
		done();
	});

	it('should correctly get the event start time string', function(done){
		let startTime1 = event1.getStartTimeString();

		try {
			expect(startTime1).to.be.equal('04-01-2017 11:00:00 EST');
		}
		catch(e){
			expect(startTime1).to.be.equal('04-01-2017 11:00:00 EDT');
		}
		done();
	});

	it('should correctly get the event end time', function(done){
		let endTime1 = event1.getEndTime();
		let expected = moment('04-01-2017 12:00:00').toDate();
		expect(endTime1.getTime()).to.be.equal(expected.getTime());
		done();
	});

	it('should correctly get the event end time string', function(done){
		let endTime1 = event1.getEndTimeString();

		try {
			expect(endTime1).to.be.equal('04-01-2017 12:00:00 EST');
		}
		catch(e){
			expect(endTime1).to.be.equal('04-01-2017 12:00:00 EDT');
		}
		done();
	});

	it('should correctly get the tournament slugs', function(){
		let slug1 = event1.getTournamentSlug();
		let slug2 = event2.getTournamentSlug();
		let slug3 = event3.getTournamentSlug();

		expect(slug1).to.be.equal('function-1-recursion-regional');
		expect(slug2).to.be.equal('ceo-2016');
		expect(slug3).to.be.equal('pulsar-premier-league');
	})

	it('should correctly get the phases', async function(){
		this.timeout(15000);

		let phases1 = await event1.getEventPhases({concurrency: concurrency});
		let phases2 = await event2.getEventPhases({concurrency: concurrency});

		expect(phases1.length).to.be.equal(4);
		expect(phases2.length).to.be.equal(2);

		var hasDuplicates = function(a) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phases1)).to.be.false;
		expect(hasDuplicates(phases2)).to.be.false;

		phases1.forEach(phase => {
			expect(phase).to.be.instanceof(Phase);
		});

		phases2.forEach(phase => {
			expect(phase).to.be.instanceof(Phase);
		});

		return true;
	});

	it('should correctly get the phase groups', async function(){
		this.timeout(25000);

		let groups1 = await event1.getEventPhaseGroups({concurrency: concurrency});
		let groups2 = await event2.getEventPhaseGroups({concurrency: concurrency});

		expect(groups1.length).to.be.equal(22);
		expect(groups2.length).to.be.equal(33);

		var hasDuplicates = function(a) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups1)).to.be.false;
		expect(hasDuplicates(groups2)).to.be.false;

		groups1.forEach(group => {
			expect(group).to.be.instanceof(PhaseGroup);
		});
		groups2.forEach(group => {
			expect(group).to.be.instanceof(PhaseGroup);
		});

		return true;
	})

	it('should correctly get all sets from an event', async function(){
		this.timeout(30000);

		let sets1 = await event1.getSets({concurrency: concurrency});
		let sets2 = await event2.getSets({concurrency: concurrency});

		expect(sets1.length).to.be.equal(469);
		expect(sets2.length).to.be.equal(1386);

		sets1.forEach(set => {
			expect(set).to.be.instanceof(Set);
		})
		sets2.forEach(set => {
			expect(set).to.be.instanceof(Set);
		})

		return true;
	})

	it('should correctly get all players from an event', async function(){
		this.timeout(30000);
		
		let players1 = await event1.getPlayers({concurrency: concurrency});
		let players2 = await event2.getPlayers({concurrency: concurrency});

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

	it('should correctly get all sets x minutes back', async function(){
		this.timeout(30000);

		let minutesBack = 15;
		let eventDate = new Date('Wed Dec 31 1969 19:00:00 GMT-0500 (EST)');
		//moment(event1.getStartTime()).add(30, 'minutes').toDate();
		sinon.useFakeTimers(eventDate);
		let sets = await event1.getSetsXMinutesBack(minutesBack);
		expect(sets.length).to.be.equal(3);
		sets.forEach(set => {
			expect(set).to.be.instanceof(Set);

			let now = moment();
			let then = moment(set.getCompletedAt());
			let diff = moment.duration(now.diff(then)).minutes();
			expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
		})
		sinon.restore();
		return true;
	})
});