"use strict";
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
/* eslint-disable */
require("../lib/util/ErrorHandler");
var lodash_1 = __importDefault(require("lodash"));
var moment_1 = __importDefault(require("moment"));
var sinon_1 = __importDefault(require("sinon"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var expect = chai_1.default.expect;
chai_1.default.use(chai_as_promised_1.default);
var internal_1 = require("../lib/internal");
var Cache_1 = __importDefault(require("../lib/util/Cache"));
var tournament1;
var tournament2;
var tournament3;
var tournament4;
var tournament5;
var tournament6;
var TOURNAMENT_NAME1 = 'function1';
var TOURNAMENT_NAME2 = 'ceo2016';
var TOURNAMENT_NAME3 = 'to12';
var BAD_TOURNAMENT_NAME = 'badnamedotexe';
var expectedTournaments_1 = __importDefault(require("./data/expectedTournaments"));
var concurrency = 2;
function loadTournament(name, options) {
    return new Promise(function (resolve, reject) {
        var t = new internal_1.Tournament(name, options);
        t.on('ready', function () {
            return resolve(t);
        });
    });
}
describe('Smash GG Tournament', function () {
    before(function () { return console.log('concurrency set to %s', concurrency); });
    beforeEach(function () {
        Cache_1.default.flush();
    });
    it('should correctly load tournament data', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME1, { rawEncoding: 'utf8' })];
                    case 1:
                        tournament1 = _a.sent();
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME2, { rawEncoding: 'base64' })];
                    case 2:
                        tournament2 = _a.sent();
                        return [4 /*yield*/, loadTournament(TOURNAMENT_NAME3, {
                                expands: {
                                    event: true,
                                    phase: true,
                                    groups: true,
                                    stations: true
                                }
                            })];
                    case 3:
                        tournament3 = _a.sent();
                        /*
                        tournament4 = await loadTournament(TOURNAMENT_NAME1, {
                            isCached: false,
                            rawEncoding: 'utf8'
                        })
                        tournament5 = await loadTournament(TOURNAMENT_NAME2, {
                            isCached: false,
                            rawEncoding: 'base64'
                        })
                        */
                        // TODO BAD TOURNAMENT TEST
                        //tournament4 = await loadTournament(BAD_TOURNAMENT_NAME);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should implement convenience methods correctly', function () {
        return __awaiter(this, void 0, void 0, function () {
            var cTournament1, cTournament2, cTournament3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(15000);
                        return [4 /*yield*/, internal_1.Tournament.getTournament(TOURNAMENT_NAME1, { rawEncoding: 'utf8' })];
                    case 1:
                        cTournament1 = _a.sent();
                        return [4 /*yield*/, internal_1.Tournament.getTournament(TOURNAMENT_NAME2, { rawEncoding: 'base64' })];
                    case 2:
                        cTournament2 = _a.sent();
                        return [4 /*yield*/, internal_1.Tournament.getTournament(TOURNAMENT_NAME3)];
                    case 3:
                        cTournament3 = _a.sent();
                        expect(cTournament1.data).to.deep.equal(tournament1.data);
                        expect(cTournament2.data).to.deep.equal(tournament2.data);
                        expect(cTournament3.data).to.deep.equal(tournament3.data);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should return the correct tournament id', function (done) {
        var id1 = tournament1.getId();
        var id2 = tournament2.getId();
        expect(id1).to.be.equal(expectedTournaments_1.default.tournaments.function1.entities.tournament.id);
        expect(id2).to.be.equal(expectedTournaments_1.default.tournaments.ceo2016.entities.tournament.id);
        done();
    });
    it('should return the correct tournament name', function (done) {
        var name1 = tournament1.getName();
        var name2 = tournament2.getName();
        expect(name1).to.be.equal(expectedTournaments_1.default.tournaments.function1.entities.tournament.name);
        expect(name2).to.be.equal(expectedTournaments_1.default.tournaments.ceo2016.entities.tournament.name);
        done();
    });
    it('should return the correct tournament slug', function (done) {
        var slug1 = tournament1.getSlug();
        var slug2 = tournament2.getSlug();
        expect(slug1).to.be.equal(expectedTournaments_1.default.tournaments.function1.entities.tournament.slug);
        expect(slug2).to.be.equal(expectedTournaments_1.default.tournaments.ceo2016.entities.tournament.slug);
        done();
    });
    it('should return the correct starting time', function (done) {
        var startTime1 = tournament1.getStartTime();
        var startTime2 = tournament2.getStartTime();
        var expected1 = moment_1.default('04-01-2017 11:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        var expected2 = moment_1.default('06-24-2016 00:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        expect(startTime1.getTime()).to.be.equal(expected1.getTime());
        expect(startTime2.getTime()).to.be.equal(expected2.getTime());
        done();
    });
    it('should return the correct starting time string', function (done) {
        var startTime1 = tournament1.getStartTimeString();
        var startTime2 = tournament2.getStartTimeString();
        try {
            expect(startTime1).to.be.equal('04-01-2017 11:00:00 EST');
        }
        catch (e) {
            expect(startTime1).to.be.equal('04-01-2017 11:00:00 EDT');
        }
        try {
            expect(startTime2).to.be.equal('06-24-2016 00:00:00 EST');
        }
        catch (e) {
            expect(startTime2).to.be.equal('06-24-2016 00:00:00 EDT');
        }
        done();
    });
    it('should return the correct end time', function (done) {
        var endTime1 = tournament1.getEndTime();
        var endTime2 = tournament2.getEndTime();
        var expected1 = moment_1.default('04-01-2017 23:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        var expected2 = moment_1.default('06-27-2016 00:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        expect(endTime1.getTime()).to.be.equal(expected1.getTime());
        expect(endTime2.getTime()).to.be.equal(expected2.getTime());
        done();
    });
    it('should return the correct end time string', function (done) {
        var endTime1 = tournament1.getEndTimeString();
        var endTime2 = tournament2.getEndTimeString();
        try {
            expect(endTime1).to.be.equal('04-01-2017 23:00:00 EST');
        }
        catch (e) {
            expect(endTime1).to.be.equal('04-01-2017 23:00:00 EDT');
        }
        try {
            expect(endTime2).to.be.equal('06-27-2016 00:00:00 EST');
        }
        catch (e) {
            expect(endTime2).to.be.equal('06-27-2016 00:00:00 EDT');
        }
        done();
    });
    it('should return the correct time registration closes', function (done) {
        var closesTime1 = tournament1.getWhenRegistrationCloses();
        var closesTime2 = tournament2.getWhenRegistrationCloses();
        var expected1 = moment_1.default('03-30-2017 02:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        var expected2 = moment_1.default('06-13-2016 08:00:00', 'MM-DD-YYYY hh:mm:ss').toDate();
        expect(closesTime1.getTime()).to.be.equal(expected1.getTime());
        expect(closesTime2.getTime()).to.be.equal(expected2.getTime());
        done();
    });
    it('should return the correct time registration closes string', function (done) {
        var closesTime1 = tournament1.getWhenRegistrationClosesString();
        var closesTime2 = tournament2.getWhenRegistrationClosesString();
        try {
            expect(closesTime1).to.be.equal('03-30-2017 02:00:00 EST');
        }
        catch (e) {
            expect(closesTime1).to.be.equal('03-30-2017 02:00:00 EDT');
        }
        try {
            expect(closesTime2).to.be.equal('06-13-2016 08:00:00 EST');
        }
        catch (e) {
            expect(closesTime2).to.be.equal('06-13-2016 08:00:00 EDT');
        }
        done();
    });
    it('should return the correct state', function (done) {
        var state1 = tournament1.getState();
        var state2 = tournament2.getState();
        expect(state1).to.be.equal('GA');
        expect(state2).to.be.equal('FL');
        done();
    });
    it('should return the correct city', function (done) {
        var city1 = tournament1.getCity();
        var city2 = tournament2.getCity();
        expect(city1).to.be.equal('Atlanta');
        expect(city2).to.be.equal('Orlando');
        done();
    });
    it('should return the correct zip code', function (done) {
        var zip1 = tournament1.getZipCode();
        var zip2 = tournament2.getZipCode();
        expect(zip1).to.be.equal('30339');
        expect(zip2).to.be.equal('32819');
        done();
    });
    it('should return the correct owner id', function (done) {
        var ownerId1 = tournament1.getOwnerId();
        var ownerId2 = tournament2.getOwnerId();
        expect(ownerId1).to.be.equal(421);
        expect(ownerId2).to.be.equal(3431);
        done();
    });
    it('should return the correct contact email', function (done) {
        var email1 = tournament1.getContactEmail();
        var email2 = tournament2.getContactEmail();
        expect(email1).to.be.equal('contact@recursion.gg');
        expect(email2).to.be.equal('ceogaming@gmail.com');
        done();
    });
    it('should return the correct contact twitter', function (done) {
        var twitter1 = tournament1.getContactTwitter();
        var twitter2 = tournament2.getContactTwitter();
        expect(twitter1).to.be.equal('recursiongg');
        expect(twitter2).to.be.equal('ceogaming');
        done();
    });
    it('should return the correct venue fee', function (done) {
        var venueFee1 = tournament1.getVenueFee();
        var venueFee2 = tournament2.getVenueFee();
        expect(venueFee1).to.be.equal(20);
        expect(venueFee2).to.be.equal(null);
        done();
    });
    it('should return the correct processing fee', function (done) {
        var processingFee1 = tournament1.getProcessingFee();
        var processingFee2 = tournament2.getProcessingFee();
        expect(processingFee1).to.be.equal(5);
        expect(processingFee2).to.be.equal(5);
        done();
    });
    it('should get all players from a tournament', function () {
        return __awaiter(this, void 0, void 0, function () {
            var players, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, tournament1.getAllPlayers({ concurrency: concurrency })];
                    case 1:
                        players = _a.sent();
                        expect(players.length).to.be.equal(157);
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(players)).to.be.false;
                        players.forEach(function (player) {
                            expect(player).to.be.an.instanceof(internal_1.Player);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get all sets from a tournament', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, tournament1.getAllSets({ concurrency: concurrency })];
                    case 1:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(552);
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(internal_1.GGSet);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get all events from a tournament', function () {
        return __awaiter(this, void 0, void 0, function () {
            var events, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, tournament1.getAllEvents({ concurrency: concurrency })];
                    case 1:
                        events = _a.sent();
                        expect(events.length).to.be.equal(2);
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(events)).to.be.false;
                        events.forEach(function (event) {
                            expect(event).to.be.an.instanceof(internal_1.Event);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should resolve the correct amount of incomplete sets', function () {
        return __awaiter(this, void 0, void 0, function () {
            var t, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, internal_1.Tournament.getTournament('21xx-cameron-s-birthday-bash-1')];
                    case 1:
                        t = _a.sent();
                        return [4 /*yield*/, t.getIncompleteSets()];
                    case 2:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should resolve the correct amount of complete sets', function () {
        return __awaiter(this, void 0, void 0, function () {
            var t, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, internal_1.Tournament.getTournament('21xx-cameron-s-birthday-bash-1')];
                    case 1:
                        t = _a.sent();
                        return [4 /*yield*/, t.getCompleteSets()];
                    case 2:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(72);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should resolve the correct number of sets x minutes ago', function () {
        return __awaiter(this, void 0, void 0, function () {
            var minutesBack, t, tournamentDate, clock, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        minutesBack = 15;
                        return [4 /*yield*/, internal_1.Tournament.getTournament('21xx-cameron-s-birthday-bash-1')];
                    case 1:
                        t = _a.sent();
                        tournamentDate = moment_1.default(t.getStartTime()).add(30, 'minutes').toDate();
                        clock = sinon_1.default.useFakeTimers(tournamentDate);
                        return [4 /*yield*/, t.getSetsXMinutesBack(minutesBack)];
                    case 2:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(1);
                        sets.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                            var now = moment_1.default();
                            var then = moment_1.default(set.getCompletedAt());
                            var diff = moment_1.default.duration(now.diff(then)).minutes();
                            expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
                        });
                        clock.restore();
                        return [2 /*return*/, true];
                }
            });
        });
    });
});
