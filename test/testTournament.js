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

    it('should correctly load tournament data', async function(){
        tournament1 = new Tournament(TOURNAMENT_NAME1);
        tournament2 = new Tournament(TOURNAMENT_NAME2);

        await tournament1.load();
        await tournament2.load();

        return true;
    });

    it('should return the correct tournament id', function(done){
        let id1 = tournament1.getId();
        let id2 = tournament2.getId();

        //TODO compare

        done();
    });

    it('should return the correct tournament name', function(done){
        let name1 = tournament1.getName();
        let name2 = tournament2.getName();

        //TODO compare

        done();
    });

    it('should return the correct starting time', function(done){
        let startTime1 = tournament1.getStartTime();
        let startTime2 = tournament2.getStartTime();

        //TODO compare

        done();
    });

    it('should return the correct starting time', function(done){
        let endTime1 = tournament1.getEndTime();
        let endTime2 = tournament2.getEndTime();

        //TODO compare

        done();
    });
});