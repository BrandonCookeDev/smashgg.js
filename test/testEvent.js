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
    })
});