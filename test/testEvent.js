'use strict';

let _ = require('lodash');

let Event = require('../lib/Event');
let Cache = require('../lib/util/Cache');

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

describe('Smash GG Event', function(){

    it('should correctly load the data', function(done){
        event1 = new Event(TOURNAMENT_NAME1, EVENT_NAME1);

        event1.on('ready', done)
    });

    it('should correctly get the event name', function(done){
        let name1 = event1.getName();
        expect(name1).to.be.equal('Melee Singles');
        done();
    });

    it('should correctly get the event start time', function(done){
        let startTime1 = event1.getStartTime();
        expect(startTime1).to.be.equal('2017-04-01 11:00:00');
        done();
    });

    it('should correctly get the event end time', function(done){
        let endTime1 = event1.getEndTime();
        expect(endTime1).to.be.equal('2017-04-01 12:00:00');
        done();
    })
});