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
var p_map_1 = __importDefault(require("p-map"));
var util_1 = require("util");
var request_promise_1 = __importDefault(require("request-promise"));
var events_1 = require("events");
var Cache_1 = __importDefault(require("./util/Cache"));
var internal_1 = require("./internal");
var Encoder_1 = __importDefault(require("./util/Encoder"));
var Logger_1 = __importDefault(require("./util/Logger"));
var Common_1 = require("./util/Common");
var parseOptions = Common_1.ICommon.parseOptions;
/* Constants */
var PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';
var LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
var DEFAULT_ENCODING = 'json';
var PhaseGroup = /** @class */ (function (_super) {
    __extends(PhaseGroup, _super);
    function PhaseGroup(id, options) {
        if (options === void 0) { options = IPhaseGroup.getDefaultOptions(); }
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.url = '';
        _this.data = IPhaseGroup.getDefaultData();
        _this.isCached = true;
        _this.rawEncoding = 'JSON';
        _this.expandsString = '';
        _this.expands = IPhaseGroup.getDefaultExpands();
        _this.players = [];
        _this.sets = [];
        if (!id)
            throw new Error('ID cannot be null for Phase Group');
        // parse options
        options = IPhaseGroup.parseOptions(options);
        _this.rawEncoding = options.rawEncoding;
        _this.isCached = options.isCached;
        // set properties
        _this.id = id;
        // CREATE THE EXPANDS STRING
        _this.expandsString = '';
        if (options.expands) {
            _this.expands = Object.assign(_this.expands, options.expands);
        }
        for (var property in _this.expands) {
            if (_this.expands.hasOwnProperty(property))
                _this.expandsString += util_1.format('expand[]=%s&', property);
        }
        _this.url = util_1.format(PHASE_GROUP_URL, _this.id, _this.expandsString);
        var ThisPhaseGroup = _this;
        _this.load()
            .then(function () {
            var cacheKey = util_1.format('phasegroup::%s::%s', ThisPhaseGroup.id, ThisPhaseGroup.expandsString);
            Cache_1.default.set(cacheKey, ThisPhaseGroup);
        })
            .then(function () {
            ThisPhaseGroup.emitPhaseGroupReady();
        })
            .catch(function (err) {
            console.error('Error creating Tournament. For more info, implement PhaseGroup.on(\'error\')');
            Logger_1.default.error('Phase Group: %s', err.message);
            ThisPhaseGroup.emitPhaseGroupError(err);
        });
        return _this;
    }
    PhaseGroup.prototype.loadData = function (data) {
        var encoded = this.rawEncoding === 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
        this.data = encoded;
        return encoded;
    };
    PhaseGroup.prototype.getData = function () {
        var decoded = this.rawEncoding === 'json' ? this.data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8'));
        return decoded;
    };
    // Convenience Methods
    PhaseGroup.getPhaseGroup = function (id, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                var PG_1 = new PhaseGroup(id, options);
                PG_1.on('ready', function () {
                    resolve(PG_1);
                });
                PG_1.on('error', function (e) {
                    Logger_1.default.error('getPhaseGroup error: %s', e);
                    reject(e);
                });
            }
            catch (e) {
                Logger_1.default.error('getPhaseGroup error: %s', e);
                reject(e);
            }
        });
    };
    // Methods
    PhaseGroup.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, encoded, e_1, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('PhaseGroup.load called');
                        Logger_1.default.verbose('Creating Phase Group from url: %s', this.url);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        if (!!this.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, request_promise_1.default(this.url)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        cacheKey = util_1.format('phasegroup::%s::%s::%s::data', this.id, this.rawEncoding, this.expandsString);
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 4:
                        cached = _a.sent();
                        if (!!cached) return [3 /*break*/, 7];
                        return [4 /*yield*/, request_promise_1.default(this.url)];
                    case 5:
                        response = _a.sent();
                        encoded = this.loadData(JSON.parse(response));
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, encoded)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, encoded];
                    case 7:
                        this.data = cached;
                        return [2 /*return*/, this.data];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_1 = _a.sent();
                        Logger_1.default.error('PhaseGroup.load error: %s', e_1.message);
                        if (e_1.name === 'StatusCodeError' && e_1.message.indexOf('404') > -1) {
                            s = util_1.format('No Phase Group with id [%s] ( %s )', this.id, this.url);
                            Logger_1.default.error(s);
                        }
                        throw e_1;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /** PROMISES **/
    PhaseGroup.prototype.getPlayers = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, entrants, players, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('PhaseGroup.getPlayers called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        if (!this.getData().entities.entrants) return [3 /*break*/, 5];
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('phasegroup::%s::players', this.id);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached) {
                            this.players = cached;
                            return [2 /*return*/, cached];
                        }
                        _a.label = 3;
                    case 3:
                        entrants = this.getEntrants();
                        players = entrants.map(function (entrant) {
                            return internal_1.Player.resolve(entrant);
                        });
                        this.players = players;
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, this.players)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.players];
                    case 5: throw new Error('Must have \'entrants\' expands set to true');
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        Logger_1.default.error('PhaseGroup.getPlayers: ' + err_1);
                        throw err_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PhaseGroup.prototype.getSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, sets, entities, fn, filtered, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // parse options
                        options = parseOptions(options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        if (!!this.players) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getPlayers(options)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        cacheKey = util_1.format('phasegroup::%s::sets', this.id);
                        if (!options.isCached) return [3 /*break*/, 5];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 4:
                        cached = _a.sent();
                        if (cached) {
                            this.sets = cached;
                            return [2 /*return*/, cached];
                        }
                        _a.label = 5;
                    case 5:
                        if (!this.getData().entities.sets) return [3 /*break*/, 7];
                        sets = void 0;
                        entities = this.getData().entities.sets;
                        fn = function (entity) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, internal_1.GGSet.resolve(entity, true)];
                        }); }); };
                        return [4 /*yield*/, p_map_1.default(entities, fn, { concurrency: options.concurrency })];
                    case 6:
                        sets = _a.sent();
                        filtered = sets.filter(function (set) { return set != null; });
                        this.sets = filtered;
                        _a.label = 7;
                    case 7: return [4 /*yield*/, Cache_1.default.set(cacheKey, this.sets)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, this.sets];
                    case 9:
                        err_2 = _a.sent();
                        Logger_1.default.error('PhaseGroup.getSets: ' + err_2);
                        throw err_2;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    PhaseGroup.prototype.getCompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('PhaseGroup getCompleteSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        //parse options
                        options = parseOptions(options);
                        return [4 /*yield*/, this.getSets(options)];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForCompleteSets(sets);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_2 = _a.sent();
                        Logger_1.default.error('PhaseGroup getCompleteSets error: %s', e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PhaseGroup.prototype.getIncompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('PhaseGroup getIncompleteSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        //parse options
                        options = parseOptions(options);
                        return [4 /*yield*/, this.getSets(options)];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForIncompleteSets(sets);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_3 = _a.sent();
                        Logger_1.default.error('PhaseGroup getIncompleteSets error: %s', e_3);
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // TODO needs coverage
    PhaseGroup.prototype.getSetsXMinutesBack = function (minutesBack, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('PhaseGroup getSetsXMinutesBack called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // parse options			
                        options = parseOptions(options);
                        return [4 /*yield*/, this.getSets(options)];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForXMinutesBack(sets, minutesBack);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_4 = _a.sent();
                        Logger_1.default.error('PhaseGroup getSetsXMinutesBack error: %s', e_4);
                        throw e_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PhaseGroup.prototype.resolveSet = function (set) {
        return __awaiter(this, void 0, void 0, function () {
            var Player1, Player2, isComplete, S, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!set.entrant1Id || !set.entrant2Id)
                            return [2 /*return*/]; // HANDLES BYES
                        return [4 /*yield*/, this.findPlayerByParticipantId(set.entrant1Id)];
                    case 1:
                        Player1 = _a.sent();
                        return [4 /*yield*/, this.findPlayerByParticipantId(set.entrant2Id)];
                    case 2:
                        Player2 = _a.sent();
                        if (!Player1 || !Player2)
                            return [2 /*return*/]; // HANDLES Error of some sort
                        isComplete = false;
                        if (set.winnerId && set.loserId)
                            isComplete = true;
                        S = void 0;
                        if (isComplete)
                            S = new internal_1.GGSet(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, set.entrant1Score, set.entrant2Score, set.winnerId, set.loserId, set);
                        else
                            S = new internal_1.GGSet(set.id, set.eventId, set.fullRoundText, Player1, Player2, isComplete, undefined, undefined, undefined, undefined, set);
                        S.loadData(set);
                        return [2 /*return*/, S];
                    case 3:
                        e_5 = _a.sent();
                        console.error(e_5.message);
                        throw e_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** SIMPLE GETTERS **/
    PhaseGroup.prototype.getFromDataEntities = function (prop) {
        var data = this.getData();
        if (data && data.entities && data.entities.groups) {
            if (!data.entities.groups[prop])
                Logger_1.default.error(this.nullValueString(prop));
            return data.entities.groups[prop];
        }
        else {
            Logger_1.default.error('No data to get Tournament property Id');
            return null;
        }
    };
    PhaseGroup.prototype.getPhaseId = function () {
        return this.getFromDataEntities('phaseId');
    };
    PhaseGroup.prototype.getEntrants = function () {
        if (this.getData().entities.entrants)
            return this.getData().entities.entrants;
        else
            return [];
    };
    /** NULL VALUES **/
    PhaseGroup.prototype.nullValueString = function (prop) {
        return prop + ' not available for PhaseGroup ' + this.id;
    };
    /** EVENTS **/
    PhaseGroup.prototype.emitPhaseGroupReady = function () {
        this.emit('ready');
    };
    PhaseGroup.prototype.emitPhaseGroupError = function (err) {
        this.emit('error', err);
    };
    /** OTHER **/
    PhaseGroup.prototype.findPlayerByParticipantId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.players) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getPlayers()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        player = lodash_1.default.find(this.players, { participantId: id });
                        return [2 /*return*/, player];
                }
            });
        });
    };
    return PhaseGroup;
}(events_1.EventEmitter));
exports.PhaseGroup = PhaseGroup;
PhaseGroup.prototype.toString = function () {
    return 'Phase Group:' +
        '\nID: ' + this.id +
        '\nExpands: ' + JSON.stringify(this.expands) +
        '\nIsCached: ' + this.isCached;
};
var IPhaseGroup;
(function (IPhaseGroup) {
    function parseOptions(options) {
        return {
            expands: {
                sets: (options.expands != undefined && options.expands.sets == false) ? false : true,
                entrants: (options.expands != undefined && options.expands.entrants == false) ? false : true,
                standings: (options.expands != undefined && options.expands.standings == false) ? false : true,
                seeds: (options.expands != undefined && options.expands.seeds == false) ? false : true
            },
            isCached: options.isCached != undefined ? options.isCached === true : true,
            rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
        };
    }
    IPhaseGroup.parseOptions = parseOptions;
    function getDefaultOptions() {
        return {
            isCached: true,
            rawEncoding: 'json',
            expands: getDefaultExpands()
        };
    }
    IPhaseGroup.getDefaultOptions = getDefaultOptions;
    function getDefaultData() {
        return {
            entities: {
                id: 0
            }
        };
    }
    IPhaseGroup.getDefaultData = getDefaultData;
    function getDefaultExpands() {
        return {
            sets: true,
            entrants: true,
            standings: true,
            seeds: true
        };
    }
    IPhaseGroup.getDefaultExpands = getDefaultExpands;
})(IPhaseGroup = exports.IPhaseGroup || (exports.IPhaseGroup = {}));
