/* eslint-disable */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
require('../src/js/util/ErrorHandler');
var _ = require('lodash');
var Event = require('../src/js/Event');
var Phase = require('../src/js/Phase');
var PhaseGroup = require('../src/js/PhaseGroup');
var Cache = require('../src/js/util/Cache').getInstance();
var Set = require('../src/js/Set');
var Player = require('../src/js/Player');
var moment = require('moment');
var sinon = require('sinon');
var chai = require('chai');
var cap = require('chai-as-promised');
chai.use(cap);
var expect = chai.expect;
var assert = chai.assert;
var expected = _.extend(require('./data/testSets'));
var ID1 = 111483;
var ID2 = 45262;
var ID3 = 100046;
var phase1, phase2, phase3;
var concurrency = 4;
function loadPhase(id, options) {
    return new Promise(function (resolve, reject) {
        var P = new Phase(id, options);
        P.on('ready', function () {
            resolve(P);
        });
    });
}
describe('Smash GG Phase', function () {
    before(function () { return console.log('concurrency set to %s', concurrency); });
    beforeEach(function () {
        Cache.flush();
    });
    it('should correctly load the Phase', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, loadPhase(ID1, { rawEncoding: 'utf8' })];
                    case 1:
                        phase1 = _a.sent();
                        return [4 /*yield*/, loadPhase(ID2)];
                    case 2:
                        phase2 = _a.sent();
                        return [4 /*yield*/, loadPhase(ID3, { rawEncoding: 'base64' })];
                    case 3:
                        phase3 = _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should implement the convenience methods correctly', function () {
        return __awaiter(this, void 0, void 0, function () {
            var cPhase1, cPhase2, cPhase3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Phase.getPhase(ID1, { rawEncoding: 'utf8' })];
                    case 1:
                        cPhase1 = _a.sent();
                        return [4 /*yield*/, Phase.getPhase(ID2)];
                    case 2:
                        cPhase2 = _a.sent();
                        return [4 /*yield*/, Phase.getPhase(ID3, { rawEncoding: 'base64' })];
                    case 3:
                        cPhase3 = _a.sent();
                        expect(cPhase1.data).to.deep.equal(phase1.data);
                        expect(cPhase2.data).to.deep.equal(phase2.data);
                        expect(cPhase3.data).to.deep.equal(phase3.data);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get the name of the Phase', function (done) {
        expect(phase1.getName()).to.be.equal('Pools');
        expect(phase2.getName()).to.be.equal('Pools');
        expect(phase3.getName()).to.be.equal('Bracket Pools');
        done();
    });
    it('should get the event id', function (done) {
        expect(phase1.getEventId()).to.be.equal(25545);
        expect(phase2.getEventId()).to.be.equal(11787);
        expect(phase3.getEventId()).to.be.equal(23596);
        done();
    });
    it('should correctly get all phase groups', function () {
        return __awaiter(this, void 0, void 0, function () {
            var phaseGroups1, phaseGroups2, phaseGroups3, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(45000);
                        return [4 /*yield*/, phase1.getPhaseGroups({ concurrency: concurrency })];
                    case 1:
                        phaseGroups1 = _a.sent();
                        return [4 /*yield*/, phase2.getPhaseGroups({ concurrency: concurrency })];
                    case 2:
                        phaseGroups2 = _a.sent();
                        return [4 /*yield*/, phase3.getPhaseGroups({ concurrency: concurrency })];
                    case 3:
                        phaseGroups3 = _a.sent();
                        expect(phaseGroups1.length).to.be.equal(16);
                        expect(phaseGroups2.length).to.be.equal(32);
                        expect(phaseGroups3.length).to.be.equal(16);
                        hasDuplicates = function (a) {
                            return _.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(phaseGroups1)).to.be.false;
                        expect(hasDuplicates(phaseGroups2)).to.be.false;
                        expect(hasDuplicates(phaseGroups3)).to.be.false;
                        phaseGroups1.forEach(function (set) {
                            expect(set).to.be.an.instanceof(PhaseGroup);
                        });
                        phaseGroups2.forEach(function (set) {
                            expect(set).to.be.an.instanceof(PhaseGroup);
                        });
                        phaseGroups3.forEach(function (set) {
                            expect(set).to.be.an.instanceof(PhaseGroup);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all sets for a phase', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets1, sets2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase1.getSets({ concurrency: concurrency })];
                    case 1:
                        sets1 = _a.sent();
                        return [4 /*yield*/, phase2.getSets({ concurrency: concurrency })];
                    case 2:
                        sets2 = _a.sent();
                        expect(sets1.length).to.be.equal(248);
                        expect(sets2.length).to.be.equal(1292);
                        sets1.forEach(function (set) {
                            expect(set).to.be.instanceof(Set);
                        });
                        sets2.forEach(function (set) {
                            expect(set).to.be.instanceof(Set);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all players for a phase', function () {
        return __awaiter(this, void 0, void 0, function () {
            var players1, players2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase1.getPlayers({ concurrency: concurrency })];
                    case 1:
                        players1 = _a.sent();
                        return [4 /*yield*/, phase2.getPlayers({ concurrency: concurrency })];
                    case 2:
                        players2 = _a.sent();
                        expect(players1.length).to.be.equal(156);
                        expect(players2.length).to.be.equal(678);
                        players1.forEach(function (set) {
                            expect(set).to.be.instanceof(Player);
                        });
                        players2.forEach(function (set) {
                            expect(set).to.be.instanceof(Player);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get sets x minutes back', function () {
        return __awaiter(this, void 0, void 0, function () {
            var minutesBack, event, eventDate, clock, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        minutesBack = 5;
                        return [4 /*yield*/, Event.getEvent(phase1.getEventId())];
                    case 1:
                        event = _a.sent();
                        eventDate = moment(event.getStartTime()).add(30, 'minutes').toDate();
                        clock = sinon.useFakeTimers(eventDate);
                        return [4 /*yield*/, phase1.getSetsXMinutesBack(minutesBack)];
                    case 2:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(5);
                        sets.forEach(function (set) {
                            expect(set).to.be.instanceof(Set);
                            var now = moment();
                            var then = moment(set.getCompletedAt());
                            var diff = moment.duration(now.diff(then)).minutes();
                            expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
                        });
                        clock.restore();
                        return [2 /*return*/, true];
                }
            });
        });
    });
});
