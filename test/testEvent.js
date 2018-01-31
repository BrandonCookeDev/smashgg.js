'use strict';

let _ = require('lodash');

let Event = require('../lib/Event');
let Phase = require('../lib/Phase');
let PhaseGroup = require('../lib/PhaseGroup');
let Cache = require('../lib/util/Cache').getInstance();

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let event1 = {};
let event2 = {};
let event3 = {};
let event4 = {};

const TOURNAMENT_NAME1 = 'function1';
const EVENT_NAME1 = 'melee-singles';

const TOURNAMENT_NAME2 = 'ceo2016';
const TOURNAMENT_NAME3 = 'to12';
const BAD_TOURNAMENT_NAME = 'badnamedotexe';

let expected = _.extend(

);

function loadEvent(tournamentName, eventName){
    return new Promise(function(resolve, reject){
        let event = new Event(tournamentName, eventName);
        event.on('ready', function(){
            resolve(event);
        })
    })
}

describe('Smash GG Event', function(){

    before(function(){
        Cache.flush();
    });

    it('should correctly load the data', async function(){
        this.timeout(15000);

        event1 = await loadEvent(TOURNAMENT_NAME1, EVENT_NAME1);
        event2 = await loadEvent(TOURNAMENT_NAME2, EVENT_NAME1);

        return true;
    });

    it('should correctly get the event name', function(done){
        let name1 = event1.getName();
        expect(name1).to.be.equal('Melee Singles');
        done();
    });

    it('should correctly get the event slug', function(done){
        let slug = event1.getSlug();
        expect(slug).to.be.equal('tournament/function-1-recursion-regional/event/melee-singles');
        done();
    });

    it('should correctly get the event start time', function(done){
        let startTime1 = event1.getStartTime();
        expect(startTime1).to.be.equal('04-01-2017 11:00:00 EST');
        done();
    });

    it('should correctly get the event end time', function(done){
        let endTime1 = event1.getEndTime();
        let endTime2 = event2.getEndTime();

        expect(endTime1).to.be.equal('04-01-2017 12:00:00 EST');
        done();
    });

    it('should correctly get the phases', async function(){
        this.timeout(15000);

        let phases1 = await event1.getEventPhases();
        let phases2 = await event2.getEventPhases();

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

        let groups1 = await event1.getEventPhaseGroups();
        let groups2 = await event2.getEventPhaseGroups();

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
});