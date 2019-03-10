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
var Logger_1 = __importDefault(require("./Logger"));
var request_promise_1 = __importDefault(require("request-promise"));
var util_1 = require("util");
var Common = __importStar(require("./Common"));
/* Interfaces */
var internal_1 = require("../internal");
var internal_2 = require("../internal");
var internal_3 = require("../internal");
var internal_4 = require("../internal");
var createExpandsString = Common.createExpandsString;
var parseTournamentOptions = internal_1.ITournament.parseOptions;
var parseEventOptions = internal_2.IEvent.parseOptions;
var parsePhaseOptions = internal_3.IPhase.parseOptions;
var parsePhaseGroupOptions = internal_4.IPhaseGroup.parseOptions;
var TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
var EVENT_URL = 'https://api.smash.gg/event/%s?%s';
var EVENT_TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s/event/%s?%s';
var PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
var PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';
function getTournamentData(tournamentId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var expands, url, data, _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    options = parseTournamentOptions(options);
                    expands = createExpandsString(options.expands);
                    url = util_1.format(TOURNAMENT_URL, tournamentId, expands);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, request_promise_1.default(url)];
                case 1:
                    data = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, data];
                case 2:
                    err_1 = _c.sent();
                    console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
                    Logger_1.default.error('Event error: %s', err_1.message);
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getTournamentData = getTournamentData;
function getEventData(eventId, tournamentId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var expands, url, data, _a, _b, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    options = parseEventOptions(options);
                    expands = createExpandsString(options.expands);
                    url = util_1.format(EVENT_TOURNAMENT_URL, tournamentId, eventId, expands);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, request_promise_1.default(url)];
                case 1:
                    data = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, data];
                case 2:
                    err_2 = _c.sent();
                    console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
                    Logger_1.default.error('Event error: %s', err_2.message);
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getEventData = getEventData;
function getEventDataById(eventId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var expands, url, data, _a, _b, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    options = parseEventOptions(options);
                    expands = createExpandsString(options.expands);
                    url = util_1.format(EVENT_URL, eventId, expands);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, request_promise_1.default(url)];
                case 1:
                    data = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, data];
                case 2:
                    err_3 = _c.sent();
                    console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
                    Logger_1.default.error('Event error: %s', err_3.message);
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getEventDataById = getEventDataById;
function getPhase(phaseId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var expands, url, data, _a, _b, err_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    options = parsePhaseOptions(options);
                    expands = createExpandsString(options.expands);
                    url = util_1.format(PHASE_URL, phaseId, expands);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, request_promise_1.default(url)];
                case 1:
                    data = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, data];
                case 2:
                    err_4 = _c.sent();
                    console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
                    Logger_1.default.error('Event error: %s', err_4.message);
                    throw err_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getPhase = getPhase;
function getPhaseGroup(phaseGroupId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var expands, url, data, _a, _b, err_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    options = parsePhaseGroupOptions(options);
                    expands = createExpandsString(options.expands);
                    url = util_1.format(PHASE_GROUP_URL, phaseGroupId, expands);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, request_promise_1.default(url)];
                case 1:
                    data = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, data];
                case 2:
                    err_5 = _c.sent();
                    console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
                    Logger_1.default.error('Event error: %s', err_5.message);
                    throw err_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getPhaseGroup = getPhaseGroup;
