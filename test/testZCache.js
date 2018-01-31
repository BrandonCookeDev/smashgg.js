'use strict';

let _ = require('lodash');
let Promise = require('bluebird');

let Tournament  = require('../lib/Tournament');
let Event       = require('../lib/Event');
let Phase       = require('../lib/Phase');
let PhaseGroup  = require('../lib/PhaseGroup');
let Set         = require('../lib/Set');
let Player      = require('../lib/Player');

let Cache = require('../lib/util/Cache').getInstance();

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let testData = _.extend(
    require('./data/testSets'),
    require('./data/testPlayers')
);

const TOURNAMENT_NAME1 = 'function1';
const TOURNAMENT_NAME2 = 'ceo2016';
const EVENT_NAME1 = 'melee-singles';
const PHASEID1 = 111483;
const PHASEID2 = 45262;
const GROUPID1 = 44445;
const GROUPID2 = 301994;

describe('Test Caching', function(){

    before(function(done){
        Cache.flush();
        done();
    });

    beforeEach(function(done){
        Cache.flush();
        done();
    });

    after(function(done){
        Cache.flush();
        done();
    });

    it('should correctly cache tournaments', async function(){
        this.timeout(10000);

        let t1 = await loadTournament(TOURNAMENT_NAME1);
        let t2 = await loadTournament(TOURNAMENT_NAME2);

        let keys = await Cache.keys();
        expect(keys.length).to.be.equal(4);

        let key1 = 'tournament::function1::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&';
        let key2 = 'tournament::ceo2016::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&';
        let key1data = 'tournament::function1::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&::data';
        let key2data = 'tournament::ceo2016::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&::data';

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);
        expect(keys).to.include(key1data);
        expect(keys).to.include(key2data);

        let t1Cached = await Cache.get(key1);
        let t2Cached = await Cache.get(key2);

        expect(t1Cached).to.be.instanceof(Tournament);
        expect(t2Cached).to.be.instanceof(Tournament);

        return true;
    });

    it('should correctly cache tournament players', async function(){
        this.timeout(25000);

        let t1 = await loadTournament(TOURNAMENT_NAME1);

        let t1Players = await t1.getAllPlayers();

        let keys = await Cache.keys();
        let key1 = 'tournament::function1::players';

        expect(keys).to.include(key1);

        let t1PlayersCached = await Cache.get(key1);
        t1PlayersCached.forEach(element => {
            expect(element).to.be.instanceof(Player)
        });

        /*
        let t2 = await loadTournament(TOURNAMENT_NAME2);
        let t2Players = await t2.getAllPlayers();
        let key2 = 'tournament::ceo2016::players';
        expect(keys).to.include(key2);
        let t2PlayersCached = await Cache.get(key2);
        t2PlayersCached.forEach(element => {
            expect(element).to.be.instanceof(Player)
        });
        */

        return true;
    });

    it('should correctly cache tournament sets', async function(){
        this.timeout(2500);

        let t1 = await loadTournament(TOURNAMENT_NAME1);
        let t1Sets = await t1.getAllSets();

        let keys = await Cache.keys();

        let key1 = 'tournament::function1::sets';
        expect(keys).to.include(key1);
        let t1SetsCached = await Cache.get(key1);

        t1SetsCached.forEach(element => {
            expect(element).to.be.instanceof(Set)
        });

        //let t2 = await loadTournament(TOURNAMENT_NAME2);
        //let t2Sets = await t2.getAllSets();

        //let key2 = 'tournament::ceo2016::sets';
        //expect(keys).to.include(key2);

        //let t2SetsCached = await Cache.get(key2);

        //t2SetsCached.forEach(element => {
        //    expect(element).to.be.instanceof(Set)
        //});

        return true;
    });

    it('should correctly cache tournament events', async function(){
        this.timeout(25000);

        let t1 = await loadTournament(TOURNAMENT_NAME1);
        let t2 = await loadTournament(TOURNAMENT_NAME2);

        let t1Events = await t1.getAllEvents();
        let t2Events = await t2.getAllEvents();

        let keys = await Cache.keys();

        let key1 = 'tournament::function1::events';
        let key2 = 'tournament::ceo2016::events';

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);

        let t1EventsCached = await Cache.get(key1);
        let t2EventsCached = await Cache.get(key2);

        t1EventsCached.forEach(element => {
            expect(element).to.be.instanceof(Event)
        });
        t2EventsCached.forEach(element => {
            expect(element).to.be.instanceof(Event)
        });

        return true;
    });


    it('should correctly cache events', async function(){
        this.timeout(25000);

        let e1 = await loadEvent(TOURNAMENT_NAME1, EVENT_NAME1);
        let e2 = await loadEvent(TOURNAMENT_NAME2, EVENT_NAME1);

        let key1 = 'event::function1::melee-singles::expand[]=phase&expand[]=groups&';
        let key1data = 'event::function1::melee-singles::expand[]=phase&expand[]=groups&::data';
        let key2 = 'event::ceo2016::melee-singles::expand[]=phase&expand[]=groups&';
        let key2data = 'event::ceo2016::melee-singles::expand[]=phase&expand[]=groups&::data';

        let keys = await Cache.keys();
        expect(keys.length).to.be.equal(6);

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);
        expect(keys).to.include(key1data);
        expect(keys).to.include(key2data);

        let e1Cached = await Cache.get(key1);
        let e2Cached = await Cache.get(key2);

        expect(e1Cached).to.be.instanceof(Event);
        expect(e2Cached).to.be.instanceof(Event);

        return true;
    });

    it('should correctly cache the event phases', async function(){
        this.timeout(25000);

        let e1 = await loadEvent(TOURNAMENT_NAME1, EVENT_NAME1);
        let e2 = await loadEvent(TOURNAMENT_NAME2, EVENT_NAME1);

        let phases1 = await e1.getEventPhases();
        let phases2 = await e2.getEventPhases();

        let key1 = 'event::function1::melee-singles::phases';
        let key2 = 'event::ceo2016::melee-singles::phases';

        let keys = await Cache.keys();

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);

        let e1PhasesCached = await Cache.get(key1);
        let e2PhasesCached = await Cache.get(key2);

        e1PhasesCached.forEach(element => {
            expect(element).to.be.instanceof(Phase);
        });

        e2PhasesCached.forEach(element => {
            expect(element).to.be.instanceof(Phase);
        });

        return true;
    });

    it('should correctly cache the event groups', async function(){
        this.timeout(25000);

        let e1 = await loadEvent(TOURNAMENT_NAME1, EVENT_NAME1);
        let e2 = await loadEvent(TOURNAMENT_NAME2, EVENT_NAME1);

        let groups1 = await e1.getEventPhaseGroups();
        let groups2 = await e2.getEventPhaseGroups();

        let key1 = 'event::function1::melee-singles::groups';
        let key2 = 'event::ceo2016::melee-singles::groups';

        let keys = await Cache.keys();

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);

        let e2GroupsCached = await Cache.get(key1);
        let e1GroupsCached = await Cache.get(key2);

        e1GroupsCached.forEach(element => {
            expect(element).to.be.instanceof(PhaseGroup);
        });
        e2GroupsCached.forEach(element => {
            expect(element).to.be.instanceof(PhaseGroup);
        });

        return true;
    });


    it('should correctly cache phases', async function(){
        this.timeout(25000);

        let p1 = await loadPhase(PHASEID1);
        let p2 = await loadPhase(PHASEID2);

        let key1 = 'phase::'+PHASEID1+'::expand[]=groups&';
        let key2 = 'phase::'+PHASEID2+'::expand[]=groups&';
        let key1data = 'phase::'+PHASEID1+'::expand[]=groups&::data';
        let key2data = 'phase::'+PHASEID2+'::expand[]=groups&::data';

        let keys = await Cache.keys();
        expect(keys.length).to.be.equal(4);

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);
        expect(keys).to.include(key1data);
        expect(keys).to.include(key2data);

        let p1Cached = await Cache.get(key1);
        let p2Cached = await Cache.get(key2);

        expect(p1Cached).to.be.instanceof(Phase);
        expect(p2Cached).to.be.instanceof(Phase);

        return true;
    });

    it('should correctly cache groups from phases', async function(){
        this.timeout(25000);

        let p1 = await loadPhase(PHASEID1);
        let p2 = await loadPhase(PHASEID2);

        let pg1 = await p1.getPhaseGroups();
        let pg2 = await p2.getPhaseGroups();

        let key1 = 'phase::'+PHASEID1+'::groups';
        let key2 = 'phase::'+PHASEID2+'::groups';

        let keys = await Cache.keys();
        expect(keys).to.include(key1);
        expect(keys).to.include(key2);

        let groups1Cached = await Cache.get(key1);
        let groups2Cached = await Cache.get(key2);

        groups1Cached.forEach(element => {
            expect(element).to.be.instanceof(PhaseGroup);
        });
        groups2Cached.forEach(element => {
            expect(element).to.be.instanceof(PhaseGroup);
        });

        return true;
    });

    it('should correctly cache phase groups', async function(){
        this.timeout(25000);

        let pg1 = await loadPhaseGroup(GROUPID1);
        let pg2 = await loadPhaseGroup(GROUPID2);

        let key1 = 'phasegroup::' + GROUPID1 + '::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&';
        let key2 = 'phasegroup::' + GROUPID2 + '::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&';
        let key1data = 'phasegroup::' + GROUPID1 + '::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&::data';
        let key2data = 'phasegroup::' + GROUPID2 + '::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&::data';

        let keys = await Cache.keys();

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);

        let pg1Cached = await Cache.get(key1);
        let pg2Cached = await Cache.get(key2);

        expect(pg1Cached).to.be.instanceof(PhaseGroup);
        expect(pg1Cached).to.be.instanceof(PhaseGroup);

        return true;
    });


    it('should correctly cache players from Phase Group', async function(){
        this.timeout(25000);

        let pg1 = await loadPhaseGroup(GROUPID1);
        let pg2 = await loadPhaseGroup(GROUPID2);

        let pg1Players = await pg1.getPlayers();
        let pg2Players = await pg2.getPlayers();

        let keys = await Cache.keys();

        let key1 = 'phasegroup::'+GROUPID1+'::players';
        let key2 = 'phasegroup::'+GROUPID2+'::players';

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);

        let pg1PlayersCached = await Cache.get(key1);
        let pg2PlayersCached = await Cache.get(key2);

        pg1PlayersCached.forEach(element => {
            expect(element).to.be.instanceof(Player)
        });
        pg2PlayersCached.forEach(element => {
            expect(element).to.be.instanceof(Player)
        });

        return true;
    });


    it('should correctly cache sets from Phase Group', async function(){
        this.timeout(25000);

        let pg1 = await loadPhaseGroup(GROUPID1);
        let pg2 = await loadPhaseGroup(GROUPID2);

        let pg1Players = await pg1.getSets();
        let pg2Players = await pg2.getSets();

        let keys = await Cache.keys();

        let key1 = 'phasegroup::'+GROUPID1+'::sets';
        let key2 = 'phasegroup::'+GROUPID2+'::sets';

        expect(keys).to.include(key1);
        expect(keys).to.include(key2);

        let pg1SetsCached = await Cache.get(key1);
        let pg2SetsCached = await Cache.get(key2);

        pg1SetsCached.forEach(element => {
            expect(element).to.be.instanceof(Set)
        });
        pg2SetsCached.forEach(element => {
            expect(element).to.be.instanceof(Set)
        });

        return true;
    });

});

function loadTournament(name, expands, isCached){
    return new Promise(function(resolve, reject){
        let t = new Tournament(name, expands, isCached);
        t.on('ready', function(){
            return resolve(t);
        })
    })
}
function loadEvent(tournamentName, eventName){
    return new Promise(function(resolve, reject){
        let event = new Event(tournamentName, eventName);
        event.on('ready', function(){
            resolve(event);
        })
    })
}
function loadPhase(id, expands, isCached){
    return new Promise(function(resolve, reject){
        let P = new Phase(id, expands, isCached);
        P.on('ready', function(){
            resolve(P);
        })
    })
}
function loadPhaseGroup(id, expands, isCached){
    return new Promise(function(resolve, reject){
        let PG = new PhaseGroup(id, expands, isCached);
        PG.on('ready', function(){
            resolve(PG);
        })
    })
}
