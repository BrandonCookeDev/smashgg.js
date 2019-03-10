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
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_1 = __importDefault(require("request-promise"));
var util_1 = require("util");
var Cache_1 = __importDefault(require("./util/Cache"));
var Common_1 = require("./util/Common");
var Logger_1 = __importDefault(require("./util/Logger"));
var parseOptions = Common_1.ICommon.parseOptions;
var API_URL = 'https://api.smash.gg/public/videogames';
//const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
//const DEFAULT_ENCODING = 'json';
var VideoGame = /** @class */ (function () {
    function VideoGame(id, name, abbrev, displayName, minPerEntry, maxPerEntry, approved, slug, isCardGame) {
        this.id = 0;
        this.data = '';
        this.rawEncoding = 'json';
        this.id = id;
        this.name = name;
        this.abbrev = abbrev;
        this.displayName = displayName;
        this.minPerEntry = minPerEntry;
        this.maxPerEntry = maxPerEntry;
        this.approved = approved;
        this.slug = slug;
        this.isCardGame = isCardGame;
    }
    VideoGame.prototype.loadData = function (data, encoding) {
        var encoded = encoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(encoding);
        this.data = encoded;
        return encoded;
    };
    VideoGame.prototype.getData = function (data, encoding) {
        var decoded = this.rawEncoding == 'json' ? data : JSON.parse(new Buffer(data.toString(), encoding).toString('utf8'));
        return decoded;
    };
    VideoGame.prototype.getId = function () {
        return this.id;
    };
    VideoGame.prototype.getName = function () {
        return this.name;
    };
    VideoGame.prototype.getAbbreviation = function () {
        return this.abbrev;
    };
    VideoGame.prototype.getDisplayName = function () {
        return this.displayName;
    };
    VideoGame.prototype.getMinPerEntry = function () {
        return this.minPerEntry;
    };
    VideoGame.prototype.getMaxPerEntry = function () {
        return this.maxPerEntry;
    };
    VideoGame.prototype.getApproved = function () {
        return this.approved;
    };
    VideoGame.prototype.getSlug = function () {
        return this.slug;
    };
    VideoGame.prototype.getIsCardGame = function () {
        return this.isCardGame;
    };
    VideoGame.resolve = function (data) {
        var vg = new VideoGame(data.id, data.name, data.abbrev, data.displayName, data.minPerEntry, data.maxPerEntry, data.approved, data.slug, data.isCardGame);
        vg.loadData(data, 'json');
        return vg;
    };
    VideoGame.getAll = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, data, _a, _b, videoGames, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        Logger_1.default.debug('VideoGames getAll called');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = 'videoGames::all';
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _c.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _c.label = 3;
                    case 3:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, request_promise_1.default(API_URL)];
                    case 4:
                        data = _b.apply(_a, [_c.sent()]);
                        videoGames = data.entities.videogame.map(function (vg) { return VideoGame.resolve(vg); });
                        if (!options.isCached) return [3 /*break*/, 6];
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, videoGames)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, videoGames];
                    case 7:
                        e_1 = _c.sent();
                        Logger_1.default.error('VideoGames getAll error: %s', e_1);
                        throw e_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    VideoGame.getById = function (id, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, data, videoGames, videoGame, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('VideoGame getById called [%s]', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('VideoGame::id::%s', id);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, VideoGame.getAll(options)];
                    case 4:
                        data = _a.sent();
                        videoGames = data.filter(function (vg) { return vg.id === id; });
                        if (videoGames.length <= 0)
                            throw new Error('No video game with id ' + id);
                        videoGame = videoGames[0];
                        if (options.isCached)
                            Cache_1.default.getInstance().set(cacheKey, videoGame);
                        return [2 /*return*/, videoGame];
                    case 5:
                        e_2 = _a.sent();
                        Logger_1.default.error('VideoGame getById error: %s', e_2);
                        throw e_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VideoGame.getByName = function (name, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isCached, cacheKey, cached, data, videoGames, videoGame, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('VideoGame getByName called [%s]', name);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        isCached = options.isCached || true;
                        cacheKey = util_1.format('VideoGame::name::%s', name);
                        if (!isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, VideoGame.getAll()];
                    case 4:
                        data = _a.sent();
                        videoGames = data.filter(function (vg) {
                            return vg.name === name ||
                                vg.abbrev === name ||
                                vg.slug === name ||
                                vg.displayName === name;
                        });
                        if (videoGames.length <= 0)
                            throw new Error('No video game with name ' + name);
                        videoGame = videoGames[0];
                        if (isCached)
                            Cache_1.default.getInstance().set(cacheKey, videoGame);
                        return [2 /*return*/, videoGame];
                    case 5:
                        e_3 = _a.sent();
                        Logger_1.default.error('VideoGame getByName error: %s', e_3);
                        throw e_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return VideoGame;
}());
exports.VideoGame = VideoGame;
