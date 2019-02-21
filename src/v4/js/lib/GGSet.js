"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var lodash_1 = __importDefault(require("lodash"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var events_1 = require("events");
var Game_1 = require("./Game"); // TODO change to internal later 
var Logger_1 = __importDefault(require("./util/Logger"));
var NetworkInterface_1 = __importDefault(require("./util/NetworkInterface"));
var queries = __importStar(require("./scripts/setQueries"));
var Attendee_1 = require("./Attendee");
var Entrant_1 = require("./Entrant");
var DISPLAY_SCORE_REGEX = new RegExp(/^([\S\s]*) ([0-9]{1,3}) - ([\S\s]*) ([0-9]{1,3})$/);
var GGSet = /** @class */ (function (_super) {
    __extends(GGSet, _super);
    function GGSet(id, eventId, phaseGroupId, displayScore, fullRoundText, round, startedAt, completedAt, winnerId, totalGames, state, player1, player2, score1, score2) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.eventId = eventId;
        _this.phaseGroupId = phaseGroupId;
        _this.displayScore = displayScore;
        _this.fullRoundText = fullRoundText;
        _this.round = round;
        _this.startedAt = startedAt;
        _this.completedAt = completedAt;
        _this.winnerId = winnerId;
        _this.totalGames = totalGames;
        _this.state = state;
        _this.player1 = player1;
        _this.player2 = player2;
        _this.score1 = score1;
        _this.score2 = score2;
        return _this;
    }
    GGSet.parseDisplayScore = function (displayScore) {
        var parsed = DISPLAY_SCORE_REGEX.exec(displayScore);
        var tag1, score1, tag2, score2;
        if (parsed) {
            tag1 = parsed[1];
            score1 = +parsed[2];
            tag2 = parsed[3];
            score2 = +parsed[4];
        }
        return {
            tag1: tag1 || null,
            tag2: tag2 || null,
            score1: score1 || 0,
            score2: score2 || 0
        };
    };
    GGSet.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting set with id %s', id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.set, { id: id.toString() })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, GGSet.parseFull(data)];
                }
            });
        });
    };
    GGSet.parse = function (data) {
        var displayScoreParsed = GGSet.parseDisplayScore(data.displayScore);
        var p1 = IGGSet.PlayerLite.parse(displayScoreParsed.tag1, data.slots[0]);
        var p2 = IGGSet.PlayerLite.parse(displayScoreParsed.tag2, data.slots[1]);
        return new GGSet(+data.id, data.eventId, data.phaseGroupId, data.displayScore, data.fullRoundText, data.round, data.startedAt, data.completedAt, data.winnerId, data.totalGames, data.state, p1, p2, displayScoreParsed.score1, displayScoreParsed.score2);
    };
    GGSet.parseFull = function (data) {
        return GGSet.parse(data.set);
    };
    /** Instance Based **/
    // simple
    GGSet.prototype.getEventId = function () {
        return this.eventId;
    };
    GGSet.prototype.getPhaseGroupId = function () {
        return this.phaseGroupId;
    };
    GGSet.prototype.getDisplayScore = function () {
        return this.displayScore;
    };
    GGSet.prototype.getFullRoundText = function () {
        return this.fullRoundText;
    };
    GGSet.prototype.getRound = function () {
        return this.round;
    };
    GGSet.prototype.getState = function () {
        return this.state;
    };
    GGSet.prototype.getPlayer1 = function () {
        return this.player1;
    };
    GGSet.prototype.getPlayer1Tag = function () {
        return this.player1.tag;
    };
    GGSet.prototype.getPlayer1AttendeeIds = function () {
        return this.player1.attendeeIds;
    };
    GGSet.prototype.getPlayer1PlayerId = function () {
        return this.player1.entrantId;
    };
    GGSet.prototype.getPlayer2 = function () {
        return this.player2;
    };
    GGSet.prototype.getPlayer2Tag = function () {
        return this.player2.tag;
    };
    GGSet.prototype.getPlayer2AttendeeIds = function () {
        return this.player2.attendeeIds;
    };
    GGSet.prototype.getPlayer2PlayerId = function () {
        return this.player2.entrantId;
    };
    GGSet.prototype.getStartedAtTimestamp = function () {
        return this.startedAt;
    };
    GGSet.prototype.getCompletedAtTimestamp = function () {
        return this.completedAt;
    };
    // Todo needs coverage
    GGSet.prototype.getStartedAt = function () {
        if (this.startedAt)
            return moment_timezone_1.default.unix(this.startedAt).toDate();
        else
            return null;
    };
    GGSet.prototype.getCompletedAt = function () {
        if (this.completedAt)
            return moment_timezone_1.default.unix(this.completedAt).toDate();
        else
            return null;
    };
    // calculated
    GGSet.prototype.getWinnerId = function () {
        return this.winnerId ? this.winnerId : null;
    };
    GGSet.prototype.getLoserId = function () {
        switch (this.winnerId) {
            case this.player1.entrantId:
                return this.player2.entrantId ? this.player2.entrantId : null;
            case this.player2.entrantId:
                return this.player1.entrantId ? this.player1.entrantId : null;
            default:
                return null;
        }
    };
    GGSet.prototype.getIsComplete = function () {
        return this.completedAt ? true : false;
    };
    GGSet.prototype.getCompletedTime = function () {
        if (this.completedAt)
            return moment_timezone_1.default.unix(this.completedAt).toDate();
        else
            return null;
    };
    GGSet.prototype.getPlayer1Score = function () {
        if (this.score1)
            return this.score1;
        else
            return 0;
    };
    GGSet.prototype.getPlayer2Score = function () {
        if (this.score2)
            return this.score2;
        else
            return 0;
    };
    GGSet.prototype.getWinner = function () {
        if (this.winnerId && this.player2.entrantId && this.player1.entrantId)
            switch (this.winnerId) {
                case this.player1.entrantId:
                    return this.player1;
                case this.player2.entrantId:
                    return this.player2;
                default:
                    throw new Error("Winner ID " + this.winnerId + " does not match either player ID: [" + [this.player1.entrantId, this.player2.entrantId].join(',') + "]");
            }
        else
            throw new Error("Set (" + this.id + ") must be complete to get the Winning Player");
    };
    GGSet.prototype.getLoser = function () {
        if (this.winnerId && this.player1.entrantId && this.player2.entrantId)
            switch (this.winnerId) {
                case this.player1.entrantId:
                    return this.player2;
                case this.player2.entrantId:
                    return this.player1;
                default:
                    throw new Error("Loser ID does not match either player ID: [" + [this.player1.entrantId, this.player2.entrantId].join(',') + "]");
            }
        else
            throw new Error("Set (" + this.id + ") must be complete to get the Losing Player");
    };
    GGSet.prototype.getBestOfCount = function () {
        return this.totalGames || 0;
    };
    GGSet.prototype.getWinnerScore = function () {
        if (!this.completedAt)
            throw new Error('Cannot get winner score of incomplete set');
        else if (this.score1 == null || this.score2 == null) {
            if (this.score1 == null)
                return this.score2;
            else
                return this.score2;
        }
        else
            return this.score1 > this.score2 ? this.score1 : this.score2;
    };
    GGSet.prototype.getLoserScore = function () {
        if (!this.completedAt)
            throw new Error('Cannot get loser score of incomplete set');
        else if (this.score1 == null || this.score2 == null)
            return 0;
        else
            return this.score1 < this.score2 ? this.score1 : this.score2;
    };
    // deprecated
    /*
    getBracketId() : number | string {
        if(this.data)
            return this.data.bracketId || this.nullValueString('Bracket ID');
        else throw new Error('No data to get Set property Bracket ID');
    }

    // deprecated
    getMidsizeRoundText() : string{
        if(this.data)
            return this.data.midRoundText || this.nullValueString('Midsize Round Text');
        else throw new Error('No data to get Set property Midsize Round Text');
    }
    */
    // deprecated for the time being
    /*
    getWinnersTournamentPlacement() : number | string{
        let winner = this.getWinner()
        if(winner && this.isComplete)
            return winner.getFinalPlacement() || this.nullValueString('Winner Tournament Placement');
        else throw new Error('Set must be complete to get Winner\'s tournament placement');
    }

    getLosersTournamentPlacement() : number | string{
        let loser = this.getLoser()
        if(loser && this.isComplete)
            return loser.getFinalPlacement() || this.nullValueString('Loser Tournament Placement');
        else throw new Error('Set must be complete to get Loser\'s tournament placement');
    }
    */
    // Aggregation
    GGSet.prototype.getGames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Gettings Games for set (%s)', this.id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.games, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Game_1.Game.parseFull(data)];
                }
            });
        });
    };
    GGSet.prototype.getAttendees = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, entrants, participants, attendees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Attendees who participated in Set [%s]', this.id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.attendees, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        entrants = data.set.slots.map(function (slot) { return slot.entrant; }).filter(function (entrant) { return entrant != null; });
                        participants = lodash_1.default.flatten(entrants.map(function (entrant) { return entrant.participants; })).filter(function (participant) { return participant != null; });
                        attendees = participants.map(function (participant) { return Attendee_1.Attendee.parse(participant); });
                        return [2 /*return*/, attendees];
                }
            });
        });
    };
    GGSet.prototype.getEntrants = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, entrantData, entrants;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Entrants who participated in Set [%s]', this.id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.entrants, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        entrantData = data.set.slots.map(function (slot) { return slot.entrant; }).filter(function (entrant) { return entrant != null; });
                        entrants = entrantData.map(function (entrant) { return Entrant_1.Entrant.parse(entrant); });
                        return [2 /*return*/, entrants];
                }
            });
        });
    };
    // Statics
    GGSet.filterOutDQs = function (sets) {
        Logger_1.default.debug('GGSet.filterOutDQs called');
        var displayScores = sets.map(function (set) { return set.displayScore; });
        return displayScores.includes('DQ') ? sets.filter(function (set) { return set.displayScore != 'DQ'; }) : sets;
    };
    GGSet.filterOutByes = function (sets) {
        Logger_1.default.debug('GGSet.filterOutByes called');
        var displayScores = sets.map(function (set) { return set.displayScore; });
        return displayScores.includes('BYE') ? sets.filter(function (set) { return set.displayScore != 'BYE'; }) : sets;
    };
    GGSet.filterOutResets = function (sets) {
        Logger_1.default.debug('GGSet.filterOutResets called');
        var fullRoundTexts = sets.map(function (set) { return set.fullRoundText; });
        return fullRoundTexts.includes('Grand Final Reset') ? sets.filter(function (set) { return set.fullRoundText !== 'Grand Final Reset'; }) : sets;
    };
    GGSet.filterForCompleteSets = function (sets) {
        Logger_1.default.debug('GGSet.filterForCompleteSets called');
        return sets.filter(function (set) { return set.getIsComplete(); });
    };
    GGSet.filterForIncompleteSets = function (sets) {
        Logger_1.default.debug('GGSet.filterForCompleteSets called');
        return sets.filter(function (set) { return !set.getIsComplete(); });
    };
    GGSet.filterForXMinutesBack = function (sets, minutesBack) {
        Logger_1.default.debug('GGSet.filterForCompleteSets called');
        var now = moment_timezone_1.default();
        var filtered = sets.filter(function (set) {
            var then = moment_timezone_1.default(set.getCompletedAt());
            var diff = moment_timezone_1.default.duration(now.diff(then));
            var diffMinutes = diff.minutes();
            if (diff.hours() > 0 || diff.days() > 0 || diff.months() > 0 || diff.years() > 0)
                return false;
            else
                return diffMinutes <= minutesBack && diffMinutes >= 0 && set.getIsComplete();
        });
        return filtered;
    };
    return GGSet;
}(events_1.EventEmitter));
exports.GGSet = GGSet;
var IGGSet;
(function (IGGSet) {
    var PlayerLite = /** @class */ (function () {
        function PlayerLite(tag, entrantId, attendeeIds) {
            this.tag = tag;
            this.entrantId = entrantId;
            this.attendeeIds = attendeeIds;
        }
        PlayerLite.parse = function (tag, slot) {
            var entrantId = slot.entrant ? slot.entrant.id : null;
            var attendeeIds = slot.entrant ? slot.entrant.participants.map(function (p) { return p.id; }) : [];
            return new PlayerLite(tag, entrantId, attendeeIds);
        };
        return PlayerLite;
    }());
    IGGSet.PlayerLite = PlayerLite;
    function getDefaultSetOptions() {
        return {
            page: 1,
            perPage: null,
            sortBy: null,
            filters: null
        };
    }
    IGGSet.getDefaultSetOptions = getDefaultSetOptions;
})(IGGSet = exports.IGGSet || (exports.IGGSet = {}));
