'use strict';

let _ = require('lodash');

let Set = require('../lib/Set');
let Player = require('../lib/Player');
let Tournament = require('../lib/Tournament');
let Cache = require('../lib/util/Cache').getInstance();

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let expected = _.extend(
    require('./data/testSets')
);

let pWinkledink, pAmarula,
    pWizzrobe, pBootyBlast,
    pVasculinity;

let set1, set2, set3;

describe('Smash GG Set', function(){

    before(function(done){
        Cache.flush();

        let o1 = expected.sets[0];
        pWinkledink = new Player(o1.WinnerPlayer.id, o1.WinnerPlayer.tag, o1.WinnerPlayer.slug,
            o1.WinnerPlayer.country, o1.WinnerPlayer.region, o1.WinnerPlayer.sponsor,
            o1.WinnerPlayer.participantId, o1.WinnerPlayer.data);
        pAmarula = new Player(o1.LoserPlayer.id, o1.LoserPlayer.tag, o1.LoserPlayer.slug,
            o1.LoserPlayer.country, o1.LoserPlayer.region, o1.LoserPlayer.sponsor,
            o1.LoserPlayer.participantId, o1.LoserPlayer.data);

        let o2 = expected.sets[1];
        pWizzrobe = new Player(o2.WinnerPlayer.id, o2.WinnerPlayer.tag, o2.WinnerPlayer.slug,
            o2.WinnerPlayer.country, o2.WinnerPlayer.region, o2.WinnerPlayer.sponsor,
            o2.WinnerPlayer.participantId, o2.WinnerPlayer.data);
        pWinkledink = new Player(o2.LoserPlayer.id, o2.LoserPlayer.tag, o2.LoserPlayer.slug,
            o2.LoserPlayer.country, o2.LoserPlayer.region, o2.LoserPlayer.sponsor,
            o2.LoserPlayer.participantId, o2.LoserPlayer.data);

        let o3 = expected.sets[2];
        pBootyBlast = new Player(o3.WinnerPlayer.id, o3.WinnerPlayer.tag, o3.WinnerPlayer.slug,
            o3.WinnerPlayer.country, o3.WinnerPlayer.region, o3.WinnerPlayer.sponsor,
            o3.WinnerPlayer.participantId, o3.WinnerPlayer.data);
        pVasculinity = new Player(o3.LoserPlayer.id, o3.LoserPlayer.tag, o3.LoserPlayer.slug,
            o3.LoserPlayer.country, o3.LoserPlayer.region, o3.LoserPlayer.sponsor,
            o3.LoserPlayer.participantId, o3.LoserPlayer.data);

        set1 = new Set(o1.id, o1.eventId, o1.round, pWinkledink, pAmarula, o1.data);
        set2 = new Set(o2.id, o2.eventId, o2.round, pWizzrobe, pWinkledink, o2.data);
        set3 = new Set(o3.id, o3.eventId, o3.round, pBootyBlast, pVasculinity, o3.data);

        done();
    });

    it('should give the correct Winner', function(done){
        expect(set1.getWinner()).to.deep.equal(pWinkledink);
        expect(set2.getWinner()).to.deep.equal(pWizzrobe);
        expect(set3.getWinner()).to.deep.equal(pBootyBlast);
        done();
    });

    it('should give the correct Loser', function(done){
        expect(set1.getLoser()).to.deep.equal(pAmarula);
        expect(set2.getLoser()).to.deep.equal(pWinkledink);
        expect(set3.getLoser()).to.deep.equal(pVasculinity);
        done();
    });

    it('should give the correct round', function(done){
        expect(set1.getRound()).to.be.equal('Winners Round 1');
        expect(set2.getRound()).to.be.equal('Winners Quarter-Final');
        expect(set3.getRound()).to.be.equal('Winners Quarter-Final');
        done();
    });

    it('should give the correct bestOf count', function(done){
        expect(set1.getBestOfCount()).to.be.equal(3);
        expect(set2.getBestOfCount()).to.be.equal(3);
        expect(set3.getBestOfCount()).to.be.equal(3);
        done();
    });

    it('should give the correct Winner score', function(done){
        expect(set1.getWinnerScore()).to.be.equal(2);
        expect(set2.getWinnerScore()).to.be.equal(2);
        expect(set3.getWinnerScore()).to.be.equal(2);
        done();
    });

    it('should give the correct Loser score', function(done){
        expect(set1.getLoserScore()).to.be.equal(0);
        expect(set2.getLoserScore()).to.be.equal(0);
        expect(set3.getLoserScore()).to.be.equal(1);
        done();
    });

    it('should give the correct Bracket ID', function(done){
        expect(set1.getBracketId()).to.be.equal('58df119c60fbb');
        expect(set2.getBracketId()).to.be.equal('58df119c60fbb');
        expect(set3.getBracketId()).to.be.equal('58df119c60fbb');
        done();
    });

    it('should give the correct Winners Tournament Placement', function(done){
        expect(set1.getWinnersTournamentPlacement()).to.be.equal(set1.WinnerPlayer.data.finalPlacement);
        expect(set2.getWinnersTournamentPlacement()).to.be.equal(set2.WinnerPlayer.data.finalPlacement);
        expect(set3.getWinnersTournamentPlacement()).to.be.equal(set3.WinnerPlayer.data.finalPlacement);
        done();
    });

    it('should give the correct Losers Tournament Placement', function(done){
        expect(set1.getLosersTournamentPlacement()).to.be.equal(set1.LoserPlayer.data.finalPlacement);
        expect(set2.getLosersTournamentPlacement()).to.be.equal(set2.LoserPlayer.data.finalPlacement);
        expect(set3.getLosersTournamentPlacement()).to.be.equal(set3.LoserPlayer.data.finalPlacement);
        done();
    });

    it('should give the correct Phase Group ID', function(done){
        expect(set1.getPhaseGroupId()).to.be.equal(327638);
        expect(set2.getPhaseGroupId()).to.be.equal(327638);
        expect(set3.getPhaseGroupId()).to.be.equal(327638);
        done();
    });

    it('should give the correct Midsize Round Text', function(done){
        expect(set1.getMidsizeRoundText()).to.be.equal('Winners 1');
        expect(set2.getMidsizeRoundText()).to.be.equal('Winners Quarters');
        expect(set3.getMidsizeRoundText()).to.be.equal('Winners Quarters');
        done();
    });
});