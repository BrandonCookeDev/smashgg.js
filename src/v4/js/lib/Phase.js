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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var NetworkInterface_1 = __importDefault(require("./util/NetworkInterface"));
var queries = __importStar(require("./scripts/phaseQueries"));
var PhaseGroup_1 = require("./PhaseGroup"); //TODO change this to internal
var GGSet_1 = require("./GGSet");
var Entrant_1 = require("./Entrant");
var Seed_1 = require("./Seed");
var PaginatedQuery_1 = __importDefault(require("./util/PaginatedQuery"));
var Logger_1 = __importDefault(require("./util/Logger"));
var Phase = /** @class */ (function () {
    function Phase(id, eventId, name, numSeeds, groupCount) {
        this.id = id;
        this.eventId = eventId;
        this.name = name;
        this.numSeeds = numSeeds;
        this.groupCount = groupCount;
    }
    Phase.parse = function (data, eventId) {
        return new Phase(data.id, eventId || -1, data.name, data.numSeeds, data.groupCount);
    };
    Phase.get = function (id, eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Phase with id %s and event id %s', id, eventId);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.phase, { id: id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Phase.parse(data.phase, eventId)];
                }
            });
        });
    };
    Phase.prototype.getId = function () {
        return this.id;
    };
    Phase.prototype.getEventId = function () {
        return this.eventId;
    };
    Phase.prototype.getName = function () {
        return this.name;
    };
    Phase.prototype.getNumSeeds = function () {
        return this.numSeeds;
    };
    Phase.prototype.getGroupCount = function () {
        return this.groupCount;
    };
    Phase.prototype.getPhaseGroups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, phaseGroupData, phaseGroups;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting phase groups for phase %s', this.id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.phasePhaseGroups, { eventId: this.eventId })];
                    case 1:
                        data = _a.sent();
                        phaseGroupData = data.event.phaseGroups.filter(function (phaseGroupData) { return phaseGroupData.phaseId === _this.id; });
                        phaseGroups = phaseGroupData.map(function (pg) { return PhaseGroup_1.PhaseGroup.parse(pg); });
                        return [2 /*return*/, phaseGroups];
                }
            });
        });
    };
    Phase.prototype.getSeeds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, seedData, seeds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting seeds for phase %s', this.id);
                        return [4 /*yield*/, PaginatedQuery_1.default.query("Phase Seeds [" + this.id + "]", queries.phaseSeeds, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        seedData = lodash_1.default.flatten(data.map(function (results) { return results.phase.paginatedSeeds.nodes; })).filter(function (seed) { return seed != null; });
                        seeds = seedData.map(function (seedData) { return Seed_1.Seed.parse(seedData); });
                        return [2 /*return*/, seeds];
                }
            });
        });
    };
    Phase.prototype.getSets = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var optionSet, data, phaseGroups, setsData, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting sets for phase %s', this.id);
                        optionSet = IPhase.parseSetOptions(options);
                        return [4 /*yield*/, PaginatedQuery_1.default.query("Phase Sets [" + this.id + "]", queries.phaseSets, { eventId: this.eventId, phaseId: this.id }, optionSet.params, optionSet.additionalParams, 2)];
                    case 1:
                        data = _a.sent();
                        phaseGroups = lodash_1.default.flatten(data.map(function (setData) { return setData.event.phaseGroups; }));
                        setsData = lodash_1.default.flatten(phaseGroups.map(function (pg) { return pg.paginatedSets.nodes; })).filter(function (set) { return set != null; });
                        sets = setsData.map(function (setData) { return GGSet_1.GGSet.parse(setData); });
                        return [2 /*return*/, sets];
                }
            });
        });
    };
    Phase.prototype.getEntrants = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, entrantData, entrants;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting entrants for phase %s', this.id);
                        return [4 /*yield*/, PaginatedQuery_1.default.query("Phase Entrants [" + this.id + "]", queries.phaseEntrants, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        entrantData = lodash_1.default.flatten(data.map(function (entrantData) { return entrantData.phase.paginatedSeeds.nodes; })).filter(function (entrant) { return entrant != null; });
                        entrants = entrantData.map(function (e) { return Entrant_1.Entrant.parseFull(e); });
                        return [2 /*return*/, entrants];
                }
            });
        });
    };
    Phase.prototype.getIncompleteSets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = GGSet_1.GGSet).filterForIncompleteSets;
                        return [4 /*yield*/, this.getSets()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    Phase.prototype.getCompleteSets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = GGSet_1.GGSet).filterForCompleteSets;
                        return [4 /*yield*/, this.getSets()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    Phase.prototype.getSetsXMinutesBack = function (minutesBack) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = GGSet_1.GGSet).filterForXMinutesBack;
                        return [4 /*yield*/, this.getSets()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), minutesBack])];
                }
            });
        });
    };
    return Phase;
}());
exports.Phase = Phase;
var IPhase;
(function (IPhase) {
    function parseSetOptions(options) {
        if (!options)
            return { params: { page: 1, perPage: undefined }, additionalParams: { sortType: null, hasPermissions: null, filters: null } };
        var params, additionalParams;
        if (options) {
            params = { page: options.page, perPage: options.perPage };
            additionalParams = {
                sortType: options.sortType || null,
                hasPermissions: options.hasPermissions || null,
                filters: options.filters
            };
        }
        return {
            params: params,
            additionalParams: additionalParams
        };
    }
    IPhase.parseSetOptions = parseSetOptions;
})(IPhase = exports.IPhase || (exports.IPhase = {}));
