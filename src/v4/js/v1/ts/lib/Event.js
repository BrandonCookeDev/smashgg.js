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
var IEvent;
(function (IEvent) {
    function getDefaultData() {
        return {
            tournament: internal_1.ITournament.getDefaultData(),
            event: getDefaultEventData()
        };
    }
    IEvent.getDefaultData = getDefaultData;
    function getDefaultEventData() {
        return {
            entities: {
                event: {
                    id: 0,
                    slug: '',
                    tournamentId: 0
                }
            }
        };
    }
    IEvent.getDefaultEventData = getDefaultEventData;
    function getTournamentSlug(slug) {
        return slug.substring(slug.indexOf('/') + 1, slug.indexOf('/', slug.indexOf('/') + 1));
    }
    IEvent.getTournamentSlug = getTournamentSlug;
    function getDefaultOptions() {
        return {
            expands: {
                phase: true,
                groups: true
            },
            isCached: true,
            rawEncoding: 'json'
        };
    }
    IEvent.getDefaultOptions = getDefaultOptions;
    function parseOptions(options) {
        return {
            expands: {
                phase: (options.expands != undefined && options.expands.phase == false) ? false : true,
                groups: (options.expands != undefined && options.expands.groups == false) ? false : true
            },
            isCached: options.isCached != undefined ? options.isCached === true : true,
            rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
        };
    }
    IEvent.parseOptions = parseOptions;
})(IEvent = exports.IEvent || (exports.IEvent = {}));
var lodash_1 = __importDefault(require("lodash"));
var moment_1 = __importDefault(require("moment"));
var p_map_1 = __importDefault(require("p-map"));
var request_promise_1 = __importDefault(require("request-promise"));
var events_1 = require("events");
var util_1 = require("util");
var Common = __importStar(require("./util/Common"));
var internal_1 = require("./internal");
var internal_2 = require("./internal");
var Logger_1 = __importDefault(require("./util/Logger"));
var Cache_1 = __importDefault(require("./util/Cache"));
var Encoder_1 = __importDefault(require("./util/Encoder"));
var EVENT_URL = 'https://api.smash.gg/event/%s?%s';
var EVENT_SLUG_URL = 'https://api.smash.gg/%s/event/%s?%s';
var TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s';
var EVENT_TOURNAMENT_CACHE_KEY = 'event::%s::%s';
var EVENT_ID_CACHE_KEY = 'event::%s::%s';
var LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
var DEFAULT_ENCODING = 'json';
var DEFAULT_CONCURRENCY = 4;
var parseOptions = Common.parseOptions;
var Event = /** @class */ (function (_super) {
    __extends(Event, _super);
    function Event(eventId, tournamentId, options) {
        if (options === void 0) { options = IEvent.getDefaultOptions(); }
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.url = '';
        _this.data = IEvent.getDefaultData();
        _this.expands = {
            phase: true,
            groups: true
        };
        _this.expandsString = '';
        _this.tournamentSlug = '';
        _this.isCached = true;
        _this.rawEncoding = DEFAULT_ENCODING;
        _this.phases = [];
        _this.groups = [];
        if (!eventId)
            throw new Error('Event Constructor: Event Name/ID cannot be null for Event');
        // set properties
        options = IEvent.parseOptions(options);
        _this.tournamentId = tournamentId;
        _this.isCached = options.isCached;
        _this.eventId = typeof (eventId) === 'string' ? eventId : +eventId;
        _this.rawEncoding = options.rawEncoding;
        // create expands
        _this.expandsString = '';
        if (options.expands) {
            _this.expands = Object.assign(_this.expands, options.expands);
        }
        for (var property in _this.expands) {
            if (_this.expands.hasOwnProperty(property))
                _this.expandsString += util_1.format('expand[]=%s&', property);
        }
        var ThisEvent = _this;
        _this.load(options, internal_1.ITournament.getDefaultOptions())
            .then(function (e) {
            var tournamentName = IEvent.getTournamentSlug(ThisEvent.getSlug());
            var cacheKey = util_1.format('event::%s::%s::%s', tournamentName, ThisEvent.eventId, ThisEvent.expandsString);
            Cache_1.default.set(cacheKey, ThisEvent);
        })
            .then(function () { return _this.emitEventReady(); })
            .catch(function (e) { return _this.emitEventError(e); });
        return _this;
    }
    Event.prototype.loadData = function (data) {
        var encoded = this.rawEncoding === 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
        this.data = encoded;
        return encoded;
    };
    Event.prototype.getData = function () {
        var decoded = this.rawEncoding === 'json' ? this.data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8'));
        return decoded;
    };
    // Convenience methods	
    Event.getEvent = function (eventName, tournamentName, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                var E_1 = new Event(eventName, tournamentName, options);
                E_1.on('ready', function () {
                    resolve(E_1);
                });
                E_1.on('error', function (e) {
                    Logger_1.default.error('getEvent error: %s', e);
                    reject(e);
                });
            }
            catch (e) {
                Logger_1.default.error('getEvent error: %s', e);
                reject(e);
            }
        });
    };
    Event.getEventById = function (id, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                var E_2 = new Event(id, undefined, options);
                E_2.on('ready', function () {
                    resolve(E_2);
                });
                E_2.on('error', function (e) {
                    Logger_1.default.error('getEventById error: %s', e);
                    reject(e);
                });
            }
            catch (e) {
                Logger_1.default.error('getEventById error: %s', e);
                reject(e);
            }
        });
    };
    // Methods
    Event.prototype.load = function (options, tournamentOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var data, cacheKey, cached, data, encoded, eventData, tournamentData, tournamentId, tournament, e_1, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.load called');
                        Logger_1.default.verbose('Creating Event from url: %s', this.url);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 15, , 16]);
                        if (!!this.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, request_promise_1.default(this.url)];
                    case 2:
                        data = _a.sent();
                        this.loadData(data);
                        return [2 /*return*/, data];
                    case 3:
                        cacheKey = typeof this.eventId === 'number' ?
                            util_1.format('event::%s::%s::%s::data', this.eventId, this.rawEncoding, this.expandsString) :
                            util_1.format('event::%s::%s::%s::%s::data', this.tournamentId, this.eventId, this.rawEncoding, this.expandsString);
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 4:
                        cached = _a.sent();
                        if (!!cached) return [3 /*break*/, 13];
                        data = void 0;
                        encoded = void 0;
                        eventData = void 0;
                        tournamentData = void 0;
                        if (!(typeof this.eventId == 'number')) return [3 /*break*/, 7];
                        return [4 /*yield*/, internal_2.getEventDataById(this.eventId, options)];
                    case 5:
                        eventData = _a.sent();
                        tournamentId = IEvent.getTournamentSlug(eventData.entities.event.slug);
                        return [4 /*yield*/, internal_1.Tournament.getTournament(tournamentId, internal_1.ITournament.getDefaultOptions())];
                    case 6:
                        tournament = _a.sent();
                        tournamentData = tournament.getData();
                        return [3 /*break*/, 11];
                    case 7:
                        if (!(typeof this.eventId == 'string' && this.tournamentId)) return [3 /*break*/, 10];
                        return [4 /*yield*/, internal_2.getEventData(this.eventId, this.tournamentId, options)];
                    case 8:
                        eventData = _a.sent();
                        return [4 /*yield*/, internal_2.getTournamentData(this.tournamentId, tournamentOptions)];
                    case 9:
                        tournamentData = _a.sent();
                        return [3 /*break*/, 11];
                    case 10: throw new Error('Bad event or tournament id types in Event');
                    case 11:
                        data = {
                            tournament: tournamentData,
                            event: eventData
                        };
                        encoded = this.loadData(data);
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, encoded)];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, encoded];
                    case 13:
                        this.data = cached;
                        return [2 /*return*/, this.data];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        e_1 = _a.sent();
                        Logger_1.default.error('Event.load error: %s', e_1.message);
                        if (e_1.name === 'StatusCodeError' && e_1.message.indexOf('404') > -1) {
                            s = this.tournamentId ?
                                util_1.format('No Event [%s] for tournament [%s] (%s)', this.eventId, this.tournamentId, this.url) :
                                util_1.format('No Event with id [%s] ( %s )', this.eventId, this.url);
                            Logger_1.default.error(s);
                        }
                        throw e_1;
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    /** BULK PULL PROMISES **/
    Event.prototype.getEventPhases = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, phases, fn, allPhases, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getEventPhases called');
                        options = parseOptions(options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        Logger_1.default.info('Getting Phases for Event ' + this.tournamentId);
                        cacheKey = util_1.format('event::%s::%s::phases', this.tournamentId, this.eventId);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3:
                        phases = this.getData().event.entities.phase;
                        fn = function (phase) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, internal_1.Phase.getPhase(phase.id)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(phases, fn, { concurrency: options.concurrency })];
                    case 4:
                        allPhases = _a.sent();
                        allPhases = lodash_1.default.uniqBy(allPhases, 'id');
                        this.phases = allPhases;
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, this.phases)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, allPhases];
                    case 6:
                        err_1 = _a.sent();
                        Logger_1.default.error('Event.getEventPhaseGroups: ' + err_1);
                        throw err_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Event.prototype.getEventPhaseGroups = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, groups, fn, allGroups, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getEventPhaseGroups called');
                        // parse options
                        options = parseOptions(options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        Logger_1.default.info('Getting Phase Groups for Event ' + this.tournamentId);
                        cacheKey = util_1.format('event::%s::%s::groups', this.tournamentId, this.eventId);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3:
                        groups = this.getData().event.entities.groups;
                        fn = function (group) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, internal_1.PhaseGroup.getPhaseGroup(group.id)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(groups, fn, { concurrency: options.concurrency })];
                    case 4:
                        allGroups = _a.sent();
                        allGroups = lodash_1.default.uniqBy(allGroups, 'id');
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, allGroups)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, allGroups];
                    case 6:
                        err_2 = _a.sent();
                        Logger_1.default.error('Event.getEventPhaseGroups: ' + err_2);
                        throw err_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Event.prototype.getSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, groups, fn, sets, flattened, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('event::%s::%s::sets', this.tournamentId, this.eventId);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getEventPhaseGroups(options)];
                    case 4:
                        groups = _a.sent();
                        fn = function (group) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, group.getSets(options)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(groups, fn, { concurrency: options.concurrency })];
                    case 5:
                        sets = _a.sent();
                        flattened = lodash_1.default.flatten(sets);
                        if (!options.isCached) return [3 /*break*/, 7];
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, flattened)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, flattened];
                    case 8:
                        e_2 = _a.sent();
                        Logger_1.default.error('Event.getSets error: %s', e_2);
                        throw e_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Event.prototype.getPlayers = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, groups, fn, players, flattened, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('event::%s::%s::players', this.tournamentId, this.eventId);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getEventPhaseGroups(options)];
                    case 4:
                        groups = _a.sent();
                        fn = function (group) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, group.getPlayers(options)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(groups, fn, { concurrency: options.concurrency })];
                    case 5:
                        players = _a.sent();
                        flattened = lodash_1.default.flatten(players);
                        flattened = lodash_1.default.uniqBy(flattened, 'id');
                        if (!options.isCached) return [3 /*break*/, 7];
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, flattened)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, flattened];
                    case 8:
                        e_3 = _a.sent();
                        Logger_1.default.error('Event.getSets error: %s', e_3);
                        throw e_3;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Event.prototype.getTop8Sets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var phases, nonPools, sets, top8, topRegex_1, topPhases, sets, topPhaseNumbers, nextLowestTopPhaseNumber_1, nextLowestTopPhase, sets, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getTop8Sets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, , 12]);
                        options = parseOptions(options);
                        return [4 /*yield*/, this.getEventPhases(options)];
                    case 2:
                        phases = _a.sent();
                        nonPools = phases.filter(function (phase) { return phase.getName().toLowerCase() !== 'pools'; });
                        if (!(phases.length === 1)) return [3 /*break*/, 4];
                        Logger_1.default.verbose('Event has single phase, returning top 8 filtered list');
                        return [4 /*yield*/, phases[0].getSets(options)];
                    case 3:
                        sets = _a.sent();
                        return [2 /*return*/, Common.filterForTop8Sets(sets)];
                    case 4:
                        top8 = lodash_1.default.find(nonPools, function (phase) {
                            return phase.getName().toLowerCase() === 'top 8';
                        });
                        if (!top8) return [3 /*break*/, 6];
                        Logger_1.default.verbose('Event has Top 8 Phase, returning all sets');
                        return [4 /*yield*/, top8.getSets(options)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        // if we can't go off a single phase or Top 8 phase, we need to search for the 
                        // last phase in the event with Top in its name and the lowest number of entrants
                        Logger_1.default.verbose('no single phase or Top 8, finding lowest "Top" phase');
                        topRegex_1 = new RegExp(/Top ([0-9]{2})/);
                        topPhases = nonPools.filter(function (phase) { return topRegex_1.test(phase.getName()); });
                        if (!(topPhases.length === 1)) return [3 /*break*/, 8];
                        Logger_1.default.verbose('single top phase found: %s', topPhases[0].getName());
                        return [4 /*yield*/, topPhases[0].getSets(options)];
                    case 7:
                        sets = _a.sent();
                        return [2 /*return*/, Common.filterForTop8Sets(sets)];
                    case 8:
                        topPhaseNumbers = topPhases.map(function (phase) { return topRegex_1.exec(phase.getName())[1]; });
                        nextLowestTopPhaseNumber_1 = Math.min.apply(null, topPhaseNumbers);
                        nextLowestTopPhase = lodash_1.default.find(topPhases, function (phase) {
                            return phase.getName().toLowerCase() === "Top " + nextLowestTopPhaseNumber_1;
                        });
                        if (!nextLowestTopPhase) return [3 /*break*/, 10];
                        Logger_1.default.verbose('Found the next lowest Top x Phase: %s', nextLowestTopPhase.getName());
                        return [4 /*yield*/, nextLowestTopPhase.getSets(options)];
                    case 9:
                        sets = _a.sent();
                        return [2 /*return*/, Common.filterForTop8Sets(sets)];
                    case 10:
                        Logger_1.default.warn('Could not determine where Top 8 sets lie. Phases: %s', phases.map(function (phase) { return phase.getName(); }));
                        return [2 /*return*/, []];
                    case 11:
                        e_4 = _a.sent();
                        Logger_1.default.error('Event.getTop8Sets error: %s', e_4);
                        throw e_4;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Event.prototype.getIncompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getIncompleteSets called');
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
                        e_5 = _a.sent();
                        Logger_1.default.error('Event.getIncompleteSets error: %s', e_5);
                        throw e_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Event.prototype.getCompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getIncompleteSets called');
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
                        e_6 = _a.sent();
                        Logger_1.default.error('Event.getIncompleteSets error: %s', e_6);
                        throw e_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Event.prototype.getSetsXMinutesBack = function (minutesBack, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Event.getSetsXMinutesBack called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // parse options
                        options = parseOptions(options);
                        options.isCached = false;
                        return [4 /*yield*/, this.getSets()];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForXMinutesBack(sets, minutesBack);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_7 = _a.sent();
                        Logger_1.default.error('Event.getSetsXMinutesBack error: %s', e_7);
                        throw e_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** SIMPLE GETTERS **/
    Event.prototype.getFromEventEntities = function (prop) {
        var data = this.getData();
        if (data && data.event.entities && data.event.entities.event) {
            if (!data.event.entities.event[prop])
                Logger_1.default.error(this.nullValueString(prop));
            return data.event.entities.event[prop];
        }
        else {
            Logger_1.default.error('No data to get Tournament property Id');
            return null;
        }
    };
    Event.prototype.getFromTournamentEntities = function (prop) {
        var data = this.getData();
        if (data && data.tournament.entities && data.tournament.entities.tournament) {
            if (!data.tournament.entities.tournament[prop])
                Logger_1.default.error(this.nullValueString(prop));
            return data.tournament.entities.tournament[prop];
        }
        else {
            Logger_1.default.error('No data to get Tournament property Id');
            return null;
        }
    };
    Event.prototype.getId = function () {
        return this.getFromEventEntities('id');
    };
    Event.prototype.getName = function () {
        return this.getFromEventEntities('name');
    };
    Event.prototype.getTournamentId = function () {
        return this.getFromEventEntities('tournamentId');
    };
    Event.prototype.getTournamentName = function () {
        return this.getFromTournamentEntities('name');
    };
    Event.prototype.getSlug = function () {
        return this.getFromEventEntities('slug');
    };
    Event.prototype.getTournamentSlug = function () {
        var slug = this.getSlug();
        var tournamentSlug = slug.substring(slug.indexOf('/') + 1, slug.indexOf('/', slug.indexOf('/') + 1));
        return tournamentSlug;
    };
    Event.prototype.getTimezone = function () {
        return this.getFromTournamentEntities('timezone');
    };
    Event.prototype.getStartTime = function () {
        var startAt = this.getFromEventEntities('startAt');
        var tz = this.getTimezone();
        if (startAt && tz) {
            var time = moment_1.default.unix(startAt).tz(tz);
            return time.toDate();
        }
        else {
            Logger_1.default.error('Event.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    };
    Event.prototype.getStartTimeString = function () {
        var startAt = this.getFromEventEntities('startAt');
        var tz = this.getTimezone();
        if (startAt && tz) {
            var time = moment_1.default.unix(startAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            var zone = moment_1.default.tz(tz).zoneName();
            return time + " " + zone;
        }
        else {
            Logger_1.default.error('Event.getStartTime: startAt and timezone properties must both be present');
            return null;
        }
    };
    Event.prototype.getEndTime = function () {
        var endAt = this.getFromEventEntities('endAt');
        var tz = this.getTimezone();
        if (endAt && tz) {
            var time = moment_1.default.unix(endAt).tz(tz);
            return time.toDate();
        }
        else {
            Logger_1.default.error('Event.getEndTime: endAt and timezone properties must both be present');
            return null;
        }
    };
    Event.prototype.getEndTimeString = function () {
        var endAt = this.getFromEventEntities('endAt');
        var tz = this.getTimezone();
        if (endAt && tz) {
            var time = moment_1.default.unix(endAt).tz(tz).format('MM-DD-YYYY HH:mm:ss');
            var zone = moment_1.default.tz(tz).zoneName();
            return time + " " + zone;
        }
        else {
            Logger_1.default.error('Event.getEndTime: endAt and timezone properties must both be present');
            return null;
        }
    };
    /** NULL VALUES **/
    Event.prototype.nullValueString = function (prop) {
        return prop + ' not available for Event ' + this.getData().event.entities.event.name;
    };
    /** EVENTS **/
    Event.prototype.emitEventReady = function () {
        this.emit('ready');
    };
    Event.prototype.emitEventError = function (err) {
        this.emit('error', err);
    };
    return Event;
}(events_1.EventEmitter));
exports.Event = Event;
Event.prototype.toString = function () {
    return 'Event: ' +
        '\nID: ' + this.getId() +
        '\nName: ' + this.getName() +
        '\nTournament: ' + this.getTournamentId() +
        '\nStart Time: ' + this.getStartTime();
};
