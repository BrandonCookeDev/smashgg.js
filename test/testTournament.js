'use strict';

let _ = require('lodash');

let Tournament = require('../lib/Tournament');
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

        // TODO expects

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

        //TODO compare
        expect(name1).to.be.equal(expected.tournaments.function1.entities.tournament.name);
        expect(name2).to.be.equal(expected.tournaments.ceo2016.entities.tournament.name);

        done();
    });

    it('should return the correct starting time', function(done){
        let startTime1 = tournament1.getStartTime();
        let startTime2 = tournament2.getStartTime();

        //TODO compare
        expect(startTime1).to.be.equal('2017-04-01 11:00:00');
        expect(startTime2).to.be.equal('2016-06-24 00:00:00');

        done();
    });

    it('should return the correct starting time', function(done){
        let endTime1 = tournament1.getEndTime();
        let endTime2 = tournament2.getEndTime();

        //TODO compare
        expect(endTime1).to.be.equal('2017-04-01 23:00:00');
        expect(endTime2).to.be.equal('2016-06-27 00:00:00');

        done();
    });

    it('should get all players from a tournament', async function(){
        this.timeout(10000);

        let players = await tournament1.getAllPlayers();
        expect(players.length).to.be.equal(158);

        var hasDuplicates = function(a) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(players)).to.be.false;

        return true;
    });

    it('should get all sets from a tournament', async function(){
        this.timeout(10000);

        let sets = await tournament1.getAllSets();
        expect(sets.length).to.be.equal(553);

        var hasDuplicates = function(a) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(sets)).to.be.false;

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

        return true;
    })

});