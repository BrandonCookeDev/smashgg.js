/* eslint-disable */
import '../lib/util/ErrorHandler'

import _ from 'lodash'
import {format} from 'util'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import { Tournament, Event, Phase, PhaseGroup, Entrant, GGSet } from '../lib/internal'
import { ITournament, IEvent, IPhase, IPhaseGroup, Entrant, IGGSet } from '../lib/internal'
import Cache from '../lib/util/Cache'

import testSets from './data/testSets'
import testPlayers from './data/testPlayers'

let testData = _.extend(
	testSets, 
	testPlayers
);

const TOURNAMENT_NAME1 = 'function-1-recursion-regional';
const TOURNAMENT_NAME2 = 'ceo-2016';
const EVENT_NAME1 = 'melee-singles';
const PHASEID1 = 111483;
const PHASEID2 = 45262;
const GROUPID1 = 44445;
const GROUPID2 = 301994;

describe('Test Caching', function(){

	before(function(done){
		Cache.flush()
		done()
	})

	beforeEach(function(done){
		Cache.flush()
		done()
	})

	after(function(done){
		Cache.flush()
		done()
	})

	it('should correctly cache tournaments', async function(){
		this.timeout(10000)

		let t1 = await loadTournament(TOURNAMENT_NAME1)
		let t2 = await loadTournament(TOURNAMENT_NAME2)

		let keys = await Cache.keys()
		expect(keys.length).to.be.equal(4)

		let key1 = format('tournament::%s::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&', TOURNAMENT_NAME1);
		let key2 = format('tournament::%s::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&', TOURNAMENT_NAME2);
		let key1data = format('tournament::%s::json::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&::data', TOURNAMENT_NAME1);
		let key2data = format('tournament::%s::json::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&::data', TOURNAMENT_NAME2);

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)
		expect(keys).to.include(key1data)
		expect(keys).to.include(key2data)

		let t1Cached = await Cache.get(key1)
		let t2Cached = await Cache.get(key2)

		expect(t1Cached).to.be.instanceof(Tournament)
		expect(t2Cached).to.be.instanceof(Tournament)

		return true
	})

	it('should correctly cache tournament players', async function(){
		this.timeout(25000)

		let t1 = await loadTournament(TOURNAMENT_NAME1)

		let t1Players = await t1.getAllPlayers()

		let keys = await Cache.keys();
		let key1 = format('tournament::%s::players', TOURNAMENT_NAME1);

		expect(keys).to.include(key1)

		let t1PlayersCached = await Cache.get(key1) as Array<Entrant>;
		t1PlayersCached.forEach(element => {
			expect(element).to.be.instanceof(Entrant)
		})

		/*
		let t2 = await loadTournament(TOURNAMENT_NAME2)
		let t2Players = await t2.getAllPlayers()
		let key2 = 'tournament::ceo2016::players'
		expect(keys).to.include(key2)
		let t2PlayersCached = await Cache.get(key2)
		t2PlayersCached.forEach(element => {
			expect(element).to.be.instanceof(Player)
		})
		*/

		return true
	})

	it('should correctly cache tournament sets', async function(){
		this.timeout(25000)

		let t1 = await loadTournament(TOURNAMENT_NAME1)
		let t1Sets = await t1.getAllSets()

		let keys = await Cache.keys()

		let key1 = format('tournament::%s::sets', TOURNAMENT_NAME1);
		expect(keys).to.include(key1);
		let t1SetsCached = await Cache.get(key1) as Array<GGSet>;

		t1SetsCached.forEach(element => {
			expect(element).to.be.instanceof(GGSet)
		});

		//let t2 = await loadTournament(TOURNAMENT_NAME2)
		//let t2Sets = await t2.getAllSets()

		//let key2 = 'tournament::ceo2016::sets'
		//expect(keys).to.include(key2)

		//let t2SetsCached = await Cache.get(key2)

		//t2SetsCached.forEach(element => {
		//	expect(element).to.be.instanceof(Set)
		//})

		return true
	})

	it('should correctly cache tournament events', async function(){
		this.timeout(25000)

		let t1 = await loadTournament(TOURNAMENT_NAME1)
		let t2 = await loadTournament(TOURNAMENT_NAME2)

		let t1Events = await t1.getAllEvents()
		let t2Events = await t2.getAllEvents()

		let keys = await Cache.keys()

		let key1 = format('tournament::%s::events', TOURNAMENT_NAME1);
		let key2 = format('tournament::%s::events', TOURNAMENT_NAME2);

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)

		let t1EventsCached = await Cache.get(key1) as Array<Event>;
		let t2EventsCached = await Cache.get(key2) as Array<Event>;

		t1EventsCached.forEach(element => {
			expect(element).to.be.instanceof(Event)
		})
		t2EventsCached.forEach(element => {
			expect(element).to.be.instanceof(Event)
		})

		return true
	})


	it('should correctly cache events', async function(){
		this.timeout(3500);

		let e1 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME1)
		let e2 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME2)

		let key1 = format('event::%s::%s::expand[]=phase&expand[]=groups&', TOURNAMENT_NAME1, EVENT_NAME1);
		let key1data = format('event::%s::%s::%s::expand[]=phase&expand[]=groups&::data', TOURNAMENT_NAME1, EVENT_NAME1, 'json');
		let key2 = format('event::%s::%s::expand[]=phase&expand[]=groups&', TOURNAMENT_NAME2, EVENT_NAME1);
		let key2data = format('event::%s::%s::%s::expand[]=phase&expand[]=groups&::data', TOURNAMENT_NAME2, EVENT_NAME1, 'json');

		let keys = await Cache.keys();
		expect(keys.length).to.be.equal(4, `Current cache keys: ${JSON.stringify(keys)}`);

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)
		expect(keys).to.include(key1data)
		expect(keys).to.include(key2data)

		let e1Cached = await Cache.get(key1)
		let e2Cached = await Cache.get(key2)

		expect(e1Cached).to.be.instanceof(Event)
		expect(e2Cached).to.be.instanceof(Event)

		return true
	})

	it('should correctly cache the event phases', async function(){
		this.timeout(25000)

		let e1 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME1)
		let e2 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME2)

		let phases1 = await e1.getEventPhases()
		let phases2 = await e2.getEventPhases()

		let key1 = format('event::%s::melee-singles::phases', TOURNAMENT_NAME1);
		let key2 = format('event::%s::melee-singles::phases', TOURNAMENT_NAME2);

		let keys = await Cache.keys()

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)

		let e1PhasesCached = await Cache.get(key1) as Array<Phase>;
		let e2PhasesCached = await Cache.get(key2) as Array<Phase>;

		e1PhasesCached.forEach(element => {
			expect(element).to.be.instanceof(Phase)
		})

		e2PhasesCached.forEach(element => {
			expect(element).to.be.instanceof(Phase)
		})

		return true
	})

	it('should correctly cache the event groups', async function(){
		this.timeout(25000)

		let e1 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME1)
		let e2 = await loadEvent(EVENT_NAME1, TOURNAMENT_NAME2)

		let groups1 = await e1.getEventPhaseGroups()
		let groups2 = await e2.getEventPhaseGroups()

		let key1 = format('event::%s::melee-singles::groups', TOURNAMENT_NAME1);
		let key2 = format('event::%s::melee-singles::groups', TOURNAMENT_NAME2);

		let keys = await Cache.keys()

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)

		let e2GroupsCached = await Cache.get(key1) as Array<PhaseGroup>;
		let e1GroupsCached = await Cache.get(key2) as Array<PhaseGroup>;

		e1GroupsCached.forEach(element => {
			expect(element).to.be.instanceof(PhaseGroup)
		})
		e2GroupsCached.forEach(element => {
			expect(element).to.be.instanceof(PhaseGroup)
		})

		return true
	})


	it('should correctly cache phases', async function(){
		this.timeout(25000)

		let p1 = await loadPhase(PHASEID1)
		let p2 = await loadPhase(PHASEID2)

		let key1 = format('phase::%s::expand[]=groups&', PHASEID1);
		let key2 = format('phase::%s::expand[]=groups&', PHASEID2);
		let key1data = format('phase::%s::json::expand[]=groups&::data', PHASEID1);
		let key2data = format('phase::%s::json::expand[]=groups&::data', PHASEID2);

		let keys = await Cache.keys()
		expect(keys.length).to.be.equal(4)

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)
		expect(keys).to.include(key1data)
		expect(keys).to.include(key2data)

		let p1Cached = await Cache.get(key1)
		let p2Cached = await Cache.get(key2)

		expect(p1Cached).to.be.instanceof(Phase)
		expect(p2Cached).to.be.instanceof(Phase)

		return true
	})

	it('should correctly cache groups from phases', async function(){
		this.timeout(25000)

		let p1 = await loadPhase(PHASEID1)
		let p2 = await loadPhase(PHASEID2)

		let pg1 = await p1.getPhaseGroups()
		let pg2 = await p2.getPhaseGroups()

		let key1 = format('phase::%s::groups', PHASEID1);
		let key2 = format('phase::%s::groups', PHASEID2);

		let keys = await Cache.keys()
		expect(keys).to.include(key1)
		expect(keys).to.include(key2)

		let groups1Cached = await Cache.get(key1) as Array<PhaseGroup>;
		let groups2Cached = await Cache.get(key2) as Array<PhaseGroup>;

		groups1Cached.forEach(element => {
			expect(element).to.be.instanceof(PhaseGroup)
		})
		groups2Cached.forEach(element => {
			expect(element).to.be.instanceof(PhaseGroup)
		})

		return true
	})

	it('should correctly cache phase groups', async function(){
		this.timeout(25000)

		let pg1 = await loadPhaseGroup(GROUPID1)
		let pg2 = await loadPhaseGroup(GROUPID2)

		let key1 = format('phasegroup::%s::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&', GROUPID1);
		let key2 = format('phasegroup::%s::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&', GROUPID2);
		let key1data = format('phasegroup::%s::json::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&::data', GROUPID1);
		let key2data = format('phasegroup::%s::json::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&::data', GROUPID2);

		let keys = await Cache.keys()

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)

		let pg1Cached = await Cache.get(key1)
		let pg2Cached = await Cache.get(key2)

		expect(pg1Cached).to.be.instanceof(PhaseGroup)
		expect(pg1Cached).to.be.instanceof(PhaseGroup)

		return true
	})


	it('should correctly cache players from Phase Group', async function(){
		this.timeout(25000)

		let pg1 = await loadPhaseGroup(GROUPID1)
		let pg2 = await loadPhaseGroup(GROUPID2)

		let pg1Players = await pg1.getPlayers()
		let pg2Players = await pg2.getPlayers()

		let keys = await Cache.keys()

		let key1 = format('phasegroup::%s::players', GROUPID1);
		let key2 = format('phasegroup::%s::players', GROUPID2);

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)

		let pg1PlayersCached = await Cache.get(key1) as Array<Entrant>;
		let pg2PlayersCached = await Cache.get(key2) as Array<Entrant>;

		pg1PlayersCached.forEach(element => {
			expect(element).to.be.instanceof(Entrant)
		})
		pg2PlayersCached.forEach(element => {
			expect(element).to.be.instanceof(Entrant)
		})

		return true
	})


	it('should correctly cache sets from Phase Group', async function(){
		this.timeout(25000)

		let pg1 = await loadPhaseGroup(GROUPID1)
		let pg2 = await loadPhaseGroup(GROUPID2)

		let pg1Players = await pg1.getSets()
		let pg2Players = await pg2.getSets()

		let keys = await Cache.keys()

		let key1 = format('phasegroup::%s::sets', GROUPID1);
		let key2 = format('phasegroup::%s::sets', GROUPID2);

		expect(keys).to.include(key1)
		expect(keys).to.include(key2)

		let pg1SetsCached = await Cache.get(key1) as Array<GGSet>;
		let pg2SetsCached = await Cache.get(key2) as Array<GGSet>;

		pg1SetsCached.forEach(element => {
			expect(element).to.be.instanceof(GGSet)
		});
		pg2SetsCached.forEach(element => {
			expect(element).to.be.instanceof(GGSet)
		});

		return true
	})

})

function loadTournament(name: string, expands: ITournament.Expands=ITournament.getDefaultExpands(), isCached: boolean=true) : Promise<Tournament>{
	return new Promise(function(resolve, reject){
		let options: ITournament.Options = {
			isCached: isCached,
			expands: expands
		}
		let t = new Tournament(name, options);
		t.on('ready', function(){
			return resolve(t)
		})
	})
}
function loadEvent(eventName: string, tournamentName: string) : Promise<Event>{
	return new Promise(function(resolve, reject){
		let event = new Event(eventName, tournamentName)
		event.on('ready', function(){
			resolve(event)
		})
	})
}
function loadPhase(id: number, expands: IPhase.Expands=IPhase.getDefaultExpands(), isCached: boolean=true) : Promise<Phase>{
	return new Promise(function(resolve, reject){
		let options: IPhase.Options = {
			isCached: isCached,
			expands: expands
		}
		let P = new Phase(id, options);
		P.on('ready', function(){
			resolve(P)
		})
	})
}
function loadPhaseGroup(id: number, expands: IPhaseGroup.Expands=IPhaseGroup.getDefaultExpands(), isCached: boolean=true) : Promise<PhaseGroup>{
	return new Promise(function(resolve, reject){
		let options: IPhaseGroup.Options = {
			expands: expands,
			isCached: isCached
		}
		let PG = new PhaseGroup(id, options);
		PG.on('ready', function(){
			resolve(PG)
		})
	})
}
