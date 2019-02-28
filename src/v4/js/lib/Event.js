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
var events_1 = require("events");
var Logger_1 = __importDefault(require("./util/Logger"));
var Phase_1 = require("./Phase");
var PhaseGroup_1 = require("./PhaseGroup");
var GGSet_1 = require("./GGSet");
var Entrant_1 = require("./Entrant");
var Attendee_1 = require("./Attendee");
var NetworkInterface_1 = __importDefault(require("./util/NetworkInterface"));
var queries = __importStar(require("./scripts/eventQueries"));
var Event = /** @class */ (function (_super) {
    __extends(Event, _super);
    function Event(id, name, slug, state, startAt, numEntrants, checkInBuffer, checkInDuration, checkInEnabled, isOnline, teamNameAllowed, teamManagementDeadline) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.name = name;
        _this.slug = slug;
        _this.state = state;
        _this.startAt = startAt;
        _this.numEntrants = numEntrants;
        _this.checkInBuffer = checkInBuffer;
        _this.checkInDuration = checkInDuration;
        _this.checkInEnabled = checkInEnabled;
        _this.isOnline = isOnline;
        _this.teamNameAllowed = teamNameAllowed;
        _this.teamManagementDeadline = teamManagementDeadline;
        return _this;
    }
    Event.parse = function (data) {
        return new Event(data.id, data.name, data.slug, data.state, data.startAt, data.numEntrants, data.checkInBuffer, data.checkInDuration, data.checkInEnabled, data.isOnline, data.teamNameAllowed, data.teamManagementDeadline);
    };
    Event.parseFull = function (data) {
        return Event.parse(data.event);
    };
    Event.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Event with id %s', id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.event, { id: id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Event.parseFull(data)];
                }
            });
        });
    };
    Event.getBySlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Event with slug "%s"', slug);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.eventSlug, { slug: slug })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Event.parseFull(data)];
                }
            });
        });
    };
    Event.prototype.getId = function () {
        return this.id;
    };
    Event.prototype.getName = function () {
        return this.name;
    };
    Event.prototype.getSlug = function () {
        return this.slug;
    };
    Event.prototype.getState = function () {
        return this.state;
    };
    Event.prototype.getNumEntrants = function () {
        return this.numEntrants;
    };
    Event.prototype.getCheckInBuffer = function () {
        return this.checkInBuffer;
    };
    Event.prototype.getCheckInDuration = function () {
        return this.checkInDuration;
    };
    Event.prototype.getCheckInEnabled = function () {
        return this.checkInEnabled;
    };
    Event.prototype.getIsOnline = function () {
        return this.isOnline;
    };
    Event.prototype.getTeamNameAllowed = function () {
        return this.teamNameAllowed;
    };
    Event.prototype.getTeamManagementDeadline = function () {
        return this.teamManagementDeadline;
    };
    // aggregation
    Event.prototype.getPhases = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Phases for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.eventPhases, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.event.phases.map(function (phaseData) { return Phase_1.Phase.parse(phaseData, _this.id); })];
                }
            });
        });
    };
    Event.prototype.getPhaseGroups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Phase Groups for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.eventPhaseGroups, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.event.phaseGroups.map(function (phaseGroupData) { return PhaseGroup_1.PhaseGroup.parse(phaseGroupData); })];
                }
            });
        });
    };
    Event.prototype.getEntrants = function (options) {
        if (options === void 0) { options = Entrant_1.IEntrant.getDefaultEntrantOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var pgs, entrants;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Entrants for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, this.getPhaseGroups()];
                    case 1:
                        pgs = _a.sent();
                        return [4 /*yield*/, NetworkInterface_1.default.clusterQuery(pgs, 'getEntrants', options)];
                    case 2:
                        entrants = _a.sent();
                        return [2 /*return*/, lodash_1.default.flatten(entrants)];
                }
            });
        });
    };
    Event.prototype.getAttendees = function (options) {
        if (options === void 0) { options = Attendee_1.IAttendee.getDefaultAttendeeOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var pgs, attendees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Attendees for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, this.getPhaseGroups()];
                    case 1:
                        pgs = _a.sent();
                        return [4 /*yield*/, NetworkInterface_1.default.clusterQuery(pgs, "getAttendees", options)];
                    case 2:
                        attendees = _a.sent();
                        return [2 /*return*/, lodash_1.default.flatten(attendees)];
                }
            });
        });
    };
    Event.prototype.getSets = function (options) {
        if (options === void 0) { options = GGSet_1.IGGSet.getDefaultSetOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var pgs, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Sets for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, this.getPhaseGroups()];
                    case 1:
                        pgs = _a.sent();
                        return [4 /*yield*/, NetworkInterface_1.default.clusterQuery(pgs, 'getSets', options)];
                    case 2:
                        sets = _a.sent();
                        return [2 /*return*/, lodash_1.default.flatten(sets)];
                }
            });
        });
    };
    Event.prototype.getEntrants2 = function (options) {
        if (options === void 0) { options = Entrant_1.IEntrant.getDefaultEntrantOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var data, entrantData, entrants;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Entrants for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, NetworkInterface_1.default.paginatedQuery("Event Entrants [" + this.id + " :: " + this.name + "]", queries.eventEntrants, { id: this.id }, options, {}, 2)];
                    case 1:
                        data = _a.sent();
                        entrantData = lodash_1.default.flatten(data.map(function (d) { return d.event.entrants.nodes; }));
                        entrants = entrantData.map(function (entrant) { return Entrant_1.Entrant.parse(entrant); });
                        return [2 /*return*/, entrants];
                }
            });
        });
    };
    Event.prototype.getAttendees2 = function (options) {
        if (options === void 0) { options = Attendee_1.IAttendee.getDefaultAttendeeOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var data, entrantData, attendeeData, attendees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Attendees for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, NetworkInterface_1.default.paginatedQuery("Event Attendees [" + this.id + " :: " + this.name + "]", queries.eventAttendees, { id: this.id }, options, {}, 3)];
                    case 1:
                        data = _a.sent();
                        entrantData = lodash_1.default.flatten(data.map(function (d) { return d.event.entrants.nodes; }));
                        attendeeData = lodash_1.default.flatten(entrantData.map(function (entrant) { return entrant.participants; }));
                        attendees = attendeeData.map(function (attendee) { return Attendee_1.Attendee.parse(attendee); });
                        return [2 /*return*/, attendees];
                }
            });
        });
    };
    Event.prototype.getSets2 = function (options) {
        if (options === void 0) { options = GGSet_1.IGGSet.getDefaultSetOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var data, phaseGroups, setData, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Sets for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, NetworkInterface_1.default.paginatedQuery("Event Sets [" + this.id + " :: " + this.name + "]", queries.eventSets, { id: this.id }, options, {}, 3)];
                    case 1:
                        data = _a.sent();
                        phaseGroups = lodash_1.default.flatten(data.map(function (d) { return d.event.phaseGroups; }));
                        setData = lodash_1.default.flatten(phaseGroups.map(function (pg) { return pg.paginatedSets.nodes; }));
                        sets = setData.map(function (set) { return GGSet_1.GGSet.parse(set); });
                        return [2 /*return*/, sets];
                }
            });
        });
    };
    // need coverage
    Event.prototype.getIncompleteSets = function (options) {
        if (options === void 0) { options = GGSet_1.IGGSet.getDefaultSetOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Incomplete Sets for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, this.getSets(options)];
                    case 1:
                        sets = _a.sent();
                        return [2 /*return*/, GGSet_1.GGSet.filterForIncompleteSets(sets)];
                }
            });
        });
    };
    // need coverage
    Event.prototype.getCompleteSets = function (options) {
        if (options === void 0) { options = GGSet_1.IGGSet.getDefaultSetOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Completed Sets for Event [%s :: %s]', this.id, this.name);
                        return [4 /*yield*/, this.getSets(options)];
                    case 1:
                        sets = _a.sent();
                        return [2 /*return*/, GGSet_1.GGSet.filterForCompleteSets(sets)];
                }
            });
        });
    };
    // need coverage
    Event.prototype.getSetsXMinutesBack = function (minutes, options) {
        if (options === void 0) { options = GGSet_1.IGGSet.getDefaultSetOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting sets completed %s minutes ago for Event [%s :: %s]', minutes, this.id, this.name);
                        return [4 /*yield*/, this.getSets(options)];
                    case 1:
                        sets = _a.sent();
                        return [2 /*return*/, GGSet_1.GGSet.filterForXMinutesBack(sets, minutes)];
                }
            });
        });
    };
    return Event;
}(events_1.EventEmitter));
exports.Event = Event;
