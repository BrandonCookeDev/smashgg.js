'use strict';

let _ = require('lodash');

let Tournament = require('../lib/Tournament');
let Player = require('../lib/Player');
let Set = require('../lib/Set');
let Event = require('../lib/Event');
let Cache = require('../lib/util/Cache').getInstance();

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let tournament1 = {};
let tournament2 = {};
let tournament3 = {};
let tournament4 = {};

const TOURNAMENT_NAME1 = 'function1';
const TOURNAMENT_NAME2 = 'ceo2016';
const TOURNAMENT_NAME3 = 'to12';
const BAD_TOURNAMENT_NAME = 'badnamedotexe';

let expected = _.extend(
    require('./data/expectedTournaments')
);

function loadTournament(name, expands, isCached){
    return new Promise(function(resolve, reject){
        let t = new Tournament(name, expands, isCached);
        t.on('ready', function(){
            return resolve(t);
        })
    })
}

describe('Smash GG Tournament', function(){

    before(function(){
        Cache.flush();
    });

    it('should correctly load tournament data', async function(){
        this.timeout(10000);

        tournament1 = await loadTournament(TOURNAMENT_NAME1);
        tournament2 = await loadTournament(TOURNAMENT_NAME2);
        tournament3 = await loadTournament(TOURNAMENT_NAME3,
            {
                event:true,
                phase:true,
                groups:true,
                stations:true
            }
        );


        // TODO BAD TOURNAMENT TEST
        //tournament4 = await loadTournament(BAD_TOURNAMENT_NAME);

        return true;

    });

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
        let startTime1 = tournament1.getStartTime();
        let startTime2 = tournament2.getStartTime();

        expect(startTime1).to.be.equal('04-01-2017 11:00:00 EST');
        expect(startTime2).to.be.equal('06-24-2016 00:00:00 EST');

        done();
    });

    it('should return the correct end time', function(done){
        let endTime1 = tournament1.getEndTime();
        let endTime2 = tournament2.getEndTime();

        expect(endTime1).to.be.equal('04-01-2017 23:00:00 EST');
        expect(endTime2).to.be.equal('06-27-2016 00:00:00 EST');

        done();
    });

    it('should return the correct time registration closes', function(done){
        let closesTime1 = tournament1.getWhenRegistrationCloses();
        let closesTime2 = tournament2.getWhenRegistrationCloses();

        expect(closesTime1).to.be.equal('03-30-2017 02:00:00 EST');
        expect(closesTime2).to.be.equal('06-13-2016 08:00:00 EST');

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

    it('should return the correct contact email', function(done){
        let email1 = tournament1.getContactEmail();
        let email2 = tournament2.getContactEmail();

        expect(email1).to.be.equal('contact@recursion.gg');
        expect(email2).to.be.equal('ceogaming@gmail.com');

        done()
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
        this.timeout(10000);

        let players = await tournament1.getAllPlayers();
        expect(players.length).to.be.equal(157);

        var hasDuplicates = function(a) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(players)).to.be.false;

        players.forEach(player => {
            expect(player).to.be.an.instanceof(Player);
        });

        return true;
    });

    it('should get all sets from a tournament', async function(){
        this.timeout(10000);

        let sets = await tournament1.getAllSets();
        expect(sets.length).to.be.equal(504);

        var hasDuplicates = function(a) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(sets)).to.be.false;

        sets.forEach(set => {
            expect(set).to.be.an.instanceof(Set);
        });

        return true;
    });

    it('should get all events from a tournament', async function(){
        this.timeout(10000);

        let events = await tournament1.getAllEvents();
        expect(events.length).to.be.equal(2);

        var hasDuplicates = function(a) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(events)).to.be.false;

        events.forEach(event => {
            expect(event).to.be.an.instanceof(Event);
        });

        return true;
    })

});