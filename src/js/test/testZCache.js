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
var Promise = require('bluebird');
var Tournament = require('../src/js/Tournament');
var Event = require('../src/js/Event');
var Phase = require('../src/js/Phase');
var PhaseGroup = require('../src/js/PhaseGroup');
var Set = require('../src/js/Set');
var Player = require('../src/js/Player');
var Cache = require('../src/js/util/Cache').getInstance();
var chai = require('chai');
var cap = require('chai-as-promised');
chai.use(cap);
var expect = chai.expect;
var assert = chai.assert;
var testData = _.extend(require('./data/testSets'), require('./data/testPlayers'));
var TOURNAMENT_NAME1 = 'function1';
var TOURNAMENT_NAME2 = 'ceo2016';
var EVENT_NAME1 = 'melee-singles';
var PHASEID1 = 111483;
var PHASEID2 = 45262;
var GROUPID1 = 44445;
var GROUPID2 = 301994;
describe('Test Caching', function () {
    before(function (done) {
        Cache.flush();
        done();
    });
    beforeEach(function (done) {
        Cache.flush();
        done();
    });
    after(function (done) {
        Cache.flush();
        done();
    });
    it('should correctly cache tournaments', function () {
        return __awaiter(this, void 0, void 0, function () {
            var t1, t2, keys, key1, key2, key1data, key2data, t1Cached, t2Cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME1)];
                    case 1:
                        t1 = _a.sent();
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME2)];
                    case 2:
                        t2 = _a.sent();
                        return [4 /*yield*/, Cache.keys()];
                    case 3:
                        keys = _a.sent();
                        expect(keys.length).to.be.equal(4);
                        key1 = 'tournament::function1::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&';
                        key2 = 'tournament::ceo2016::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&';
                        key1data = 'tournament::function1::json::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&::data';
                        key2data = 'tournament::ceo2016::json::expand[]=event&expand[]=phase&expand[]=groups&expand[]=stations&::data';
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        expect(keys).to.include(key1data);
                        expect(keys).to.include(key2data);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 4:
                        t1Cached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 5:
                        t2Cached = _a.sent();
                        expect(t1Cached).to.be.instanceof(Tournament);
                        expect(t2Cached).to.be.instanceof(Tournament);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache tournament players', function () {
        return __awaiter(this, void 0, void 0, function () {
            var t1, t1Players, keys, key1, t1PlayersCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME1)];
                    case 1:
                        t1 = _a.sent();
                        return [4 /*yield*/, t1.getAllPlayers()];
                    case 2:
                        t1Players = _a.sent();
                        return [4 /*yield*/, Cache.keys()];
                    case 3:
                        keys = _a.sent();
                        key1 = 'tournament::function1::players';
                        expect(keys).to.include(key1);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 4:
                        t1PlayersCached = _a.sent();
                        t1PlayersCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Player);
                        });
                        /*
                        let t2 = await loadTournament(TOURNAMENT_NAME2);
                        let t2Players = await t2.getAllPlayers();
                        let key2 = 'tournament::ceo2016::players';
                        expect(keys).to.include(key2);
                        let t2PlayersCached = await Cache.get(key2);
                        t2PlayersCached.forEach(element => {
                            expect(element).to.be.instanceof(Player)
                        });
                        */
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache tournament sets', function () {
        return __awaiter(this, void 0, void 0, function () {
            var t1, t1Sets, keys, key1, t1SetsCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME1)];
                    case 1:
                        t1 = _a.sent();
                        return [4 /*yield*/, t1.getAllSets()];
                    case 2:
                        t1Sets = _a.sent();
                        return [4 /*yield*/, Cache.keys()];
                    case 3:
                        keys = _a.sent();
                        key1 = 'tournament::function1::sets';
                        expect(keys).to.include(key1);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 4:
                        t1SetsCached = _a.sent();
                        t1SetsCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Set);
                        });
                        //let t2 = await loadTournament(TOURNAMENT_NAME2);
                        //let t2Sets = await t2.getAllSets();
                        //let key2 = 'tournament::ceo2016::sets';
                        //expect(keys).to.include(key2);
                        //let t2SetsCached = await Cache.get(key2);
                        //t2SetsCached.forEach(element => {
                        //	expect(element).to.be.instanceof(Set)
                        //});
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache tournament events', function () {
        return __awaiter(this, void 0, void 0, function () {
            var t1, t2, t1Events, t2Events, keys, key1, key2, t1EventsCached, t2EventsCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME1)];
                    case 1:
                        t1 = _a.sent();
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME2)];
                    case 2:
                        t2 = _a.sent();
                        return [4 /*yield*/, t1.getAllEvents()];
                    case 3:
                        t1Events = _a.sent();
                        return [4 /*yield*/, t2.getAllEvents()];
                    case 4:
                        t2Events = _a.sent();
                        return [4 /*yield*/, Cache.keys()];
                    case 5:
                        keys = _a.sent();
                        key1 = 'tournament::function1::events';
                        key2 = 'tournament::ceo2016::events';
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 6:
                        t1EventsCached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 7:
                        t2EventsCached = _a.sent();
                        t1EventsCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Event);
                        });
                        t2EventsCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Event);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache events', function () {
        return __awaiter(this, void 0, void 0, function () {
            var e1, e2, key1, key1data, key2, key2data, keys, e1Cached, e2Cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME1)];
                    case 1:
                        e1 = _a.sent();
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME2)];
                    case 2:
                        e2 = _a.sent();
                        key1 = 'event::function1::melee-singles::expand[]=phase&expand[]=groups&';
                        key1data = 'event::function1::melee-singles::json::expand[]=phase&expand[]=groups&::data';
                        key2 = 'event::ceo2016::melee-singles::expand[]=phase&expand[]=groups&';
                        key2data = 'event::ceo2016::melee-singles::json::expand[]=phase&expand[]=groups&::data';
                        return [4 /*yield*/, Cache.keys()];
                    case 3:
                        keys = _a.sent();
                        expect(keys.length).to.be.equal(8, "Current cache keys: " + JSON.stringify(keys));
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        expect(keys).to.include(key1data);
                        expect(keys).to.include(key2data);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 4:
                        e1Cached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 5:
                        e2Cached = _a.sent();
                        expect(e1Cached).to.be.instanceof(Event);
                        expect(e2Cached).to.be.instanceof(Event);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache the event phases', function () {
        return __awaiter(this, void 0, void 0, function () {
            var e1, e2, phases1, phases2, key1, key2, keys, e1PhasesCached, e2PhasesCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME1)];
                    case 1:
                        e1 = _a.sent();
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME2)];
                    case 2:
                        e2 = _a.sent();
                        return [4 /*yield*/, e1.getEventPhases()];
                    case 3:
                        phases1 = _a.sent();
                        return [4 /*yield*/, e2.getEventPhases()];
                    case 4:
                        phases2 = _a.sent();
                        key1 = 'event::function1::melee-singles::phases';
                        key2 = 'event::ceo2016::melee-singles::phases';
                        return [4 /*yield*/, Cache.keys()];
                    case 5:
                        keys = _a.sent();
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 6:
                        e1PhasesCached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 7:
                        e2PhasesCached = _a.sent();
                        e1PhasesCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Phase);
                        });
                        e2PhasesCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Phase);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache the event groups', function () {
        return __awaiter(this, void 0, void 0, function () {
            var e1, e2, groups1, groups2, key1, key2, keys, e2GroupsCached, e1GroupsCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME1)];
                    case 1:
                        e1 = _a.sent();
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME2)];
                    case 2:
                        e2 = _a.sent();
                        return [4 /*yield*/, e1.getEventPhaseGroups()];
                    case 3:
                        groups1 = _a.sent();
                        return [4 /*yield*/, e2.getEventPhaseGroups()];
                    case 4:
                        groups2 = _a.sent();
                        key1 = 'event::function1::melee-singles::groups';
                        key2 = 'event::ceo2016::melee-singles::groups';
                        return [4 /*yield*/, Cache.keys()];
                    case 5:
                        keys = _a.sent();
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 6:
                        e2GroupsCached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 7:
                        e1GroupsCached = _a.sent();
                        e1GroupsCached.forEach(function (element) {
                            expect(element).to.be.instanceof(PhaseGroup);
                        });
                        e2GroupsCached.forEach(function (element) {
                            expect(element).to.be.instanceof(PhaseGroup);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache phases', function () {
        return __awaiter(this, void 0, void 0, function () {
            var p1, p2, key1, key2, key1data, key2data, keys, p1Cached, p2Cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadPhase(PHASEID1)];
                    case 1:
                        p1 = _a.sent();
                        return [4 /*yield*/, loadPhase(PHASEID2)];
                    case 2:
                        p2 = _a.sent();
                        key1 = 'phase::' + PHASEID1 + '::expand[]=groups&';
                        key2 = 'phase::' + PHASEID2 + '::expand[]=groups&';
                        key1data = 'phase::' + PHASEID1 + '::json::expand[]=groups&::data';
                        key2data = 'phase::' + PHASEID2 + '::json::expand[]=groups&::data';
                        return [4 /*yield*/, Cache.keys()];
                    case 3:
                        keys = _a.sent();
                        expect(keys.length).to.be.equal(4);
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        expect(keys).to.include(key1data);
                        expect(keys).to.include(key2data);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 4:
                        p1Cached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 5:
                        p2Cached = _a.sent();
                        expect(p1Cached).to.be.instanceof(Phase);
                        expect(p2Cached).to.be.instanceof(Phase);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache groups from phases', function () {
        return __awaiter(this, void 0, void 0, function () {
            var p1, p2, pg1, pg2, key1, key2, keys, groups1Cached, groups2Cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadPhase(PHASEID1)];
                    case 1:
                        p1 = _a.sent();
                        return [4 /*yield*/, loadPhase(PHASEID2)];
                    case 2:
                        p2 = _a.sent();
                        return [4 /*yield*/, p1.getPhaseGroups()];
                    case 3:
                        pg1 = _a.sent();
                        return [4 /*yield*/, p2.getPhaseGroups()];
                    case 4:
                        pg2 = _a.sent();
                        key1 = 'phase::' + PHASEID1 + '::groups';
                        key2 = 'phase::' + PHASEID2 + '::groups';
                        return [4 /*yield*/, Cache.keys()];
                    case 5:
                        keys = _a.sent();
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 6:
                        groups1Cached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 7:
                        groups2Cached = _a.sent();
                        groups1Cached.forEach(function (element) {
                            expect(element).to.be.instanceof(PhaseGroup);
                        });
                        groups2Cached.forEach(function (element) {
                            expect(element).to.be.instanceof(PhaseGroup);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache phase groups', function () {
        return __awaiter(this, void 0, void 0, function () {
            var pg1, pg2, key1, key2, key1data, key2data, keys, pg1Cached, pg2Cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadPhaseGroup(GROUPID1)];
                    case 1:
                        pg1 = _a.sent();
                        return [4 /*yield*/, loadPhaseGroup(GROUPID2)];
                    case 2:
                        pg2 = _a.sent();
                        key1 = 'phasegroup::' + GROUPID1 + '::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&';
                        key2 = 'phasegroup::' + GROUPID2 + '::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&';
                        key1data = 'phasegroup::' + GROUPID1 + '::json::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&::data';
                        key2data = 'phasegroup::' + GROUPID2 + '::json::expand[]=sets&expand[]=entrants&expand[]=standings&expand[]=seeds&::data';
                        return [4 /*yield*/, Cache.keys()];
                    case 3:
                        keys = _a.sent();
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 4:
                        pg1Cached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 5:
                        pg2Cached = _a.sent();
                        expect(pg1Cached).to.be.instanceof(PhaseGroup);
                        expect(pg1Cached).to.be.instanceof(PhaseGroup);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache players from Phase Group', function () {
        return __awaiter(this, void 0, void 0, function () {
            var pg1, pg2, pg1Players, pg2Players, keys, key1, key2, pg1PlayersCached, pg2PlayersCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadPhaseGroup(GROUPID1)];
                    case 1:
                        pg1 = _a.sent();
                        return [4 /*yield*/, loadPhaseGroup(GROUPID2)];
                    case 2:
                        pg2 = _a.sent();
                        return [4 /*yield*/, pg1.getPlayers()];
                    case 3:
                        pg1Players = _a.sent();
                        return [4 /*yield*/, pg2.getPlayers()];
                    case 4:
                        pg2Players = _a.sent();
                        return [4 /*yield*/, Cache.keys()];
                    case 5:
                        keys = _a.sent();
                        key1 = 'phasegroup::' + GROUPID1 + '::players';
                        key2 = 'phasegroup::' + GROUPID2 + '::players';
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 6:
                        pg1PlayersCached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 7:
                        pg2PlayersCached = _a.sent();
                        pg1PlayersCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Player);
                        });
                        pg2PlayersCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Player);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly cache sets from Phase Group', function () {
        return __awaiter(this, void 0, void 0, function () {
            var pg1, pg2, pg1Players, pg2Players, keys, key1, key2, pg1SetsCached, pg2SetsCached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, loadPhaseGroup(GROUPID1)];
                    case 1:
                        pg1 = _a.sent();
                        return [4 /*yield*/, loadPhaseGroup(GROUPID2)];
                    case 2:
                        pg2 = _a.sent();
                        return [4 /*yield*/, pg1.getSets()];
                    case 3:
                        pg1Players = _a.sent();
                        return [4 /*yield*/, pg2.getSets()];
                    case 4:
                        pg2Players = _a.sent();
                        return [4 /*yield*/, Cache.keys()];
                    case 5:
                        keys = _a.sent();
                        key1 = 'phasegroup::' + GROUPID1 + '::sets';
                        key2 = 'phasegroup::' + GROUPID2 + '::sets';
                        expect(keys).to.include(key1);
                        expect(keys).to.include(key2);
                        return [4 /*yield*/, Cache.get(key1)];
                    case 6:
                        pg1SetsCached = _a.sent();
                        return [4 /*yield*/, Cache.get(key2)];
                    case 7:
                        pg2SetsCached = _a.sent();
                        pg1SetsCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Set);
                        });
                        pg2SetsCached.forEach(function (element) {
                            expect(element).to.be.instanceof(Set);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
});
function loadTournament(name, expands, isCached) {
    return new Promise(function (resolve, reject) {
        var t = new Tournament(name, expands, isCached);
        t.on('ready', function () {
            return resolve(t);
        });
    });
}
function loadEvent(eventName, tournamentName) {
    return new Promise(function (resolve, reject) {
        var event = new Event(eventName, tournamentName);
        event.on('ready', function () {
            resolve(event);
        });
    });
}
function loadPhase(id, expands, isCached) {
    return new Promise(function (resolve, reject) {
        var P = new Phase(id, expands, isCached);
        P.on('ready', function () {
            resolve(P);
        });
    });
}
function loadPhaseGroup(id, expands, isCached) {
    return new Promise(function (resolve, reject) {
        var PG = new PhaseGroup(id, expands, isCached);
        PG.on('ready', function () {
            resolve(PG);
        });
    });
}
