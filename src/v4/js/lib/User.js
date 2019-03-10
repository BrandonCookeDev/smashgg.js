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
/** aka User **/
var NetworkInterface_1 = __importDefault(require("./util/NetworkInterface"));
var GGSet_1 = require("./GGSet");
var Common = __importStar(require("./util/Common"));
var queries = __importStar(require("./scripts/userQueries"));
var Logger_1 = __importDefault(require("./util/Logger"));
var User = /** @class */ (function () {
    function User(id, gamerTag, prefix, color, twitchStream, twitterHandle, youtube, region, state, country, gamerTagChangedAt) {
        this.id = id;
        this.gamerTag = gamerTag;
        this.prefix = prefix;
        this.color = color;
        this.twitchStream = twitchStream;
        this.twitterHandle = twitterHandle;
        this.youtube = youtube;
        this.region = region;
        this.state = state;
        this.country = country;
        this.gamerTagChangedAt = gamerTagChangedAt;
    }
    User.parse = function (data) {
        return new User(data.id, data.gamerTag, data.prefix, data.color, data.twitchStream, data.twitterHandle, data.youtube, data.region, data.state, data.country, data.gamerTagChangedAt);
    };
    User.parseFull = function (data) {
        return User.parse(data.player);
    };
    User.getById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting User (smash.gg Player) with id %s', id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.user, { id: id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, User.parseFull(data)];
                }
            });
        });
    };
    User.prototype.getId = function () {
        return this.id;
    };
    User.prototype.getGamerTag = function () {
        return this.gamerTag;
    };
    User.prototype.getSponsor = function () {
        return this.prefix;
    };
    User.prototype.getColor = function () {
        return this.color;
    };
    User.prototype.getTwitchStream = function () {
        return this.twitchStream;
    };
    User.prototype.getTwitterHandle = function () {
        return this.twitterHandle;
    };
    User.prototype.getYoutube = function () {
        return this.youtube;
    };
    User.prototype.getRegion = function () {
        return this.region;
    };
    User.prototype.getState = function () {
        return this.state;
    };
    User.prototype.getCountry = function () {
        return this.country;
    };
    User.prototype.getGamerTagChangedAt = function () {
        return this.gamerTagChangedAt ? Common.convertEpochToDate(this.gamerTagChangedAt) : null;
    };
    User.prototype.getRecentSets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Sets for %s (User: %s)', this.gamerTag, this.id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.userRecentGGSets, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        sets = data.player.recentSets.map(function (setData) { return GGSet_1.GGSet.parse(setData); });
                        return [2 /*return*/, sets];
                }
            });
        });
    };
    User.prototype.getRankings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, rankings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Rankings for %s (User: %s)', this.gamerTag, this.id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.userRankings, { id: this.id })];
                    case 1:
                        data = _a.sent();
                        rankings = data.player.rankings;
                        return [2 /*return*/, rankings];
                }
            });
        });
    };
    return User;
}());
exports.User = User;
