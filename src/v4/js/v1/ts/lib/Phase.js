'use strict';
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
var internal_1 = require("./internal");
var Cache_1 = __importDefault(require("./util/Cache"));
var Encoder_1 = __importDefault(require("./util/Encoder"));
var Logger_1 = __importDefault(require("./util/Logger"));
var PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
var LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
var DEFAULT_ENCODING = 'json';
var DEFAULT_CONCURRENCY = 4;
var Common_1 = require("./util/Common");
var Phase = /** @class */ (function (_super) {
    __extends(Phase, _super);
    function Phase(id, options) {
        if (options === void 0) { options = IPhase.getDefaultOptions(); }
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.url = '';
        _this.data = IPhase.getDefaultData();
        _this.isCached = true;
        _this.rawEncoding = DEFAULT_ENCODING;
        _this.expandsString = '';
        _this.expands = IPhase.getDefaultExpands();
        if (!id)
            throw new Error('ID cannot be null for Phase Group');
        _this.id = id;
        // parse options
        options = IPhase.parseOptions(options);
        _this.isCached = options.isCached;
        _this.rawEncoding = options.rawEncoding;
        // CREATE THE EXPANDS STRING
        _this.expandsString = '';
        if (options.expands) {
            _this.expands = Object.assign(_this.expands, options.expands);
        }
        for (var property in _this.expands) {
            if (_this.expands.hasOwnProperty(property))
                _this.expandsString += util_1.format('expand[]=%s&', property);
        }
        _this.url = util_1.format(PHASE_URL, _this.id, _this.expandsString);
        var ThisPhase = _this;
        _this.load()
            .then(function () {
            var cacheKey = util_1.format('phase::%s::%s', ThisPhase.id, ThisPhase.expandsString);
            Cache_1.default.set(cacheKey, ThisPhase);
        })
            .then(function () {
            ThisPhase.emitPhaseReady();
        })
            .catch(function (err) {
            console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')');
            Logger_1.default.error('Phase error: %s', err.message);
            ThisPhase.emitPhaseError(err);
        });
        return _this;
    }
    Phase.prototype.loadData = function (data) {
        var encoded = this.rawEncoding === 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
        this.data = encoded;
        return encoded;
    };
    Phase.prototype.getData = function () {
        var decoded = this.rawEncoding === 'json' ? this.data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8'));
        return decoded;
    };
    // Convenience Methods
    Phase.getPhase = function (id, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                var P_1 = new Phase(id, options);
                P_1.on('ready', function () {
                    resolve(P_1);
                });
                P_1.on('error', function (e) {
                    Logger_1.default.error('getPhase error: %s', e);
                    reject(e);
                });
            }
            catch (e) {
                Logger_1.default.error('getPhase error: %s', e);
                reject(e);
            }
        });
    };
    Phase.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, encoded, e_1, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Phase.load called');
                        Logger_1.default.verbose('Creating Phase from url: %s', this.url);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        if (!!this.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, request_promise_1.default(this.url)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        cacheKey = util_1.format('phase::%s::%s::%s::data', this.id, this.rawEncoding, this.expandsString);
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
                        Logger_1.default.error('Phase.load error: %s', e_1.message);
                        if (e_1.name === 'StatusCodeError' && e_1.message.indexOf('404') > -1) {
                            s = util_1.format('No Phase with id [%s] ( %s )', this.id, this.url);
                            Logger_1.default.error(s);
                        }
                        throw e_1;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /** PROMISES **/
    Phase.prototype.getPhaseGroups = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, groups, fn, allPhaseGroups, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Phase.getGroups called');
                        // parse options
                        options = Common_1.ICommon.parseOptions(options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        cacheKey = util_1.format('phase::%s::groups', this.id);
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
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, internal_1.PhaseGroup.getPhaseGroup(group.id)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(groups, fn, { concurrency: options.concurrency })];
                    case 4:
                        allPhaseGroups = _a.sent();
                        allPhaseGroups = lodash_1.default.uniqBy(allPhaseGroups, 'id');
                        Cache_1.default.set(cacheKey, allPhaseGroups);
                        return [2 /*return*/, allPhaseGroups];
                    case 5:
                        err_1 = _a.sent();
                        Logger_1.default.error('Phase.getGroups: ' + err_1);
                        throw err_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Phase.prototype.getSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, phaseGroups, fn, sets, flattened, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Phase.getSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        // parse options
                        options = Common_1.ICommon.parseOptions(options);
                        cacheKey = util_1.format('phase::%s::sets', this.id);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getPhaseGroups(options)];
                    case 4:
                        phaseGroups = _a.sent();
                        fn = function (group) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, group.getSets(options)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(phaseGroups, fn, { concurrency: options.concurrency })];
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
                        Logger_1.default.error('Phase.getSets error: %s', e_2);
                        throw e_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Phase.prototype.getPlayers = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, phaseGroups, fn, players, flattened, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Phase.getPlayers called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        // parse options
                        options = Common_1.ICommon.parseOptions(options);
                        cacheKey = util_1.format('phase::%s::players', this.id);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getPhaseGroups(options)];
                    case 4:
                        phaseGroups = _a.sent();
                        fn = function (group) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, group.getPlayers(options)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, p_map_1.default(phaseGroups, fn, { concurrency: options.concurrency })];
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
                        Logger_1.default.error('Phase.getPlayers error: %s', e_3);
                        throw e_3;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Phase.prototype.getIncompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Phase.getIncompleteSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        //parse options
                        options = Common_1.ICommon.parseOptions(options);
                        return [4 /*yield*/, this.getSets(options)];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForIncompleteSets(sets);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_4 = _a.sent();
                        Logger_1.default.error('Phase.getIncompleteSets error: %s', e_4);
                        throw e_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Phase.prototype.getCompleteSets = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Phase.getIncompleteSets called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        //parse options
                        options = Common_1.ICommon.parseOptions(options);
                        return [4 /*yield*/, this.getSets(options)];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForCompleteSets(sets);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_5 = _a.sent();
                        Logger_1.default.error('Phase.getIncompleteSets error: %s', e_5);
                        throw e_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Phase.prototype.getSetsXMinutesBack = function (minutesBack, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sets, filtered, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Phase.getSetsXMinutesBack called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // parse options
                        options = Common_1.ICommon.parseOptions(options);
                        options.isCached = false;
                        return [4 /*yield*/, this.getSets()];
                    case 2:
                        sets = _a.sent();
                        filtered = internal_1.GGSet.filterForXMinutesBack(sets, minutesBack);
                        return [2 /*return*/, filtered];
                    case 3:
                        e_6 = _a.sent();
                        Logger_1.default.error('Phase.getSetsXMinutesBack error: %s', e_6);
                        throw e_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** SIMPLE GETTERS **/
    Phase.prototype.getFromDataEntities = function (prop) {
        var data = this.getData();
        if (data && data.entities && data.entities.phase) {
            if (!data.entities.phase[prop])
                Logger_1.default.error(this.nullValueString(prop));
            return data.entities.phase[prop];
        }
        else {
            Logger_1.default.error('No data to get Tournament property Id');
            return null;
        }
    };
    Phase.prototype.getName = function () {
        return this.getFromDataEntities('name');
    };
    Phase.prototype.getEventId = function () {
        return this.getFromDataEntities('eventId');
    };
    /** NULL VALUES **/
    Phase.prototype.nullValueString = function (prop) {
        return prop + ' not available for Phase ' + this.getData().entities.phase.name;
    };
    /** EVENTS **/
    Phase.prototype.emitPhaseReady = function () {
        this.emit('ready');
    };
    Phase.prototype.emitPhaseError = function (err) {
        this.emit('error', err);
    };
    return Phase;
}(events_1.EventEmitter));
exports.Phase = Phase;
Phase.prototype.toString = function () {
    return 'Phase: ' +
        '\nID: ' + this.id +
        '\nName: ' + this.getName() +
        '\nEvent ID: ' + this.getEventId();
};
var IPhase;
(function (IPhase) {
    function getDefaultData() {
        return {
            id: 0
        };
    }
    IPhase.getDefaultData = getDefaultData;
    function getDefaultExpands() {
        return {
            groups: true
        };
    }
    IPhase.getDefaultExpands = getDefaultExpands;
    function getDefaultOptions() {
        return {
            expands: {
                groups: true
            },
            isCached: true,
            rawEncoding: 'json'
        };
    }
    IPhase.getDefaultOptions = getDefaultOptions;
    function parseOptions(options) {
        return {
            expands: {
                groups: (options.expands != undefined && options.expands.groups == false) ? false : true
            },
            isCached: options.isCached != undefined ? options.isCached === true : true,
            rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
        };
    }
    IPhase.parseOptions = parseOptions;
})(IPhase = exports.IPhase || (exports.IPhase = {}));
