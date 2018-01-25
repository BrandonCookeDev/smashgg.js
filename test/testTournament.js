'use strict';

let Tournament = require('../lib/Tournament');
let Cache = require('../lib/util/Cache');

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let tournament1 = {};
let tournament2 = {};

const TOURNAMENT_NAME1 = 'function1';
const TOURNAMENT_NAME2 = 'ceo2016';
const BAD_TOURNAMENT_NAME = 'badnamedotexe';

describe('Smash GG Tournament', function(){

    afterEach(function(done){
        Cache.flush();
    });

    it('should correctly load tournament data', async function(done){
        tournament1 = new Tournament(TOURNAMENT_NAME1);
        tournament2 = new Tournament(TOURNAMENT_NAME2);

        await tournament1.load();
        await tournament2.load();

        done();
    })
});