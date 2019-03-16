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
var events_1 = require("events");
var util_1 = require("util");
var request_promise_1 = __importDefault(require("request-promise"));
var Cache_1 = __importDefault(require("./util/Cache"));
var Common_1 = require("./util/Common");
var Logger_1 = __importDefault(require("./util/Logger"));
var parseOptions = Common_1.ICommon.parseOptions;
var API_URL = 'https://api.smash.gg/player/%s';
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(id, tag, name, country, state, sponsor, participantId, data) {
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.tag = '';
        _this.name = '';
        _this.country = '';
        _this.state = '';
        _this.sponsor = '';
        _this.participantId = 0;
        if (!id)
            throw new Error('Player ID cannot be null');
        _this.id = id;
        _this.tag = tag;
        _this.name = name;
        _this.country = country;
        _this.state = state;
        _this.sponsor = sponsor;
        _this.participantId = participantId;
        _this.data = data;
        return _this;
    }
    Player.prototype.loadData = function (data) {
        this.data = data;
    };
    Player.getPlayer = function (id, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, req, resp, _a, _b, player, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        Logger_1.default.debug('Player getPlayer called');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('player::%s', id);
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
                        player = Player.resolveEntities(resp);
                        return [4 /*yield*/, Cache_1.default.set(cacheKey, player)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, player];
                    case 6:
                        e_1 = _c.sent();
                        Logger_1.default.error('Player getPlayer error: %s', e_1);
                        throw e_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Player.resolveEntities = function (player) {
        var data = player.entities.player;
        var P = new Player(+data.id, data.gamerTag, data.name, data.country, data.state, data.prefix);
        P.loadData(data);
        return P;
    };
    Player.resolve = function (data) {
        var playerId = 0;
        //for(let id in data.mutations.participants)
        //	participantId = id;
        for (var id in data.mutations.players)
            playerId = +id;
        var playerDetails = data.mutations.players[playerId];
        var P = new Player(playerId, playerDetails.gamerTag, playerDetails.name, playerDetails.country, playerDetails.state, playerDetails.prefix, data.id);
        P.loadData(data);
        return P;
    };
    /** SIMPLE GETTERS **/
    Player.prototype.getId = function () {
        return this.id;
    };
    Player.prototype.getTag = function () {
        return this.tag;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.getCountry = function () {
        return this.country;
    };
    Player.prototype.getState = function () {
        return this.state;
    };
    Player.prototype.getSponsor = function () {
        return this.sponsor;
    };
    Player.prototype.getParticipantId = function () {
        return this.participantId;
    };
    Player.prototype.getFinalPlacement = function () {
        if (this.data)
            return this.data.finalPlacement || this.nullValueString('Final Placement');
        else
            throw new Error('No data to get Player property Final Placement');
    };
    /** NULL VALUES **/
    Player.prototype.nullValueString = function (prop) {
        return prop + ' not available for Player ' + this.id;
    };
    return Player;
}(events_1.EventEmitter));
exports.Player = Player;
Player.prototype.toString = function () {
    return 'Player:' +
        '\nName: ' + this.name +
        '\nTag: ' + this.tag +
        '\nSponsor: ' + this.sponsor +
        '\nCountry: ' + this.country +
        '\nState: ' + this.state;
};
