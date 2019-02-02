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
var p_map_1 = __importDefault(require("p-map"));
var util_1 = require("util");
var events_1 = require("events");
var TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
var LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
var DEFAULT_ENCODING = 'json';
var DEFAULT_CONCURRENCY = 4;
var ITournament;
(function (ITournament) {
    function getDefaultData() {
        return {
            "data": {
                "tournament": {
                    "id": 0,
                    "name": '',
                    "slug": '',
                    "city": '',
                    "postalCode": 0,
                    "addrState": '',
                    "countryCode": 0,
                    "region": '',
                    "venueAddress": '',
                    "venueName": '',
                    "gettingThere": '',
                    "lat": 0,
                    "lng": 0,
                    "timezone": '',
                    "startAt": 0,
                    "endAt": 0,
                    "contactInfo": '',
                    "contactEmail": '',
                    "contactTwitter": '',
                    "contactPhone": '',
                    "ownerId": 0
                }
            },
            "actionRecords": []
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
var Common = __importStar(require("./util/Common"));
var Cache_1 = __importDefault(require("./util/Cache"));
var Logger_1 = __importDefault(require("./util/Logger"));
var internal_1 = require("./internal");
var Encoder_1 = __importDefault(require("./util/Encoder"));
// import Fetcher from './util/EntityFetcher'
var NetworkInterface_1 = __importDefault(require("./util/NetworkInterface"));
var tourneyQueries = __importStar(require("./scripts/tournamentQueries"));
var eventQueries = __importStar(require("./scripts/eventQueries"));
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
    function Tournament(id, name, slug, startTime, endTime, timezone, venue, organizer, rawEncoding, data) {
        var _this = _super.call(this) || this;
        _this.rawEncoding = DEFAULT_ENCODING;
        _this.id = id;
        _this.name = name;
        _this.slug = slug;
        _this.startTime = startTime;
        _this.endTime = endTime;
        _this.timezone = timezone;
        _this.venue = venue;
        _this.organizer = organizer;
        _this.rawEncoding = rawEncoding;
        _this.data = data;
        return _this;
    }
    Tournament.getTournament = function (slug, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Tournament.get(slug, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Tournament.parse = function (data, options) {
        var venue = new internal_1.Venue(data.data.tournament.venueName, data.data.tournament.venueAddress, data.data.tournament.city, data.data.tournament.addrState, data.data.tournament.countryCode, data.data.tournament.region, data.data.tournament.postalCode, data.data.tournament.lat, data.data.tournament.lng);
        var organizer = new internal_1.Organizer(data.data.tournament.ownerId, data.data.tournament.contactEmail, data.data.tournament.contactPhone, data.data.tournament.contactTwitter, data.data.tournament.contactInfo);
        var startTime = null, endTime = null;
        if (data.data.tournament.startAt) {
            startTime = new Date(0);
            startTime.setUTCSeconds(data.data.tournament.startAt);
        }
        if (data.data.tournament.endAt) {
            endTime = new Date(0);
            endTime.setUTCSeconds(data.data.tournament.endAt);
        }
        var encoding = options.rawEncoding || DEFAULT_ENCODING;
        var encoded = Encoder_1.default.encode(data, encoding);
        var T = new Tournament(data.data.tournament.id, data.data.tournament.name, data.data.tournament.slug, startTime, endTime, data.data.tournament.timezone, venue, organizer, encoding, encoded);
        return T;
    };
    Tournament.get = function (slug, options) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, data, T;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = util_1.format('tournament::%s', slug);
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached && options.isCached)
                            return [2 /*return*/, cached];
                        return [4 /*yield*/, NetworkInterface_1.default.query(tourneyQueries.tournament, { slug: slug })];
                    case 2:
                        data = _a.sent();
                        T = Tournament.parse(data, options);
                        if (!options.isCached) return [3 /*break*/, 4];
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, T)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, T];
                }
            });
        });
    };
    Tournament.prototype.getData = function () {
        return Encoder_1.default.decode(this.data, this.rawEncoding);
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
                        if (cached)
                            return [2 /*return*/, cached];
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
                        if (cached)
                            return [2 /*return*/, cached];
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
            var cacheKey, cached, results, eventData, tournamentData, events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Events for ' + this.getName());
                        cacheKey = util_1.format('tournament::%s::events', this.name);
                        if (!options.isCached) return [3 /*break*/, 2];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2: return [4 /*yield*/, NetworkInterface_1.default.query(eventQueries.event, { slug: this.name })];
                    case 3:
                        results = _a.sent();
                        eventData = results.tournament.events;
                        tournamentData = results.tournament;
                        delete tournamentData.events;
                        events = eventData.map(function (event) { return internal_1.Event.parse(event); });
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, events)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, events];
                }
            });
        });
    };
    Tournament.prototype.getAllPhases = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isCached, rawEncoding, cacheKey, cached, results, eventData, tournamentData, phases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getPhases called');
                        isCached = options.isCached != undefined ? options.isCached === true : true;
                        rawEncoding = options.rawEncoding;
                        cacheKey = util_1.format('tournament::%s::phases', this.name);
                        if (!isCached) return [3 /*break*/, 2];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2: return [4 /*yield*/, NetworkInterface_1.default.query(graphQueries.tournamentPhases, { slug: this.name })];
                    case 3:
                        results = _a.sent();
                        eventData = results.tournament.events;
                        tournamentData = results.tournament;
                        delete tournamentData.events;
                        phases = lodash_1.default.flatten(eventData.map(function (event) {
                            return event.phases.map(function (phase) {
                                var data = {};
                                var P = new internal_1.Phase(phase.id, { loadData: false, rawEncoding: rawEncoding, isCached: isCached });
                                data.tournament = tournamentData;
                                data.event = lodash_1.default.clone(event);
                                delete data.event.phases;
                                data.phase = phase;
                                P.loadData(data);
                                return P;
                            });
                        }));
                        if (!isCached) return [3 /*break*/, 5];
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, phases)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, phases];
                }
            });
        });
    };
    Tournament.prototype.getAllPhaseGroups = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isCached, rawEncoding, cacheKey, cached, results, eventData, tournamentData, phaseGroups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Tournament.getPhaseGroups called');
                        isCached = options.isCached != undefined ? options.isCached === true : true;
                        rawEncoding = options.rawEncoding;
                        cacheKey = util_1.format('tournament::%s::phaseGroups', this.name);
                        if (!isCached) return [3 /*break*/, 2];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2: return [4 /*yield*/, NetworkInterface_1.default.query(graphQueries.tournamentPhaseGroups, { slug: this.name })];
                    case 3:
                        results = _a.sent();
                        eventData = results.tournament.events;
                        tournamentData = results.tournament;
                        delete tournamentData.events;
                        phaseGroups = lodash_1.default.flatten(eventData.map(function (event) {
                            return event.phaseGroups.map(function (phaseGroup) {
                                var data = {};
                                var PG = new internal_1.PhaseGroup(phaseGroup.id, { loadData: false, rawEncoding: rawEncoding, isCached: isCached });
                                data.tournament = tournamentData;
                                data.event = lodash_1.default.clone(event);
                                delete data.event.phaseGroups;
                                data.phaseGroup = phaseGroup;
                                PG.loadData(data);
                                return PG;
                            });
                        }));
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, phaseGroups)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, phaseGroups];
                }
            });
        });
    };
    Tournament.prototype.getIncompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, complete, e_1;
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
                        e_1 = _a.sent();
                        Logger_1.default.error('Tournament.getIncompleteSets error: %s', e_1);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getCompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, incomplete, e_2;
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
                        e_2 = _a.sent();
                        Logger_1.default.error('Tournament.getIncompleteSets error: %s', e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getSetsXMinutesBack = function (minutesBack, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_3;
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
                        e_3 = _a.sent();
                        Logger_1.default.error('Tournament.getSetsXMinutesBack error: %s', e_3);
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tournament.prototype.getId = function () {
        return this.id;
    };
    Tournament.prototype.getName = function () {
        return this.name;
    };
    Tournament.prototype.getSlug = function () {
        return this.slug;
    };
    Tournament.prototype.getTimezone = function () {
        return this.timezone;
    };
    Tournament.prototype.getStartTime = function () {
        return this.startTime;
    };
    Tournament.prototype.getStartTimeString = function () {
        return this.getStartTime() + " " + this.getTimezone();
    };
    Tournament.prototype.getEndTime = function () {
        return this.endTime;
    };
    Tournament.prototype.getEndTimeString = function () {
        return this.getEndTime() + " " + this.getTimezone();
    };
    Tournament.prototype.getVenue = function () {
        return this.venue;
    };
    Tournament.prototype.getCity = function () {
        return this.getVenue().getCity();
    };
    Tournament.prototype.getState = function () {
        return this.getVenue().getState();
    };
    Tournament.prototype.getZipCode = function () {
        return this.getVenue().getPostalCode();
    };
    Tournament.prototype.getOrganizer = function () {
        return this.organizer;
    };
    Tournament.prototype.getContactInfo = function () {
        return this.getOrganizer().getInfo();
    };
    Tournament.prototype.getContactEmail = function () {
        return this.getOrganizer().getEmail();
    };
    Tournament.prototype.getContactTwitter = function () {
        return this.getOrganizer().getTwitter();
    };
    Tournament.prototype.getOwnerId = function () {
        return this.getOrganizer().getId();
    };
    /**
     * @deprecated
     */
    //getVenueFee() : string {
    //	return this.getFromDataEntities('venueFee');
    //}
    /**
     * @deprecated
     */
    //getProcessingFee() : string {
    //	return this.getFromDataEntities('processingFee');
    //}
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
