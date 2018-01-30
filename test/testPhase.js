'use strict';

let _ = require('lodash');

let Phase = require('../lib/Phase');
let PhaseGroup = require('../lib/PhaseGroup');
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
        this.timeout(10000);

        phase1 = await loadPhase(ID1);
        phase2 = await loadPhase(ID2);
        phase3 = await loadPhase(ID3);
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

    it('should correctly get all phase groups', async function(){
        this.timeout(30000);

        let phaseGroups1 = await phase1.getPhaseGroups();
        let phaseGroups2 = await phase2.getPhaseGroups();
        let phaseGroups3 = await phase3.getPhaseGroups();

        expect(phaseGroups1.length).to.be.equal(16);
        expect(phaseGroups2.length).to.be.equal(32);
        expect(phaseGroups3.length).to.be.equal(16);

        var hasDuplicates = function(a) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(phaseGroups1)).to.be.false;
        expect(hasDuplicates(phaseGroups2)).to.be.false;
        expect(hasDuplicates(phaseGroups3)).to.be.false;

        phaseGroups1.forEach(set => {
            expect(set).to.be.an.instanceof(PhaseGroup);
        });
        phaseGroups2.forEach(set => {
            expect(set).to.be.an.instanceof(PhaseGroup);
        });
        phaseGroups3.forEach(set => {
            expect(set).to.be.an.instanceof(PhaseGroup);
        });

        return true;
    });
});