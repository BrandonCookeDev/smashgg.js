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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ITournament;
(function (ITournament) {
    function getDefaultData() {
        return {
            tournament: {
                id: 0
            }
        };
    }
    ITournament.getDefaultData = getDefaultData;
    function getDefaultExpands() {
        return {
            event: true,
            phase: true,
            groups: true,
            stations: true
        };
    }
    ITournament.getDefaultExpands = getDefaultExpands;
    function getDefaultOptions() {
        return {
            expands: {
                event: true,
                phase: true,
                groups: true,
                stations: true
            },
            isCached: true,
            rawEncoding: 'json'
        };
    }
    ITournament.getDefaultOptions = getDefaultOptions;
    function parseOptions(options) {
        return {
            expands: {
                event: (options.expands != undefined && options.expands.event == false) ? false : true,
                phase: (options.expands != undefined && options.expands.phase == false) ? false : true,
                groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
                stations: (options.expands != undefined && options.expands.stations == false) ? false : true
            },
            isCached: options.isCached != undefined ? options.isCached === true : true,
            rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
        };
    }
    ITournament.parseOptions = parseOptions;
})(ITournament = exports.ITournament || (exports.ITournament = {}));
var lodash_1 = __importDefault(require("lodash"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var p_map_1 = __importDefault(require("p-map"));
var request_promise_1 = __importDefault(require("request-promise"));
var util_1 = require("util");
var events_1 = require("events");
var Common = __importStar(require("./util/Common"));
var Cache_1 = __importDefault(require("./util/Cache"));
var Logger_1 = __importDefault(require("./util/Logger"));
var internal_1 = require("./internal");
var Encoder_1 = __importDefault(require("./util/Encoder"));
var TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
var LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
var DEFAULT_ENCODING = 'json';
var DEFAULT_CONCURRENCY = 4;
var parseOptions = Common.parseOptions;
function parseTournamentOptions(options) {
    return {
        expands: {
            event: (options.expands != undefined && options.expands.event == false) ? false : true,
            phase: (options.expands != undefined && options.expands.phase == false) ? false : true,
            groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
            stations: (options.expands != undefined && options.expands.stations == false) ? false : true
        },
        isCached: options.isCached != undefined ? options.isCached === true : true,
        rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
    };
}
var Tournament = /** @class */ (function (_super) {
    __extends(Tournament, _super);
    function Tournament(tournamentId, options) {
        if (options === void 0) { options = ITournament.getDefaultOptions(); }
        var _this = _super.call(this) || this;
        _this.url = '';
        _this.expands = {
            event: true,
            groups: true,
            phase: true,
            stations: true
        };
        _this.expandsString = '';
        _this.isCached = true;
        _this.rawEncoding = DEFAULT_ENCODING;
        _this.sets = [];
        _this.events = [];
        _this.phases = [];
        _this.players = [];
        _this.phaseGroups = [];
        if (!tournamentId)
            throw new Error('Tournament Name cannot be null');
        //else if(tournamentId instanceof Number)
        //	throw new Error('Due to Smashgg limitations, currently Tournaments may only be retrieved by tournament name (slug)');
        // parse options
        options = ITournament.parseOptions(options);
        _this.data = ITournament.getDefaultData();
        _this.name = tournamentId; // instanceof String ? tournamentId : +tournamentId;
        _this.isCached = options.isCached;
        _this.rawEncoding = options.rawEncoding;
        // create expands 
        _this.expandsString = '';
        _this.expands = {
            event: (options.expands != undefined && options.expands.event == false) ? false : true,
            phase: (options.expands != undefined && options.expands.phase == false) ? false : true,
            groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
            stations: (options.expands != undefined && options.expands.stations == false) ? false : true
        };
        for (var property in _this.expands) {
            if (_this.expands.hasOwnProperty(property))
                _this.expandsString += util_1.format('expand[]=%s&', property);
        }
        // format api url
        _this.url = util_1.format(TOURNAMENT_URL, _this.name, _this.expandsString);
        var ThisTournament = _this;
        _this.load()
            .then(function () {
            var cacheKey = util_1.format('tournament::%s::%s', ThisTournament.name, ThisTournament.expandsString);
            Cache_1.default.set(cacheKey, ThisTournament);
        })
            .then(function () {
            ThisTournament.emitTournamentReady();
        })
            .catch(function (err) {
            console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')');
            Logger_1.default.error('Tournament error: %s', err.message);
            ThisTournament.emitTournamentError(err);
        });
        return _this;
    }
    Tournament.prototype.loadData = function (data) {
        var encoded = this.rawEncoding === 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
        this.data = encoded;
        return encoded;
    };
    Tournament.prototype.getData = function () {
        var decoded = this.rawEncoding === 'json' ? this.data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8'));
        return decoded;
    };
    // Convenience methods
    Tournament.getTournament = function (tournamentName, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                var T_1 = new Tournament(tournamentName, options);
                T_1.on('ready', function () {
                    resolve(T_1);
                });
                T_1.on('error', function (e) {
                    Logger_1.default.error('getTournament error: %s', e);
                    reject(e);
                });
            }
            catch (e) {
                Logger_1.default.error('getTournament error: %s', e);
                reject(e);
            }
        });
    };
    /**
     * @deprecated
     * This method is not in use yet because Smashgg doesn't support pulling
     * tournaments by id yet
     *
     * @param {*} tournamentId
     * @param {*} expands
     * @param {*} isCached
     */
    Tournament.getTournamentById = function (tournamentId, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                return Tournament.getTournamentById(tournamentId, options)
                    .then(resolve)
                    .catch(reject);
            }
            catch (e) {
                Logger_1.default.error('getTournamentById error: tournamentId provided is not valid number');
                reject(new Error('tournamentId provided is not valid number'));
            }
        });
    };
    Tournament.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, cacheKey, cached, response, encoded, e_1, s;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.load called');
                        Logger_1.default.verbose('Creating Tournament from url: %s', this.url);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 9, , 10]);
                        if (!!this.isCached) return [3 /*break*/, 3];
                        _a = this;
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, request_promise_1.default(this.url)];
                    case 2: return [2 /*return*/, _a.data = _c.apply(_b, [_d.sent()])];
                    case 3:
                        cacheKey = util_1.format('tournament::%s::%s::%s::data', this.name, this.rawEncoding, this.expandsString);
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 4:
                        cached = _d.sent();
                        if (!!cached) return [3 /*break*/, 7];
                        return [4 /*yield*/, request_promise_1.default(this.url)];
                    case 5:
                        response = _d.sent();
                        encoded = this.loadData(JSON.parse(response));
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, encoded)];
                    case 6:
                        _d.sent();
                        return [2 /*return*/, encoded];
                    case 7:
                        this.data = cached;
                        return [2 /*return*/, this.data];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_1 = _d.sent();
                        Logger_1.default.error('Tournament.load error: %s', e_1.message);
                        if (e_1.name === 'StatusCodeError' && e_1.message.indexOf('404') > -1) {
                            s = util_1.format('No Tournament with id/name [%s] ( %s )', this.name, this.url);
                            Logger_1.default.error(s);
                        }
                        throw e_1;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /** PROMISES **/
    Tournament.prototype.getAllPlayers = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, groups, fn, allPlayers, flattened, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getAllPlayers called');
                        // parse options
                        options = parseOptions(options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        Logger_1.default.info('Gettings players for ' + this.name);
                        cacheKey = util_1.format('tournament::%s::players', this.name);
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
                        groups = this.getData().entities.groups;
                        fn = function (group) { return __awaiter(_this, void 0, void 0, function () {
                            var PG;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, internal_1.PhaseGroup.getPhaseGroup(group.id)];
                                    case 1:
                                        PG = _a.sent();
                                        return [4 /*yield*/, PG.getPlayers()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(groups, fn, { concurrency: options.concurrency })];
                    case 4:
                        allPlayers = _a.sent();
                        flattened = lodash_1.default.flatten(allPlayers);
                        flattened = lodash_1.default.uniqBy(flattened, 'id');
                        this.players = flattened;
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, flattened)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, flattened];
                    case 6:
                        err_1 = _a.sent();
                        Logger_1.default.error('Tournament.getAllPlayers: ' + err_1);
                        throw err_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getAllSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, groups, fn, allSets, flattened, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getAllSets called');
                        // parse options
                        options = parseOptions(options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        Logger_1.default.info('Gettings sets for ' + this.getName());
                        cacheKey = util_1.format('tournament::%s::sets', this.name);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached) {
                            this.sets = cached;
                            return [2 /*return*/, cached];
                        }
                        _a.label = 3;
                    case 3:
                        groups = this.getData().entities.groups;
                        fn = function (group) { return __awaiter(_this, void 0, void 0, function () {
                            var PG;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, internal_1.PhaseGroup.getPhaseGroup(group.id)];
                                    case 1:
                                        PG = _a.sent();
                                        return [4 /*yield*/, PG.getSets()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(groups, fn, { concurrency: options.concurrency })];
                    case 4:
                        allSets = _a.sent();
                        flattened = lodash_1.default.flatten(allSets);
                        flattened = lodash_1.default.uniqBy(flattened, 'id');
                        this.sets = flattened;
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, flattened)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, flattened];
                    case 6:
                        err_2 = _a.sent();
                        Logger_1.default.error('Tournament.getAllSets: ' + err_2);
                        throw err_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getAllEvents = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, events, fn, allEvents, err_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getAllEvents called');
                        // parse options
                        options = parseOptions(options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        Logger_1.default.info('Getting Events for ' + this.getName());
                        cacheKey = util_1.format('tournament::%s::events', this.name);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached) {
                            this.events = cached;
                            return [2 /*return*/, cached];
                        }
                        _a.label = 3;
                    case 3:
                        events = this.getData().entities.event;
                        fn = function (event) { return __awaiter(_this, void 0, void 0, function () {
                            var eventId;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        eventId = event.id;
                                        return [4 /*yield*/, internal_1.Event.getEventById(eventId)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(events, fn, { concurrency: options.concurrency })];
                    case 4:
                        allEvents = _a.sent();
                        this.events = allEvents;
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, this.events)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, allEvents];
                    case 6:
                        err_3 = _a.sent();
                        Logger_1.default.error('Tournament.getAllEvents: ' + err_3);
                        throw err_3;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getIncompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, complete, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getIncompleteSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        //parse options
                        options = parseOptions(options);
                        return [4 /*yield*/, this.getAllSets(options)];
                    case 2:
                        sets = _a.sent();
                        complete = internal_1.GGSet.filterForIncompleteSets(sets);
                        return [2 /*return*/, complete];
                    case 3:
                        e_2 = _a.sent();
                        Logger_1.default.error('Tournament.getIncompleteSets error: %s', e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getCompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, incomplete, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getIncompleteSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        //parse options
                        options = parseOptions(options);
                        return [4 /*yield*/, this.getAllSets(options)];
                    case 2:
                        sets = _a.sent();
                        incomplete = internal_1.GGSet.filterForCompleteSets(sets);
                        return [2 /*return*/, incomplete];
                    case 3:
                        e_3 = _a.sent();
                        Logger_1.default.error('Tournament.getIncompleteSets error: %s', e_3);
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getSetsXMinutesBack = function (minutesBack, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getSetsXMinutesBack called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getAllSets()];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForXMinutesBack(sets, minutesBack);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_4 = _a.sent();
                        Logger_1.default.error('Tournament.getSetsXMinutesBack error: %s', e_4);
                        throw e_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** SIMPLE GETTERS **/
    Tournament.prototype.getFromDataEntities = function (prop) {
        var data = this.getData();
        if (data && data.entities && data.entities.tournament) {
            if (!data.entities.tournament[prop])
                Logger_1.default.error(this.nullValueString(prop));
            return data.entities.tournament[prop];
        }
        else {
            Logger_1.default.error('No data to get Tournament property Id');
            return null;
        }
    };
    Tournament.prototype.getId = function () {
        return this.getFromDataEntities('id');
    };
    Tournament.prototype.getName = function () {
        return this.getFromDataEntities('name');
    };
    Tournament.prototype.getSlug = function () {
        return this.getFromDataEntities('slug');
    };
    Tournament.prototype.getTimezone = function () {
        return this.getFromDataEntities('timezone');
    };
    Tournament.prototype.getStartTime = function () {
        var startAt = this.getFromDataEntities('startAt');
        var tz = this.getFromDataEntities('timezone');
        if (this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
            var time = moment_timezone_1.default.unix(startAt).tz(tz);
            return time.toDate();
        }
        else {
            Logger_1.default.error('Tournament.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    };
    Tournament.prototype.getStartTimeString = function () {
        var startAt = this.getFromDataEntities('startAt');
        var tz = this.getFromDataEntities('timezone');
        if (this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
            var time = moment_timezone_1.default.unix(startAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            var zone = moment_timezone_1.default.tz(tz).zoneName();
            return time + " " + zone;
        }
        else {
            Logger_1.default.error('Tournament.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    };
    Tournament.prototype.getEndTime = function () {
        var endAt = this.getFromDataEntities('endAt');
        var tz = this.getFromDataEntities('timezone');
        if (this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
            var time = moment_timezone_1.default.unix(endAt).tz(tz);
            return time.toDate();
        }
        else {
            Logger_1.default.error('Tournament.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    };
    Tournament.prototype.getEndTimeString = function () {
        var endAt = this.getFromDataEntities('endAt');
        var tz = this.getFromDataEntities('timezone');
        if (this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
            var time = moment_timezone_1.default.unix(endAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            var zone = moment_timezone_1.default.tz(tz).zoneName();
            return time + " " + zone;
        }
        else {
            Logger_1.default.error('Tournament.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    };
    Tournament.prototype.getWhenRegistrationCloses = function () {
        var closesAt = this.getFromDataEntities('eventRegistrationClosesAt');
        var tz = this.getFromDataEntities('timezone');
        if (this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
            var time = moment_timezone_1.default.unix(closesAt).tz(tz);
            return time.toDate();
        }
        else {
            Logger_1.default.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present');
            return null;
        }
    };
    Tournament.prototype.getWhenRegistrationClosesString = function () {
        var closesAt = this.getFromDataEntities('eventRegistrationClosesAt');
        var tz = this.getFromDataEntities('timezone');
        if (this.getData().entities.tournament.startAt && this.getData().entities.tournament.timezone) {
            var time = moment_timezone_1.default.unix(closesAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            var zone = moment_timezone_1.default.tz(tz).zoneName();
            return time + " " + zone;
        }
        else {
            Logger_1.default.error('Tournament.getWhenRegistrationCloses: eventRegistrationClosesAt and timezone properties must both be present');
            return null;
        }
    };
    Tournament.prototype.getCity = function () {
        return this.getFromDataEntities('city');
    };
    Tournament.prototype.getState = function () {
        return this.getFromDataEntities('addrState');
    };
    Tournament.prototype.getZipCode = function () {
        return this.getFromDataEntities('postalCode');
    };
    Tournament.prototype.getContactEmail = function () {
        return this.getFromDataEntities('contactEmail');
    };
    Tournament.prototype.getContactTwitter = function () {
        return this.getFromDataEntities('contactTwitter');
    };
    Tournament.prototype.getOwnerId = function () {
        return this.getFromDataEntities('ownerId');
    };
    Tournament.prototype.getVenueFee = function () {
        return this.getFromDataEntities('venueFee');
    };
    Tournament.prototype.getProcessingFee = function () {
        return this.getFromDataEntities('processingFee');
    };
    /** NULL VALUES **/
    Tournament.prototype.nullValueString = function (prop) {
        return prop + ' not available for tournament ' + this.getData().entities.tournament.name;
    };
    /** EVENTS **/
    Tournament.prototype.emitTournamentReady = function () {
        this.emit('ready');
    };
    Tournament.prototype.emitTournamentError = function (err) {
        this.emit('error', err);
    };
    return Tournament;
}(events_1.EventEmitter));
exports.Tournament = Tournament;
Tournament.prototype.toString = function () {
    return 'Tournament: ' +
        '\nName: ' + this.getName() +
        '\nSlug: ' + this.getSlug() +
        '\nDate: ' + this.getStartTime() +
        '\nState: ' + this.getState() +
        '\nCity: ' + this.getCity();
};
