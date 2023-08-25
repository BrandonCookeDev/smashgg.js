/* eslint-disable */
import '../lib/util/ErrorHandler'

import _ from 'lodash'
import moment from 'moment'
import sinon from 'sinon'
import chai from 'chai'
import cap from 'chai-as-promised'
const { expect } = chai;
chai.use(cap)

import { Tournament, ITournament, Player, GGSet, Event } from '../lib/internal'
import Cache from '../lib/util/Cache'

let tournament1: Tournament;
let tournament2: Tournament;
let tournament3: Tournament;
let tournament4: Tournament;
let tournament5: Tournament;
let tournament6: Tournament;

const TOURNAMENT_NAME1 = 'function1';
const TOURNAMENT_NAME2 = 'ceo2016';
const TOURNAMENT_NAME3 = 'to12';
const BAD_TOURNAMENT_NAME = 'badnamedotexe';

import expected from './data/expectedTournaments';

let concurrency = 2;

function loadTournament(name: string, options: ITournament.Options) : Promise<Tournament>{
	return new Promise(function(resolve, reject){
		let t = new Tournament(name, options);
		t.on('ready', function(){
			return resolve(t);
		})
	})
}

describe('Smash GG Tournament', function(){

	before( () => console.log('concurrency set to %s', concurrency))

	beforeEach(function(){
		Cache.flush();
	});

	it('should correctly load tournament data', async function(){
		this.timeout(10000);

		tournament1 = await loadTournament(TOURNAMENT_NAME1, {rawEncoding: 'utf8'});
		tournament2 = await loadTournament(TOURNAMENT_NAME2, {rawEncoding: 'base64'});
		tournament3 = await loadTournament(TOURNAMENT_NAME3, {
				expands: {
					event:true,
					phase:true,
					groups:true,
					stations:true
				}
			}
		);

		/*
		tournament4 = await loadTournament(TOURNAMENT_NAME1, {
			isCached: false,
			rawEncoding: 'utf8'
		})
		tournament5 = await loadTournament(TOURNAMENT_NAME2, {
			isCached: false,
			rawEncoding: 'base64'
		})
		*/


		// TODO BAD TOURNAMENT TEST
		//tournament4 = await loadTournament(BAD_TOURNAMENT_NAME);

		return true;

	});

	it('should implement convenience methods correctly', async function(){
		this.timeout(15000);

		let cTournament1: Tournament = await Tournament.getTournament(TOURNAMENT_NAME1, {rawEncoding: 'utf8'});
		let cTournament2: Tournament = await Tournament.getTournament(TOURNAMENT_NAME2, {rawEncoding: 'base64'});
		let cTournament3: Tournament = await Tournament.getTournament(TOURNAMENT_NAME3);

		expect(cTournament1.data).to.deep.equal(tournament1.data);
		expect(cTournament2.data).to.deep.equal(tournament2.data);
		expect(cTournament3.data).to.deep.equal(tournament3.data);

		return true;
	})

	it('should return the correct tournament id', function(done){
		let id1 = tournament1.getId();
		let id2 = tournament2.getId();

		expect(id1).to.be.equal(expected.tournaments.function1.entities.tournament.id);
		expect(id2).to.be.equal(expected.tournaments.ceo2016.entities.tournament.id);

		done();
	});

	it('should return the correct tournament name', function(done){
		let name1 = tournament1.getName();
		let name2 = tournament2.getName();

		expect(name1).to.be.equal(expected.tournaments.function1.entities.tournament.name);
		expect(name2).to.be.equal(expected.tournaments.ceo2016.entities.tournament.name);

		done();
	});

	it('should return the correct tournament slug', function(done){
		let slug1 = tournament1.getSlug();
		let slug2 = tournament2.getSlug();

		expect(slug1).to.be.equal(expected.tournaments.function1.entities.tournament.slug);
		expect(slug2).to.be.equal(expected.tournaments.ceo2016.entities.tournament.slug);

		done();
	});

	it('should return the correct starting time', function(done){
		let startTime1 = tournament1.getStartTime() as Date;
		let startTime2 = tournament2.getStartTime() as Date;

		let expected1 = moment('04-01-2017 11:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
		let expected2 = moment('06-24-2016 00:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();

		expect(startTime1.getTime()).to.be.equal(expected1.getTime());
		expect(startTime2.getTime()).to.be.equal(expected2.getTime());

		done();
	});

	it('should return the correct starting time string', function(done){
		let startTime1 = tournament1.getStartTimeString();
		let startTime2 = tournament2.getStartTimeString();

		try {
			expect(startTime1).to.be.equal('04-01-2017 11:00:00 EST');
		}
		catch(e){
			expect(startTime1).to.be.equal('04-01-2017 11:00:00 EDT');
		}

		try {
			expect(startTime2).to.be.equal('06-24-2016 00:00:00 EST');
		}
		catch(e){
			expect(startTime2).to.be.equal('06-24-2016 00:00:00 EDT');
		}

		done();
	});

	it('should return the correct end time', function(done){
		let endTime1 = tournament1.getEndTime() as Date;
		let endTime2 = tournament2.getEndTime() as Date;

		let expected1 = moment('04-01-2017 23:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
		let expected2 = moment('06-27-2016 00:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();

		expect(endTime1.getTime()).to.be.equal(expected1.getTime());
		expect(endTime2.getTime()).to.be.equal(expected2.getTime());

		done();
	});

	it('should return the correct end time string', function(done){
		let endTime1 = tournament1.getEndTimeString();
		let endTime2 = tournament2.getEndTimeString();

		try {
			expect(endTime1).to.be.equal('04-01-2017 23:00:00 EST');
		}
		catch(e){
			expect(endTime1).to.be.equal('04-01-2017 23:00:00 EDT');
		}

		try {
			expect(endTime2).to.be.equal('06-27-2016 00:00:00 EST');
		}
		catch(e){
			expect(endTime2).to.be.equal('06-27-2016 00:00:00 EDT');
		}

		done();
	});

	it('should return the correct time registration closes', function(done){
		let closesTime1 = tournament1.getWhenRegistrationCloses() as Date;
		let closesTime2 = tournament2.getWhenRegistrationCloses() as Date;

		let expected1 = moment('03-30-2017 02:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
		let expected2 = moment('06-13-2016 08:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();

		expect(closesTime1.getTime()).to.be.equal(expected1.getTime());
		expect(closesTime2.getTime()).to.be.equal(expected2.getTime());

		done();
	});

	it('should return the correct time registration closes string', function(done){
		let closesTime1 = tournament1.getWhenRegistrationClosesString();
		let closesTime2 = tournament2.getWhenRegistrationClosesString();

		try {
			expect(closesTime1).to.be.equal('03-30-2017 02:00:00 EST');
		}
		catch(e){
			expect(closesTime1).to.be.equal('03-30-2017 02:00:00 EDT');
		}

		try {
			expect(closesTime2).to.be.equal('06-13-2016 08:00:00 EST');
		}
		catch(e){
			expect(closesTime2).to.be.equal('06-13-2016 08:00:00 EDT');
		}

		done();
	});

	it('should return the correct state', function(done){
		let state1 = tournament1.getState();
		let state2 = tournament2.getState();

		expect(state1).to.be.equal('GA');
		expect(state2).to.be.equal('FL');

		done();
	});

	it('should return the correct city', function(done){
		let city1 = tournament1.getCity();
		let city2 = tournament2.getCity();

		expect(city1).to.be.equal('Atlanta');
		expect(city2).to.be.equal('Orlando');

		done();
	});

	it('should return the correct zip code', function(done){
		let zip1 = tournament1.getZipCode();
		let zip2 = tournament2.getZipCode();

		expect(zip1).to.be.equal('30339');
		expect(zip2).to.be.equal('32819');

		done()
	});

	it('should return the correct owner id', function(done){
		let ownerId1 = tournament1.getOwnerId();
		let ownerId2 = tournament2.getOwnerId();

		expect(ownerId1).to.be.equal(421);
		expect(ownerId2).to.be.equal(3431);

		done();
	});

	it('should return the correct contact twitter', function(done){
		let twitter1 = tournament1.getContactTwitter();
		let twitter2 = tournament2.getContactTwitter();

		expect(twitter1).to.be.equal('recursiongg');
		expect(twitter2).to.be.equal('ceogaming');

		done()
	});

	it('should return the correct venue fee', function(done){
		let venueFee1 = tournament1.getVenueFee();
		let venueFee2 = tournament2.getVenueFee();

		expect(venueFee1).to.be.equal(20);
		expect(venueFee2).to.be.equal(null);

		done();
	});

	it('should return the correct processing fee', function(done){
		let processingFee1 = tournament1.getProcessingFee();
		let processingFee2 = tournament2.getProcessingFee();

		expect(processingFee1).to.be.equal(5);
		expect(processingFee2).to.be.equal(5);

		done();
	});

	it('should get all players from a tournament', async function(){
		this.timeout(20000);

		let players = await tournament1.getAllPlayers({concurrency: concurrency});
		expect(players.length).to.be.equal(157);

		var hasDuplicates = function(a: Array<Player>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(players)).to.be.false;

		players.forEach(player => {
			expect(player).to.be.an.instanceof(Player);
		});

		return true;
	});

	it('should get all sets from a tournament', async function(){
		this.timeout(20000);

		let sets = await tournament1.getAllSets({concurrency: concurrency});
		expect(sets.length).to.be.equal(552);

		var hasDuplicates = function(a: Array<GGSet>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;

		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});

		return true;
	});

	it('should get all events from a tournament', async function(){
		this.timeout(20000);

		let events = await tournament1.getAllEvents({concurrency: concurrency});
		expect(events.length).to.be.equal(2);

		var hasDuplicates = function(a: Array<Event>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(events)).to.be.false;

		events.forEach(event => {
			expect(event).to.be.an.instanceof(Event);
		});

		return true;
	})

	it('should resolve the correct amount of incomplete sets', async function(){
		this.timeout(20000);

		let t = await Tournament.getTournament('21xx-cameron-s-birthday-bash-1');
		let sets = await t.getIncompleteSets();
		expect(sets.length).to.be.equal(2);
		return true;
	})

	it('should resolve the correct amount of complete sets', async function(){
		this.timeout(20000);

		let t = await Tournament.getTournament('21xx-cameron-s-birthday-bash-1');
		let sets = await t.getCompleteSets();
		expect(sets.length).to.be.equal(72);
		return true;
	})

	it('should resolve the correct number of sets x minutes ago', async function(){
		this.timeout(20000);

		let minutesBack = 15;
		let t = await Tournament.getTournament('21xx-cameron-s-birthday-bash-1');
		let tournamentDate = moment(t.getStartTime() as Date).add(30, 'minutes').toDate();
		let clock = sinon.useFakeTimers(tournamentDate);
		let sets = await t.getSetsXMinutesBack(minutesBack);
		expect(sets.length).to.be.equal(1);
		sets.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
			
			let now = moment();
			let then = moment(set.getCompletedAt() as Date);
			let diff = moment.duration(now.diff(then)).minutes();
			expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
		})
		clock.restore();
		return true;
	})

});