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
var lodash_1 = __importDefault(require("lodash"));
var Entrant_1 = require("./Entrant"); // TODO change this to internal
var GGSet_1 = require("./GGSet");
var PaginatedQuery_1 = __importDefault(require("./util/PaginatedQuery"));
var NetworkInterface_1 = __importDefault(require("./util/NetworkInterface"));
var Logger_1 = __importDefault(require("./util/Logger"));
var queries = __importStar(require("./scripts/phaseGroupQueries"));
var PhaseGroup = /** @class */ (function () {
    function PhaseGroup(id, phaseId, displayIdentifier, firstRoundTime, state, waveId, tiebreakOrder) {
        this.id = id;
        this.phaseId = phaseId;
        this.displayIdentifier = displayIdentifier;
        this.firstRoundTime = firstRoundTime;
        this.state = state;
        this.waveId = waveId;
        this.tiebreakOrder = tiebreakOrder;
    }
    PhaseGroup.parse = function (data) {
        return new PhaseGroup(data.id, data.phaseId, data.displayIdentifier, data.firstRoundTime, data.state, data.waveId, data.tiebreakOrder);
    };
    PhaseGroup.parseFull = function (data) {
        return PhaseGroup.parse(data.phaseGroup);
    };
    PhaseGroup.parseEventData = function (data) {
        return data.event.phaseGroups.map(function (pg) { return PhaseGroup.parse(pg); });
    };
    PhaseGroup.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Phase Group with id %s', id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.phaseGroup, { id: id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, PhaseGroup.parse(data.phaseGroup)];
                }
            });
        });
    };
    PhaseGroup.prototype.getId = function () {
        return this.id;
    };
    PhaseGroup.prototype.getPhaseId = function () {
        return this.phaseId;
    };
    PhaseGroup.prototype.getDisplayIdentifier = function () {
        return this.displayIdentifier;
    };
    PhaseGroup.prototype.getFirstRoundTime = function () {
        return this.firstRoundTime;
    };
    PhaseGroup.prototype.getState = function () {
        return this.state;
    };
    PhaseGroup.prototype.getWaveId = function () {
        return this.waveId;
    };
    PhaseGroup.prototype.getTiebreakOrder = function () {
        return this.tiebreakOrder;
    };
    PhaseGroup.prototype.getEntrants = function (options) {
        if (options === void 0) { options = IPhaseGroup.getDefaultEntrantOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var data, phaseGroups, entrants;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Entrants for Phase Group [%s]', this.id);
                        Logger_1.default.verbose('Query variables: %s', JSON.stringify(options));
                        return [4 /*yield*/, PaginatedQuery_1.default.query("Phase Group Entrants [" + this.id + "]", queries.phaseGroupEntrants, { id: this.id }, options, 2)];
                    case 1:
                        data = _a.sent();
                        phaseGroups = data.map(function (pg) { return pg.phaseGroup; });
                        entrants = lodash_1.default.flatten(phaseGroups.map(function (pg) { return pg.paginatedSeeds.nodes.map(function (e) { return Entrant_1.Entrant.parseFull(e); }).filter(function (seed) { return seed != null; }); }));
                        return [2 /*return*/, entrants];
                }
            });
        });
    };
    PhaseGroup.prototype.getSets = function (options) {
        if (options === void 0) { options = IPhaseGroup.getDefaultSetOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var data, phaseGroups, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Sets for Phase Group [%s]', this.id);
                        Logger_1.default.verbose('Query variables: %s', JSON.stringify(options));
                        return [4 /*yield*/, PaginatedQuery_1.default.query("Phase Group Sets [" + this.id + "]", queries.phaseGroupSets, { id: this.id }, options, 2)];
                    case 1:
                        data = _a.sent();
                        phaseGroups = data.map(function (pg) { return pg.phaseGroup; });
                        sets = lodash_1.default.flatten(phaseGroups.map(function (pg) { return pg.paginatedSets.nodes.map(function (set) { return GGSet_1.GGSet.parse(set); }).filter(function (set) { return set != null; }); }));
                        return [2 /*return*/, sets];
                }
            });
        });
    };
    PhaseGroup.prototype.getCompleteSets = function () {
    };
    PhaseGroup.prototype.getIncompleteSets = function () {
    };
    PhaseGroup.prototype.getSetsXMinutesBack = function (minutes) {
    };
    PhaseGroup.prototype.findPlayerByParticipantId = function (id) {
    };
    return PhaseGroup;
}());
exports.PhaseGroup = PhaseGroup;
var IPhaseGroup;
(function (IPhaseGroup) {
    function getDefaultEntrantOptions() {
        return {
            page: 1,
            perPage: 1,
            sortBy: null,
            filter: null
        };
    }
    IPhaseGroup.getDefaultEntrantOptions = getDefaultEntrantOptions;
    function getDefaultSetOptions() {
        return {
            page: 1,
            perPage: 1,
            sortBy: null,
            filters: null
        };
    }
    IPhaseGroup.getDefaultSetOptions = getDefaultSetOptions;
})(IPhaseGroup = exports.IPhaseGroup || (exports.IPhaseGroup = {}));
