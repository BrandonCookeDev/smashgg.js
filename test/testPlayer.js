'use strict';

let _ = require('lodash');

let Player = require('../lib/Player');
let Cache = require('../lib/util/Cache').getInstance();

let chai = require('chai');
let cap = require('chai-as-promised');
chai.use(cap);

let expect = chai.expect;
let assert = chai.assert;

let expected = _.extend(
    require('./data/testPlayers')
);


let p1, p2, p3;

describe('Smash GG Player', function(){

    before(Cache.flush);

    it('should correctly load a player from raw data', function(done){
        p1 = Player.resolve(expected.players[0]);
        p2 = Player.resolve(expected.players[1]);
        p3 = Player.resolve(expected.players[2]);

        expect(p1.id).to.be.equal(21568);
        expect(p2.id).to.be.equal(244170);
        expect(p3.id).to.be.equal(36490);

        expect(p1.tag).to.be.equal('Gas$');
        expect(p2.tag).to.be.equal('T');
        expect(p3.tag).to.be.equal('Kiwiwizard');

        expect(p1.name).to.be.equal('Grayson Garrett');
        expect(p2.name).to.be.equal('Trevor Greiff');
        expect(p3.name).to.be.equal('Davis Balser');

        expect(p1.country).to.be.equal('United States');
        expect(p2.country).to.be.equal('United States');
        expect(p3.country).to.be.equal('US');

        expect(p1.state).to.be.equal('GA');
        expect(p2.state).to.be.equal('TN');
        expect(p3.state).to.be.equal('GA');

        expect(p1.sponsor).to.be.equal('Test1');
        expect(p2.sponsor).to.be.equal('Test2');
        expect(p3.sponsor).to.be.equal('Test3');

        expect(p1.data).to.be.equal(expected.players[0]);
        expect(p2.data).to.be.equal(expected.players[1]);
        expect(p3.data).to.be.equal(expected.players[2]);

        done();
    })

});