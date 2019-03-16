"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var util_1 = require("util");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var events_1 = require("events");
var request_promise_1 = __importDefault(require("request-promise"));
var Cache_1 = __importDefault(require("./util/Cache"));
var Common_1 = require("./util/Common");
var internal_1 = require("./internal");
var Logger_1 = __importDefault(require("./util/Logger"));
var parseOptions = Common_1.ICommon.parseOptions;
var API_URL = 'https://api.smash.gg/set/%s';
var GGSet = /** @class */ (function (_super) {
    __extends(GGSet, _super);
    function GGSet(id, eventId, round, player1, player2, isComplete, score1, score2, winnerId, loserId, data) {
        if (isComplete === void 0) { isComplete = false; }
        if (score1 === void 0) { score1 = 0; }
        if (score2 === void 0) { score2 = 0; }
        if (winnerId === void 0) { winnerId = 0; }
        if (loserId === void 0) { loserId = 0; }
        var _this = _super.call(this) || this;
        if (!id)
            throw new Error('Id for Set cannot be null');
        if (!eventId)
            throw new Error('Event Id for Set cannot be null');
        if (!round)
            throw new Error('Round for Set cannot be null');
        //if(!player1 && !(player1 instanceof Player))
        //	throw new Error('Winner Player for Set cannot be null, and must be an instance of Player');
        //if(!player2 && !(player2 instanceof Player))
        //	throw new Error('Loser Player for Set cannot be null, and must be an instance of Player');
        _this.id = id;
        _this.eventId = eventId;
        _this.round = round;
        _this.player1 = player1;
        _this.player2 = player2;
        _this.score1 = score1;
        _this.score2 = score2;
        _this.isComplete = isComplete;
        _this.winnerId = winnerId;
        _this.loserId = loserId;
        _this.data = data;
        return _this;
    }
    GGSet.prototype.loadData = function (data) {
        this.data = data;
    };
    GGSet.getSet = function (id, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, req, resp, _a, _b, data, set, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        Logger_1.default.debug('Set getSet called');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('set::%s', id);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _c.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _c.label = 3;
                    case 3:
                        req = {
                            uri: util_1.format(API_URL, id),
                            headers: {
                                'X-SOURCE': 'smashgg.js'
                            },
                            method: 'GET'
                        };
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, request_promise_1.default(req)];
                    case 4:
                        resp = _b.apply(_a, [_c.sent()]);
                        data = resp.entities.sets;
                        return [4 /*yield*/, GGSet.resolve(data, false)];
                    case 5:
                        set = _c.sent();
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, set)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/, set];
                    case 7:
                        e_1 = _c.sent();
                        Logger_1.default.error('Set getSet error: %s', e_1);
                        throw e_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    GGSet.resolveArray = function (data, filterByes) {
        if (filterByes === void 0) { filterByes = true; }
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Set resolveArray called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(data.map(function (entity) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, GGSet.resolve(entity, filterByes)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_2 = _a.sent();
                        Logger_1.default.error('Set resolveArray error: %s', e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GGSet.resolve = function (data, filterByes) {
        if (filterByes === void 0) { filterByes = true; }
        return __awaiter(this, void 0, void 0, function () {
            var isBye, set, group, groupParticipants, Player1, Player2, isComplete, S, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Set resolve called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        isBye = false;
                        set = data;
                        return [4 /*yield*/, internal_1.PhaseGroup.getPhaseGroup(set.phaseGroupId)];
                    case 2:
                        group = _a.sent();
                        return [4 /*yield*/, group.getPlayers()];
                    case 3:
                        groupParticipants = _a.sent();
                        if (!set.entrant1Id || !set.entrant2Id)
                            isBye = true; // HANDLES BYES
                        Player1 = lodash_1.default.find(groupParticipants, { 'participantId': set.entrant1Id });
                        Player2 = lodash_1.default.find(groupParticipants, { 'participantId': set.entrant2Id });
                        isComplete = false;
                        if (set.winnerId && set.loserId)
                            isComplete = true;
                        S = void 0;
                        if (isBye && filterByes)
                            return [2 /*return*/, null];
                        else if (isBye && !filterByes)
                            S = new GGSet(set.id, set.eventId, 'BYE', Player1, Player2, isComplete, undefined, undefined, undefined, undefined, data);
                        else if (isComplete)
                            S = new GGSet(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, set.entrant1Score, set.entrant2Score, set.winnerId, set.loserId, data);
                        else
                            S = new GGSet(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, undefined, undefined, undefined, undefined, data);
                        S.loadData(set);
                        return [2 /*return*/, S];
                    case 4:
                        e_3 = _a.sent();
                        Logger_1.default.error('Set resolve error: %s', e_3);
                        throw e_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GGSet.filterForCompleteSets = function (sets) {
        Logger_1.default.debug('GGSet.filterForCompleteSets called');
        try {
            return sets.filter(function (set) { return set.isComplete; });
        }
        catch (e) {
            Logger_1.default.error('GGSet.filterForCompleteSets error: %s', e);
            throw e;
        }
    };
    GGSet.filterForIncompleteSets = function (sets) {
        Logger_1.default.debug('GGSet.filterForCompleteSets called');
        try {
            return sets.filter(function (set) { return !set.isComplete; });
        }
        catch (e) {
            Logger_1.default.error('GGSet.filterForCompleteSets error: %s', e);
            throw e;
        }
    };
    GGSet.filterForXMinutesBack = function (sets, minutesBack) {
        Logger_1.default.debug('GGSet.filterForCompleteSets called');
        try {
            var now_1 = moment_timezone_1.default();
            var filtered = sets.filter(function (set) {
                var then = moment_timezone_1.default(set.getCompletedAt());
                var diff = moment_timezone_1.default.duration(now_1.diff(then));
                var diffMinutes = diff.minutes();
                if (diff.hours() > 0 || diff.days() > 0 || diff.months() > 0 || diff.years() > 0)
                    return false;
                else
                    return diffMinutes <= minutesBack && diffMinutes >= 0 && set.getIsComplete();
            });
            return filtered;
        }
        catch (e) {
            Logger_1.default.error('GGSet.filterForCompleteSets error: %s', e);
            throw e;
        }
    };
    /** Instance Based **/
    GGSet.prototype.getRound = function () {
        return this.round;
    };
    GGSet.prototype.getPlayer1 = function () {
        if (this.player1)
            return this.player1;
        else
            return null;
    };
    GGSet.prototype.getPlayer2 = function () {
        if (this.player2)
            return this.player2;
        else
            return null;
    };
    GGSet.prototype.getWinnerId = function () {
        if (this.winnerId)
            return this.winnerId;
        else
            return null;
    };
    GGSet.prototype.getLoserId = function () {
        if (this.loserId)
            return this.loserId;
        else
            return null;
    };
    GGSet.prototype.getIsComplete = function () {
        return this.isComplete;
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
        if (this.winnerId && this.loserId && this.player1 && this.player2)
            switch (this.winnerId) {
                case this.player1.getParticipantId():
                    return this.player1;
                case this.player2.getParticipantId():
                    return this.player2;
                default:
                    throw new Error("Winner ID " + this.winnerId + " does not match either player ID: [" + [this.player1.id, this.player2.id].join(',') + "]");
            }
        else
            throw new Error('Set must be complete to get the Winning Player');
    };
    GGSet.prototype.getLoser = function () {
        if (this.winnerId && this.loserId && this.player1 && this.player2)
            switch (this.loserId) {
                case this.player1.getParticipantId():
                    return this.player1;
                case this.player2.getParticipantId():
                    return this.player2;
                default:
                    throw new Error("Loser ID " + this.loserId + " does not match either player ID: [" + [this.player1.id, this.player2.id].join(',') + "]");
            }
        else
            throw new Error('Set must be complete to get the Losing Player');
    };
    GGSet.prototype.getGames = function () {
        if (this.data)
            return this.data.games || this.nullValueString('Games');
        else
            throw new Error('No data to get Set property Games');
    };
    GGSet.prototype.getBestOfCount = function () {
        if (this.data)
            return this.data.bestOf || this.nullValueString('Best-Of Count');
        else
            throw new Error('No data to get Set property Best-Of Count');
    };
    GGSet.prototype.getWinnerScore = function () {
        if (this.data && this.isComplete)
            return this.data.entrant1Score > this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
        else
            throw new Error('No data to get Set property Winner Score');
    };
    GGSet.prototype.getLoserScore = function () {
        if (this.data && this.isComplete)
            return this.data.entrant1Score < this.data.entrant2Score ? this.data.entrant1Score : this.data.entrant2Score;
        else
            throw new Error('No data to get Set property Loser Score');
    };
    GGSet.prototype.getBracketId = function () {
        if (this.data)
            return this.data.bracketId || this.nullValueString('Bracket ID');
        else
            throw new Error('No data to get Set property Bracket ID');
    };
    GGSet.prototype.getMidsizeRoundText = function () {
        if (this.data)
            return this.data.midRoundText || this.nullValueString('Midsize Round Text');
        else
            throw new Error('No data to get Set property Midsize Round Text');
    };
    GGSet.prototype.getPhaseGroupId = function () {
        if (this.data)
            return this.data.phaseGroupId || this.nullValueString('Phase Group Id');
        else
            throw new Error('No data to get Set property Phase Group Id');
    };
    GGSet.prototype.getWinnersTournamentPlacement = function () {
        var winner = this.getWinner();
        if (winner && this.isComplete)
            return winner.getFinalPlacement() || this.nullValueString('Winner Tournament Placement');
        else
            throw new Error('Set must be complete to get Winner\'s tournament placement');
    };
    GGSet.prototype.getLosersTournamentPlacement = function () {
        var loser = this.getLoser();
        if (loser && this.isComplete)
            return loser.getFinalPlacement() || this.nullValueString('Loser Tournament Placement');
        else
            throw new Error('Set must be complete to get Loser\'s tournament placement');
    };
    // Todo needs coverage
    GGSet.prototype.getStartedAt = function () {
        if (this.data && this.data.startedAt)
            return moment_timezone_1.default.unix(this.data.startedAt).toDate();
        else
            return null;
    };
    // Todo needs coverage
    GGSet.prototype.getCompletedAt = function () {
        if (this.data && this.data.completedAt)
            return moment_timezone_1.default.unix(this.data.completedAt).toDate();
        else
            return null;
    };
    /** NULL VALUES **/
    GGSet.prototype.nullValueString = function (prop) {
        return prop + ' not available for Set ' + this.id;
    };
    return GGSet;
}(events_1.EventEmitter));
exports.GGSet = GGSet;
GGSet.prototype.toString = function () {
    return 'Set: ' +
        '\nID: ' + this.id +
        '\nEvent ID: ' + this.eventId +
        '\nRound: ' + this.round +
        '\nPlayer1: ' + this.player1 +
        '\nPlayer2: ' + this.player2 +
        '\nIs Complete: ' + this.isComplete +
        '\nPlayer1 Score: ' + this.score1 +
        '\nPlayer2 Score: ' + this.score2 +
        '\nWinner ID: ' + this.winnerId +
        '\nLoser ID: ' + this.loserId;
};
