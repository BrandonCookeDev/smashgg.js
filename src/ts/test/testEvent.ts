/* eslint-disable */
'use strict';
import '../lib/util/ErrorHandler'

import _ from 'lodash'
import moment from 'moment'
import sinon from 'sinon'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect, assert} = chai

const TOP_8_LABELS = [
	'Losers Quarter-Final', 'Losers Quarter-Final', 
	'Losers Semi-Final', 'Losers Semi-Final', 
	'Winners Semi-Final', 'Winners Semi-Final',
	'Winners Final', 'Grand Final', 'Losers Final'
]
const GRAND_FINAL_RESET_TOKEN = 'Grand Final Reset'

import {Phase, PhaseGroup, GGSet, Player, Event, IEvent} from  '../lib/internal'
import Cache from '../lib/util/Cache'
import log from '../lib/util/Logger'
import { setLogLevel } from '../lib/util/Logger'

let event1: Event;
let event2: Event;
let event3: Event;
let event4: Event;

const TOURNAMENT_NAME1 = 'function-1-recursion-regional';
const EVENT_NAME1 = 'melee-singles';

const TOURNAMENT_NAME2 = 'ceo-2016';
const TOURNAMENT_NAME3 = 'tipped-off-12-presented-by-the-lab-gaming-center';
const BAD_TOURNAMENT_NAME = 'badnamedotexe';

const EVENT_ID_1 = 14335


let concurrency = 4;

function loadEvent(eventName: string, tournamentName: string, options: IEvent.Options) : Promise<Event> {
	return new Promise(function(resolve, reject){
		let event = new Event(eventName, tournamentName, options)
		event.on('ready', function(){
			resolve(event)
		})
		event.on('error', console.error)
	})
}

function loadEventViaId(id: number, options: IEvent.Options) : Promise<Event> {
	return new Promise(function(resolve, reject){
		if(isNaN(id))
			return reject('ID must be an integer');
		let event = new Event(id, undefined, options);
		event.on('ready', function(){
			resolve(event)
		})
		event.on('error', function(err){
			console.error(err)
		})
	})
}

describe('Smash GG Event', function(){

	before(async function(){ 
		this.timeout(10000)

		console.time('Before All')
		console.log('concurrency set to %s', concurrency)
		
		event1 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncoding: 'utf8'});
		event2 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME2, {});
		event3 = await loadEventViaId(EVENT_ID_1, {rawEncoding: 'base64'});
		event4 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME3, {})

		console.timeEnd('Before All')
		return true;
	});

	beforeEach(function(){
		Cache.flush();
		setLogLevel('info')
	});

	xit('should correctly load the data', async function(){
		this.timeout(30000);

		event1 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncoding: 'utf8'});
		event2 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME2, {});
		event3 = await loadEventViaId(EVENT_ID_1, {rawEncoding: 'base64'});

		return true
	})

	xit('should correctly implement convenience methods', async function(){
		this.timeout(15000)

		let cEvent1 = await Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncoding: 'utf8'})
		let cEvent2 = await Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME2)
		let cEvent3 = await Event.getEventById(EVENT_ID_1, {rawEncoding: 'base64'})

		expect(cEvent1.data).to.deep.equal(event1.data)
		expect(cEvent2.data).to.deep.equal(event2.data)
		expect(cEvent3.data).to.deep.equal(event3.data)

		return true
	})

	it('should correctly get the event name', function(done){
		let name1 = event1.getName()
		let name3 = event3.getName()
		expect(name1).to.be.equal('Melee Singles')
		expect(name3).to.be.equal('Rocket League 3v3')
		done()
	})

	it('should correctly get the event slug', function(done){
		let slug = event1.getSlug()
		expect(slug).to.be.equal('tournament/function-1-recursion-regional/event/melee-singles')
		done()
	})

	it('should correctly get the event start time', function(done){
		let startTime1 = event1.getStartTime() as Date;
		let expected = moment('04-01-2017 11:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
		expect(startTime1.getTime()).to.be.equal(expected.getTime());
		done();
	});

	it('should correctly get the event start time string', function(done){
		let startTime1 = event1.getStartTimeString()

		try {
			expect(startTime1).to.be.equal('04-01-2017 11:00:00 EST')
		}
		catch(e){
			expect(startTime1).to.be.equal('04-01-2017 11:00:00 EDT')
		}
		done()
	})

	it('should correctly get the event end time', function(done){
		let endTime1 = event1.getEndTime() as Date;
		let expected = moment('04-01-2017 12:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
		expect(endTime1.getTime()).to.be.equal(expected.getTime());
		done();
	});

	xit('should correctly get the event end time string', function(done){
		let endTime1 = event1.getEndTimeString()

		try {
			expect(endTime1).to.be.equal('04-01-2017 12:00:00 EST')
		}
		catch(e){
			expect(endTime1).to.be.equal('04-01-2017 12:00:00 EDT')
		}
		done()
	})

	it('should correctly get the tournament slugs', function(){
		let slug1 = event1.getTournamentSlug()
		let slug2 = event2.getTournamentSlug()
		let slug3 = event3.getTournamentSlug()

		expect(slug1).to.be.equal('tournament/function-1-recursion-regional')
		expect(slug2).to.be.equal('tournament/ceo-2016')
		expect(slug3).to.be.equal('tournament/pulsar-premier-league')
	})

	it('should correctly get the phases', async function(){
		this.timeout(15000)

		let phases1 = await event1.getEventPhases({concurrency: concurrency});

		expect(phases1.length).to.be.equal(4);

		var hasDuplicates = function(a: Array<Phase>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phases1)).to.be.false;

		phases1.forEach(phase => {
			expect(phase).to.be.instanceof(Phase)
		})


		return true;
	});

	it('should correctly get the phases 2', async function(){
		this.timeout(15000);
		
		let phases2 = await event2.getEventPhases({concurrency: concurrency});

		expect(phases2.length).to.be.equal(2);
	
		var hasDuplicates = function(a: Array<Phase>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phases2)).to.be.false;

		phases2.forEach(phase => {
			expect(phase).to.be.instanceof(Phase)
		})

		return true;
	})

	it('should correctly get the phase groups', async function(){
		this.timeout(25000)

		let groups1 = await event1.getEventPhaseGroups({concurrency: concurrency});

		expect(groups1.length).to.be.equal(22);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups1)).to.be.false;

		groups1.forEach(group => {
			expect(group).to.be.instanceof(PhaseGroup);
		});

		return true;
	})

	it('should correctly get the phase groups 2', async function(){
		this.timeout(25000);
		
		let groups2 = await event2.getEventPhaseGroups({concurrency: concurrency});

		expect(groups2.length).to.be.equal(33);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(groups2)).to.be.false;

		groups2.forEach(group => {
			expect(group).to.be.instanceof(PhaseGroup)
		})

		return true
	})

	it('should correctly get all sets from an event', async function(){
		this.timeout(30000)

		let sets1 = await event1.getSets({concurrency: concurrency});

		expect(sets1.length).to.be.equal(469);

		sets1.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	xit('should correctly get all sets from an event 2', async function(){
		this.timeout(30000);
		
		let sets2 = await event2.getSets({concurrency: concurrency});

		expect(sets2.length).to.be.equal(1386);

		
		sets2.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true
	})

	it('should correctly get all top 8 sets from an event', async function(){
		this.timeout(30000);
		setLogLevel('verbose')

		let sets = await event1.getTop8Sets({concurrency: concurrency})

		expect(sets.length).to.be.equal(10)

		let rounds = sets.map(set => set.getRound())
		expect(rounds).to.include.members(TOP_8_LABELS)
		expect(rounds).to.include.members(['Losers Round 7', 'Losers Round 7'])

		sets.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	it('should correctly get all top 8 sets from an event 2', async function(){
		this.timeout(30000);
		setLogLevel('verbose')

		let sets = await event2.getTop8Sets({concurrency: concurrency})

		expect(sets.length).to.be.equal(10)

		let rounds = sets.map(set => set.getRound())
		expect(rounds).to.include.members(TOP_8_LABELS)
		expect(rounds).to.include.members(['Losers Round 7', 'Losers Round 7'])

		sets.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	it('should correctly get all top 8 sets from an event 3', async function(){
		this.timeout(30000);

		expect(await event3.getTop8Sets({concurrency: concurrency})).to.be.empty

		return true;
	})

	it('should correctly get all top 8 sets from an event 4', async function(){
		this.timeout(30000);
		setLogLevel('verbose')

		let sets = await event4.getTop8Sets({concurrency: concurrency})

		expect(sets.length).to.be.equal(10)

		let rounds = sets.map(set => set.getRound())
		expect(rounds).to.include.members(TOP_8_LABELS)
		expect(rounds).to.include.members(['Losers Round 1', 'Losers Round 1'])

		sets.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	it('should correctly get all players from an event', async function(){
		this.timeout(30000)
		
		let players1 = await event1.getPlayers({concurrency: concurrency});

		expect(players1.length).to.be.equal(156);

		players1.forEach(set => {
			expect(set).to.be.instanceof(Player)
		})

		return true;
	})

	it('should correctly get all players from an event 2', async function(){
		this.timeout(30000);
		
		let players2 = await event2.getPlayers({concurrency: concurrency});

		expect(players2.length).to.be.equal(678);

		players2.forEach(set => {
			expect(set).to.be.instanceof(Player)
		})

		return true
	})

	it('should correctly get all sets x minutes back', async function(){
		this.timeout(30000)

		let minutesBack = 15
		let eventDate = new Date('Wed Dec 31 1969 19:00:00 GMT-0500 (EST)')
		//moment(event1.getStartTime()).add(30, 'minutes').toDate()
		sinon.useFakeTimers(eventDate)
		let sets = await event1.getSetsXMinutesBack(minutesBack)
		expect(sets.length).to.be.equal(3)
		sets.forEach(set => {
			expect(set).to.be.instanceof(GGSet);

			let now = moment();
			let then = moment(set.getCompletedAt() as Date);
			let diff = moment.duration(now.diff(then)).minutes();
			expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
		})
		sinon.restore()
		return true
	})
})