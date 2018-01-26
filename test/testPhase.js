'use strict';

let _ = require('lodash');

let Phase = require('../lib/Phase');
let Cache = require('../lib/util/Cache').getInstance();

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let expected = _.extend(
    require('./data/testSets')
);

let ID1 = 111483;
let ID2 = 45262;
let ID3 = 100046;

let phase1, phase2, phase3;

function loadPhase(id, expands, isCached){
    return new Promise(function(resolve, reject){
        let P = new Phase(id, expands, isCached);
        P.on('ready', function(){
            resolve(P);
        })
    })
}

describe('Smash GG Phase', function(){

    before(function(){
        Cache.flush();
    });

    it('should correctly load the Phase', async function(){
        phase1 = await loadPhase(ID1);
        phase2 = await loadPhase(ID2);
        phase3 = await loadPhase(ID3);
        return true;
    });

    it('should correctly get all phase groups', async function(){
        let phaseGroups1 = await phase1.getGroups();
        let phaseGroups2 = await phase2.getGroups();
        let phaseGroups3 = await phase3.getGroups();

        expect(phaseGroups1.length).to.be.equal(16);
        expect(phaseGroups2.length).to.be.equal(32);
        expect(phaseGroups3.length).to.be.equal(16);

        return true;
    });

    it('should get the name of the Phase', function(done){
        expect(phase1.getName()).to.be.equal('Pools');
        expect(phase2.getName()).to.be.equal('Pools');
        expect(phase3.getName()).to.be.equal('Bracket Pools');
        done();
    });

    it('should get the event id', function(done){
        expect(phase1.getEventId()).to.be.equal(25545);
        expect(phase2.getEventId()).to.be.equal(11787);
        expect(phase3.getEventId()).to.be.equal(23596);
        done();
    });

});