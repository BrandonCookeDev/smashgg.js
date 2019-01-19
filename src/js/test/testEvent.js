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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib/util/ErrorHandler");
var lodash_1 = __importDefault(require("lodash"));
var moment_1 = __importDefault(require("moment"));
var sinon_1 = __importDefault(require("sinon"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect, assert = chai_1.default.assert;
var TOP_8_LABELS = [
    'Losers Quarter-Final', 'Losers Quarter-Final',
    'Losers Semi-Final', 'Losers Semi-Final',
    'Winners Semi-Final', 'Winners Semi-Final',
    'Winners Final', 'Grand Final', 'Losers Final'
];
var GRAND_FINAL_RESET_TOKEN = 'Grand Final Reset';
var internal_1 = require("../lib/internal");
var Cache_1 = __importDefault(require("../lib/util/Cache"));
var Logger_1 = require("../lib/util/Logger");
var event1;
var event2;
var event3;
var event4;
var TOURNAMENT_NAME1 = 'function-1-recursion-regional';
var EVENT_NAME1 = 'melee-singles';
var TOURNAMENT_NAME2 = 'ceo-2016';
var TOURNAMENT_NAME3 = 'tipped-off-12-presented-by-the-lab-gaming-center';
var BAD_TOURNAMENT_NAME = 'badnamedotexe';
var EVENT_ID_1 = 14335;
var concurrency = 4;
function loadEvent(eventName, tournamentName, options) {
    return new Promise(function (resolve, reject) {
        var event = new internal_1.Event(eventName, tournamentName, options);
        event.on('ready', function () {
            resolve(event);
        });
        event.on('error', console.error);
    });
}
function loadEventViaId(id, options) {
    return new Promise(function (resolve, reject) {
        if (isNaN(id))
            return reject('ID must be an integer');
        var event = new internal_1.Event(id, undefined, options);
        event.on('ready', function () {
            resolve(event);
        });
        event.on('error', function (err) {
            console.error(err);
        });
    });
}
describe('Smash GG Event', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        console.time('Before All');
                        console.log('concurrency set to %s', concurrency);
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncoding: 'utf8' })];
                    case 1:
                        event1 = _a.sent();
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME2, {})];
                    case 2:
                        event2 = _a.sent();
                        return [4 /*yield*/, loadEventViaId(EVENT_ID_1, { rawEncoding: 'base64' })];
                    case 3:
                        event3 = _a.sent();
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME3, {})];
                    case 4:
                        event4 = _a.sent();
                        console.timeEnd('Before All');
                        return [2 /*return*/, true];
                }
            });
        });
    });
    beforeEach(function () {
        Cache_1.default.flush();
        Logger_1.setLogLevel('info');
    });
    xit('should correctly load the data', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncoding: 'utf8' })];
                    case 1:
                        event1 = _a.sent();
                        return [4 /*yield*/, loadEvent(EVENT_NAME1, TOURNAMENT_NAME2, {})];
                    case 2:
                        event2 = _a.sent();
                        return [4 /*yield*/, loadEventViaId(EVENT_ID_1, { rawEncoding: 'base64' })];
                    case 3:
                        event3 = _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly implement convenience methods', function () {
        return __awaiter(this, void 0, void 0, function () {
            var cEvent1, cEvent2, cEvent3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(15000);
                        return [4 /*yield*/, internal_1.Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME1, { rawEncoding: 'utf8' })];
                    case 1:
                        cEvent1 = _a.sent();
                        return [4 /*yield*/, internal_1.Event.getEvent(EVENT_NAME1, TOURNAMENT_NAME2)];
                    case 2:
                        cEvent2 = _a.sent();
                        return [4 /*yield*/, internal_1.Event.getEventById(EVENT_ID_1, { rawEncoding: 'base64' })];
                    case 3:
                        cEvent3 = _a.sent();
                        expect(cEvent1.data).to.deep.equal(event1.data);
                        expect(cEvent2.data).to.deep.equal(event2.data);
                        expect(cEvent3.data).to.deep.equal(event3.data);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get the event name', function (done) {
        var name1 = event1.getName();
        var name3 = event3.getName();
        expect(name1).to.be.equal('Melee Singles');
        expect(name3).to.be.equal('Rocket League 3v3');
        done();
    });
    it('should correctly get the event slug', function (done) {
        var slug = event1.getSlug();
        expect(slug).to.be.equal('tournament/function-1-recursion-regional/event/melee-singles');
        done();
    });
    it('should correctly get the event start time', function (done) {
        var startTime1 = event1.getStartTime();
        var expected = moment_1.default('04-01-2017 11:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        expect(startTime1.getTime()).to.be.equal(expected.getTime());
        done();
    });
    it('should correctly get the event start time string', function (done) {
        var startTime1 = event1.getStartTimeString();
        try {
            expect(startTime1).to.be.equal('04-01-2017 11:00:00 EST');
        }
        catch (e) {
            expect(startTime1).to.be.equal('04-01-2017 11:00:00 EDT');
        }
        done();
    });
    it('should correctly get the event end time', function (done) {
        var endTime1 = event1.getEndTime();
        var expected = moment_1.default('04-01-2017 12:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        expect(endTime1.getTime()).to.be.equal(expected.getTime());
        done();
    });
    it('should correctly get the event end time string', function (done) {
        var endTime1 = event1.getEndTimeString();
        try {
            expect(endTime1).to.be.equal('04-01-2017 12:00:00 EST');
        }
        catch (e) {
            expect(endTime1).to.be.equal('04-01-2017 12:00:00 EDT');
        }
        done();
    });
    it('should correctly get the tournament slugs', function () {
        var slug1 = event1.getTournamentSlug();
        var slug2 = event2.getTournamentSlug();
        var slug3 = event3.getTournamentSlug();
        expect(slug1).to.be.equal('function-1-recursion-regional');
        expect(slug2).to.be.equal('ceo-2016');
        expect(slug3).to.be.equal('pulsar-premier-league');
    });
    it('should correctly get the phases', function () {
        return __awaiter(this, void 0, void 0, function () {
            var phases1, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(15000);
                        return [4 /*yield*/, event1.getEventPhases({ concurrency: concurrency })];
                    case 1:
                        phases1 = _a.sent();
                        expect(phases1.length).to.be.equal(4);
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(phases1)).to.be.false;
                        phases1.forEach(function (phase) {
                            expect(phase).to.be.instanceof(internal_1.Phase);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get the phases 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var phases2, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(15000);
                        return [4 /*yield*/, event2.getEventPhases({ concurrency: concurrency })];
                    case 1:
                        phases2 = _a.sent();
                        expect(phases2.length).to.be.equal(2);
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(phases2)).to.be.false;
                        phases2.forEach(function (phase) {
                            expect(phase).to.be.instanceof(internal_1.Phase);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get the phase groups', function () {
        return __awaiter(this, void 0, void 0, function () {
            var groups1, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, event1.getEventPhaseGroups({ concurrency: concurrency })];
                    case 1:
                        groups1 = _a.sent();
                        expect(groups1.length).to.be.equal(22);
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(groups1)).to.be.false;
                        groups1.forEach(function (group) {
                            expect(group).to.be.instanceof(internal_1.PhaseGroup);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get the phase groups 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var groups2, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(25000);
                        return [4 /*yield*/, event2.getEventPhaseGroups({ concurrency: concurrency })];
                    case 1:
                        groups2 = _a.sent();
                        expect(groups2.length).to.be.equal(33);
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(groups2)).to.be.false;
                        groups2.forEach(function (group) {
                            expect(group).to.be.instanceof(internal_1.PhaseGroup);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all sets from an event', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, event1.getSets({ concurrency: concurrency })];
                    case 1:
                        sets1 = _a.sent();
                        expect(sets1.length).to.be.equal(469);
                        sets1.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    xit('should correctly get all sets from an event 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, event2.getSets({ concurrency: concurrency })];
                    case 1:
                        sets2 = _a.sent();
                        expect(sets2.length).to.be.equal(1386);
                        sets2.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all top 8 sets from an event', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, rounds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        Logger_1.setLogLevel('verbose');
                        return [4 /*yield*/, event1.getTop8Sets({ concurrency: concurrency })];
                    case 1:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(10);
                        rounds = sets.map(function (set) { return set.getRound(); });
                        expect(rounds).to.include.members(TOP_8_LABELS);
                        expect(rounds).to.include.members(['Losers Round 7', 'Losers Round 7']);
                        sets.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all top 8 sets from an event 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, rounds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        Logger_1.setLogLevel('verbose');
                        return [4 /*yield*/, event2.getTop8Sets({ concurrency: concurrency })];
                    case 1:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(10);
                        rounds = sets.map(function (set) { return set.getRound(); });
                        expect(rounds).to.include.members(TOP_8_LABELS);
                        expect(rounds).to.include.members(['Losers Round 7', 'Losers Round 7']);
                        sets.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all top 8 sets from an event 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.timeout(30000);
                        _a = expect;
                        return [4 /*yield*/, event3.getTop8Sets({ concurrency: concurrency })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.be.empty;
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all top 8 sets from an event 4', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, rounds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        Logger_1.setLogLevel('verbose');
                        return [4 /*yield*/, event4.getTop8Sets({ concurrency: concurrency })];
                    case 1:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(10);
                        rounds = sets.map(function (set) { return set.getRound(); });
                        expect(rounds).to.include.members(TOP_8_LABELS);
                        expect(rounds).to.include.members(['Losers Round 1', 'Losers Round 1']);
                        sets.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all players from an event', function () {
        return __awaiter(this, void 0, void 0, function () {
            var players1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, event1.getPlayers({ concurrency: concurrency })];
                    case 1:
                        players1 = _a.sent();
                        expect(players1.length).to.be.equal(156);
                        players1.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.Player);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all players from an event 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var players2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, event2.getPlayers({ concurrency: concurrency })];
                    case 1:
                        players2 = _a.sent();
                        expect(players2.length).to.be.equal(678);
                        players2.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.Player);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all sets x minutes back', function () {
        return __awaiter(this, void 0, void 0, function () {
            var minutesBack, eventDate, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        minutesBack = 15;
                        eventDate = new Date('Wed Dec 31 1969 19:00:00 GMT-0500 (EST)');
                        //moment(event1.getStartTime()).add(30, 'minutes').toDate();
                        sinon_1.default.useFakeTimers(eventDate);
                        return [4 /*yield*/, event1.getSetsXMinutesBack(minutesBack)];
                    case 1:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(3);
                        sets.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                            var now = moment_1.default();
                            var then = moment_1.default(set.getCompletedAt());
                            var diff = moment_1.default.duration(now.diff(then)).minutes();
                            expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
                        });
                        sinon_1.default.restore();
                        return [2 /*return*/, true];
                }
            });
        });
    });
});
