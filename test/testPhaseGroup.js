'use strict';

let _ = require('lodash');

let PhaseGroup = require('../lib/PhaseGroup');
let Cache = require('../lib/util/Cache');

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let phaseGroup1 = {};
let phaseGroup2 = {};
let phaseGroup3 = {};
let phaseGroup4 = {};

const ID1 = 0;
const ID2 = 0;
const ID3 = 301994;

let expected = _.extend(

);

describe('Smash GG Phase Group', function(){

    it('should correctly load Phase Group data', function(done){
        phaseGroup3 = new PhaseGroup(ID3);
        phaseGroup3.on('ready', done);
    });

    it('should get all entrants', function(done){
        let players = phaseGroup3.getPlayers();
        expect(players.length).to.be.equal(15);
        done();
    });

    it('should get all sets', function(done){
        let sets = phaseGroup3.getSets();
        expect(sets.length).to.be.equal(27);
        done();
    })

});