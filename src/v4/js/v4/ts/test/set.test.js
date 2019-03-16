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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var ROOT = path_1.default.join(__dirname, '..', '..', '..', '..', '.env');
var dotenv_1 = require("dotenv");
dotenv_1.config({ path: ROOT });
require("../lib/util/ErrorHandler");
var lodash_1 = __importDefault(require("lodash"));
var moment_1 = __importDefault(require("moment"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
var GGSet_1 = require("../lib/GGSet");
var Game_1 = require("../lib/Game");
var Entrant_1 = require("../lib/Entrant");
var Attendee_1 = require("../lib/Attendee");
var testData = __importStar(require("./data/sets.testData"));
var gameData = __importStar(require("./data/games.testData"));
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var set1, set2, set3;
var SET_ID_1 = +'11186682';
var SET_ID_2 = +'11186683';
var SET_ID_3 = +'8798920';
describe('Smash GG Set', function () {
    this.timeout(10000);
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                    case 1:
                        _a.sent();
                        console.log('Testing displayScore parsing first...');
                        expect(GGSet_1.GGSet.parseDisplayScore(testData.set1.displayScore)).to.deep.equal(testData.parsedDisplayScore1);
                        expect(GGSet_1.GGSet.parseDisplayScore(testData.set2.displayScore)).to.deep.equal(testData.parsedDisplayScore2);
                        expect(GGSet_1.GGSet.parseDisplayScore(testData.set3.displayScore)).to.deep.equal(testData.parsedDisplayScore3);
                        console.log('Success!');
                        return [4 /*yield*/, GGSet_1.GGSet.get(SET_ID_1)];
                    case 2:
                        set1 = _a.sent();
                        return [4 /*yield*/, GGSet_1.GGSet.get(SET_ID_2)];
                    case 3:
                        set2 = _a.sent();
                        return [4 /*yield*/, GGSet_1.GGSet.get(SET_ID_3)];
                    case 4:
                        set3 = _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // event id
    it('should return the correct event id 1', function () {
        expect(set1.getEventId()).to.be.equal(testData.set1.eventId);
    });
    it('should return the correct event id 2', function () {
        expect(set2.getEventId()).to.be.equal(testData.set2.eventId);
    });
    it('should return the correct event id 3', function () {
        expect(set3.getEventId()).to.be.equal(testData.set3.eventId);
    });
    // phase group id
    it('should return the correct phase group 1', function () {
        expect(set1.getPhaseGroupId()).to.be.equal(testData.set1.phaseGroupId);
    });
    it('should return the correct phase group 2', function () {
        expect(set2.getPhaseGroupId()).to.be.equal(testData.set2.phaseGroupId);
    });
    it('should return the correct phase group 3', function () {
        expect(set3.getPhaseGroupId()).to.be.equal(testData.set3.phaseGroupId);
    });
    // started at time
    it('should return the correct starting timestamp 1', function () {
        expect(set1.getStartedAtTimestamp()).to.be.equal(set1.startedAt);
    });
    it('should return the correct starting timestamp 2 ', function () {
        expect(set2.getStartedAtTimestamp()).to.be.equal(set2.startedAt);
    });
    it('should return the correct starting timestamp 3', function () {
        expect(set3.getStartedAtTimestamp()).to.be.equal(set3.startedAt);
    });
    // completed at time
    it('should return the correct completed timestamp 1', function () {
        expect(set1.getCompletedAtTimestamp()).to.be.equal(set1.completedAt);
    });
    it('should return the correct completed timestamp 2', function () {
        expect(set2.getCompletedAtTimestamp()).to.be.equal(set2.completedAt);
    });
    it('should return the correct completed timestamp 3', function () {
        expect(set3.getCompletedAtTimestamp()).to.be.equal(set3.completedAt);
    });
    // completed at time date
    it('should return the correct completed Datetime 1', function () {
        var expected = moment_1.default.unix(set1.completedAt).toDate();
        expect(moment_1.default(set1.getCompletedAt()).isSame(expected)).to.to.true;
    });
    it('should return the correct completed Datetime 2', function () {
        var expected = moment_1.default.unix(set2.completedAt).toDate();
        expect(moment_1.default(set2.getCompletedAt()).isSame(expected)).to.to.true;
    });
    it('should return the correct completed Datetime 3', function () {
        var expected = moment_1.default.unix(set3.completedAt).toDate();
        expect(moment_1.default(set3.getCompletedAt()).isSame(expected)).to.to.true;
    });
    // display score
    it('should return the correct display score string 1', function () {
        expect(set1.getDisplayScore()).to.be.equal(set1.displayScore);
    });
    it('should return the correct display score string 2', function () {
        expect(set2.getDisplayScore()).to.be.equal(set2.displayScore);
    });
    it('should return the correct display score string 3', function () {
        expect(set3.getDisplayScore()).to.be.equal(set3.displayScore);
    });
    // full round text
    it('should return the full round text 1', function () {
        expect(set1.getFullRoundText()).to.be.equal(set1.fullRoundText);
    });
    it('should return the full round text 2', function () {
        expect(set2.getFullRoundText()).to.be.equal(set2.fullRoundText);
    });
    it('should return the full round text 3', function () {
        expect(set3.getFullRoundText()).to.be.equal(set3.fullRoundText);
    });
    // round
    it('should return the round 1', function () {
        expect(set1.getRound()).to.be.equal(set1.round);
    });
    it('should return the round 2', function () {
        expect(set2.getRound()).to.be.equal(set2.round);
    });
    it('should return the round 3', function () {
        expect(set3.getRound()).to.be.equal(set3.round);
    });
    // state
    it('should return the state 1', function () {
        expect(set1.getState()).to.be.equal(set1.state);
    });
    it('should return the state 2', function () {
        expect(set2.getState()).to.be.equal(set2.state);
    });
    it('should return the state 3', function () {
        expect(set3.getState()).to.be.equal(set3.state);
    });
    // player 1
    it('should return player1 1', function () {
        expect(set1.getPlayer1()).to.deep.equal(testData.p1);
    });
    it('should return player1 2', function () {
        expect(set2.getPlayer1()).to.deep.equal(testData.p3);
    });
    it('should return player1 3', function () {
        expect(set3.getPlayer1()).to.deep.equal(testData.p5);
    });
    // player 1 playerId
    it('should return player1 1 playerId', function () {
        expect(set1.getPlayer1PlayerId()).to.be.equal(testData.p1.entrantId);
    });
    it('should return player1 2 playerId', function () {
        expect(set2.getPlayer1PlayerId()).to.be.equal(testData.p3.entrantId);
    });
    it('should return player1 3 playerId', function () {
        expect(set3.getPlayer1PlayerId()).to.be.equal(testData.p5.entrantId);
    });
    // player 1 attendee id
    it('should return player1 1 attendeeId', function () {
        expect(set1.getPlayer1AttendeeIds()).to.have.members(testData.p1.attendeeIds);
    });
    it('should return player1 2 attendeeId', function () {
        expect(set2.getPlayer1AttendeeIds()).to.have.members(testData.p3.attendeeIds);
    });
    it('should return player1 3 attendeeId', function () {
        expect(set3.getPlayer1AttendeeIds()).to.have.members(testData.p5.attendeeIds);
    });
    // player 2
    it('should return player1 1', function () {
        expect(set1.getPlayer2()).to.deep.equal(testData.p2);
    });
    it('should return player1 2', function () {
        expect(set2.getPlayer2()).to.deep.equal(testData.p4);
    });
    it('should return player1 3', function () {
        expect(set3.getPlayer2()).to.deep.equal(testData.p6);
    });
    // player 2 playerId
    it('should return player1 1 playerId', function () {
        expect(set1.getPlayer2PlayerId()).to.be.equal(testData.p2.entrantId);
    });
    it('should return player1 2 playerId', function () {
        expect(set2.getPlayer2PlayerId()).to.be.equal(testData.p4.entrantId);
    });
    it('should return player1 3 playerId', function () {
        expect(set3.getPlayer2PlayerId()).to.be.equal(testData.p6.entrantId);
    });
    // player 2 attendee id
    it('should return player1 1 attendeeId', function () {
        expect(set1.getPlayer2AttendeeIds()).to.have.members(testData.p2.attendeeIds);
    });
    it('should return player1 2 attendeeId', function () {
        expect(set2.getPlayer2AttendeeIds()).to.have.members(testData.p4.attendeeIds);
    });
    it('should return player1 3 attendeeId', function () {
        expect(set3.getPlayer2AttendeeIds()).to.have.members(testData.p6.attendeeIds);
    });
    // getting winner id
    it('should give the correct Winner ID 1', function () {
        expect(set1.getWinnerId()).to.deep.equal(testData.set1.winnerId);
    });
    it('should give the correct Winner ID 2', function () {
        expect(set2.getWinnerId()).to.deep.equal(testData.set2.winnerId);
    });
    it('should give the correct Winner ID 3', function () {
        expect(set3.getWinnerId()).to.deep.equal(testData.set3.winnerId);
    });
    // getting loser id
    it('should give the correct Loser ID 1', function () {
        expect(set1.getLoserId()).to.deep.equal(testData.p2.entrantId);
    });
    it('should give the correct Loser ID 2', function () {
        expect(set2.getLoserId()).to.deep.equal(testData.p4.entrantId);
    });
    it('should give the correct Loser ID 3', function () {
        expect(set3.getLoserId()).to.deep.equal(testData.p6.entrantId);
    });
    // getting winner
    it('should give the correct Winner 1', function () {
        expect(set1.getWinner()).to.deep.equal(testData.p1);
    });
    it('should give the correct Winner 2', function () {
        expect(set2.getWinner()).to.deep.equal(testData.p3);
    });
    it('should give the correct Winner 3', function () {
        expect(set3.getWinner()).to.deep.equal(testData.p5);
    });
    // getting loser
    it('should give the correct Loser 1', function () {
        expect(set1.getLoser()).to.deep.equal(testData.p2);
    });
    it('should give the correct Loser 2', function () {
        expect(set2.getLoser()).to.deep.equal(testData.p4);
    });
    it('should give the correct Loser 3', function () {
        expect(set3.getLoser()).to.deep.equal(testData.p6);
    });
    // total games
    it('should give the correct bestOf count 1', function () {
        expect(set1.getBestOfCount()).to.be.equal(5);
    });
    it('should give the correct bestOf count 2', function () {
        expect(set2.getBestOfCount()).to.be.equal(5);
    });
    it('should give the correct bestOf count 3', function () {
        expect(set3.getBestOfCount()).to.be.equal(5);
    });
    // Winner score
    it('should give the correct Winner score 1', function () {
        expect(set1.getWinnerScore()).to.be.equal(3);
    });
    it('should give the correct Winner score 2', function () {
        expect(set2.getWinnerScore()).to.be.equal(3);
    });
    it('should give the correct Winner score 3', function () {
        expect(set3.getWinnerScore()).to.be.equal(3);
    });
    // Loser score
    it('should give the correct Loser score 1', function () {
        expect(set1.getLoserScore()).to.be.equal(0);
    });
    it('should give the correct Loser score 2', function () {
        expect(set2.getLoserScore()).to.be.equal(0);
    });
    it('should give the correct Loser score 3', function () {
        expect(set3.getLoserScore()).to.be.equal(1);
    });
    // games
    it('should get the list of games played in the set 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expected, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expected = gameData.games1.map(function (gameData) { return Game_1.Game.parse(gameData); });
                        _a = expect;
                        return [4 /*yield*/, set1.getGames()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.have.deep.members(expected);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get the list of games played in the set 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expected, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expected = gameData.games2.map(function (gameData) { return Game_1.Game.parse(gameData); });
                        _a = expect;
                        return [4 /*yield*/, set2.getGames()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.have.deep.members(expected);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get the list of games played in the set 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expected, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expected = gameData.games3.map(function (gameData) { return Game_1.Game.parse(gameData); });
                        _a = expect;
                        return [4 /*yield*/, set3.getGames()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.have.deep.members(expected);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // entrants
    it('should get the correct entrants who played in the set 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, set1.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (entrant) {
                            expect(entrant).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get the correct entrants who played in the set 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, set2.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (entrant) {
                            expect(entrant).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get the correct entrants who played in the set 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, set3.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (entrant) {
                            expect(entrant).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // participants
    it('should get the correct attendees who played in the set 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var attendees, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, set1.getAttendees()];
                    case 1:
                        attendees = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(attendees)).to.be.false;
                        attendees.forEach(function (attendee) {
                            expect(attendee).to.be.an.instanceof(Attendee_1.Attendee);
                        });
                        expect(attendees.length).to.be.equal(2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get the correct attendees who played in the set 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var attendees, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, set2.getAttendees()];
                    case 1:
                        attendees = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(attendees)).to.be.false;
                        attendees.forEach(function (attendee) {
                            expect(attendee).to.be.an.instanceof(Attendee_1.Attendee);
                        });
                        expect(attendees.length).to.be.equal(2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get the correct participants who played in the set 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var attendees, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, set3.getAttendees()];
                    case 1:
                        attendees = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(attendees)).to.be.false;
                        attendees.forEach(function (attendee) {
                            expect(attendee).to.be.an.instanceof(Attendee_1.Attendee);
                        });
                        expect(attendees.length).to.be.equal(2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    xit('should give the correct Bracket ID', function (done) {
        //expect(set1.getBracketId()).to.be.equal('58df119c60fbb')
        //expect(set2.getBracketId()).to.be.equal('58df119c60fbb')
        //expect(set3.getBracketId()).to.be.equal('58df119c60fbb')
        done();
    });
    xit('should give the correct Winners Tournament Placement', function (done) {
        /*
        let winner1 = set1.getWinner() as Player
        let data1 = winner1.data as IPlayer.Entity
        expect(set1.getWinnersTournamentPlacement()).to.be.equal(data1.finalPlacement);

        done();
        */
    });
    xit('should give the correct Winners Tournament Placement 2', function (done) {
        /*
        let winner2 = set2.getWinner() as Player
        let data2 = winner2.data as IPlayer.Entity
        expect(set2.getWinnersTournamentPlacement()).to.be.equal(data2.finalPlacement);
        
        done()
        */
    });
    xit('should give the correct Winners Tournament Placement 3', function (done) {
        /*
        let winner3 = set3.getWinner() as Player
        let data3 = winner3.data as IPlayer.Entity
        expect(set3.getWinnersTournamentPlacement()).to.be.equal(data3.finalPlacement);

        done();
        */
    });
    xit('should give the correct Losers Tournament Placement', function (done) {
        /*
        let loser1 = set1.getLoser() as Player
        let data1 = loser1.data as IPlayer.Entity
        expect(set1.getLosersTournamentPlacement()).to.be.equal(data1.finalPlacement);

        done()
        */ ;
    });
    xit('should give the correct Losers Tournament Placement 2', function (done) {
        /*
        let loser2 = set2.getLoser() as Player
        let data2 = loser2.data as IPlayer.Entity
        expect(set2.getLosersTournamentPlacement()).to.be.equal(data2.finalPlacement);

        done()
        */
    });
    xit('should give the correct Losers Tournament Placement 3', function (done) {
        /*
        let loser3 = set3.getLoser() as Player
        let data3 = loser3.data as IPlayer.Entity
        expect(set3.getLosersTournamentPlacement()).to.be.equal(data3.finalPlacement);

        done()
        */
    });
    xit('should give the correct Midsize Round Text', function (done) {
        /*
        expect(set1.getMidsizeRoundText()).to.be.equal('Winners 1')
        expect(set2.getMidsizeRoundText()).to.be.equal('Winners Quarters')
        expect(set3.getMidsizeRoundText()).to.be.equal('Winners Quarters')
        done()
        */
    });
});
