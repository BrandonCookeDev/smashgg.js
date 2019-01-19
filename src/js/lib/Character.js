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
var Logger_1 = __importDefault(require("./util/Logger"));
var request_promise_1 = __importDefault(require("request-promise"));
var util_1 = require("util");
var Cache_1 = __importDefault(require("./util/Cache"));
var VideoGame_1 = require("./VideoGame");
var Common_1 = require("./util/Common");
var parseOptions = Common_1.ICommon.parseOptions;
var API_URL = 'https://api.smash.gg/characters';
var Character = /** @class */ (function () {
    function Character(id, name, isCommon, videogameId) {
        this.id = 0;
        this.name = '';
        this.isCommon = true;
        this.videogameId = 1;
        this.id = id;
        this.name = name;
        this.isCommon = isCommon;
        this.videogameId = videogameId;
    }
    Character.prototype.getId = function () {
        return this.id;
    };
    Character.prototype.getName = function () {
        return this.name;
    };
    Character.prototype.getIsCommon = function () {
        return this.isCommon;
    };
    Character.prototype.getVideoGameId = function () {
        return this.videogameId;
    };
    Character.getAll = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, req, data, _a, _b, characters, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        Logger_1.default.debug('getAll called');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = 'character::all';
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _c.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _c.label = 3;
                    case 3:
                        req = {
                            uri: API_URL,
                            headers: {
                                'X-SOURCE': 'smashgg.js'
                            },
                            method: 'GET'
                        };
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, request_promise_1.default(req)];
                    case 4:
                        data = _b.apply(_a, [_c.sent()]);
                        characters = data.entities.character.map(function (e) {
                            return new Character(e.id, e.name, e.isCommon, e.videogameId);
                        });
                        if (!options.isCached) return [3 /*break*/, 6];
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, characters)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, characters];
                    case 7:
                        e_1 = _c.sent();
                        Logger_1.default.error('getAll error: %s', e_1);
                        throw e_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Character.getById = function (id, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, characters, match, character, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Character.getById called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('character::id::%s', id);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, Character.getAll(options)];
                    case 4:
                        characters = _a.sent();
                        match = characters.filter(function (e) { return e.id === id; });
                        character = match.length > 0 ? match[0] : undefined;
                        if (!options.isCached) return [3 /*break*/, 6];
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, characters)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, character];
                    case 7:
                        e_2 = _a.sent();
                        Logger_1.default.error('Character.getById error: %s', e_2);
                        throw e_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Character.getByGameId = function (id, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, characters, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Character.getByGameId called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('character::videogameId::%s', id);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, Character.getAll(options)];
                    case 4:
                        characters = _a.sent();
                        characters = characters.filter(function (e) { return e.videogameId === id; });
                        if (!options.isCached) return [3 /*break*/, 6];
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, characters)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, characters];
                    case 7:
                        e_3 = _a.sent();
                        Logger_1.default.error('Character.getByGameId error: %s', e_3);
                        throw e_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Character.getByGameName = function (name, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, videoGame, character, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Character.getByGameName called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('character::videgameName::%s', name);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, VideoGame_1.VideoGame.getByName(name, options)];
                    case 4:
                        videoGame = _a.sent();
                        if (!videoGame)
                            throw new Error('No game by the name ' + name);
                        return [4 /*yield*/, Character.getByGameId(videoGame.id, options)];
                    case 5:
                        character = _a.sent();
                        if (!options.isCached) return [3 /*break*/, 7];
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, character)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, character];
                    case 8:
                        e_4 = _a.sent();
                        Logger_1.default.error('Character.getByGameName error: %s', e_4);
                        throw e_4;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Character.getByName = function (name, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, characters, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Characters.getByName called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('characters::name::%s', name);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, Character.getAll(options)];
                    case 4:
                        characters = _a.sent();
                        characters = characters.filter(function (e) {
                            return e.name.toLowerCase() === name.toLowerCase();
                        });
                        if (!options.isCached) return [3 /*break*/, 6];
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, characters)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, characters];
                    case 7:
                        e_5 = _a.sent();
                        Logger_1.default.error('Characters.getByName error: %s', e_5);
                        throw e_5;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Character.getByNameAndGameId = function (name, videogameId, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, characters, match, character, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Character.getByNameAndGame called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        // parse options
                        options = parseOptions(options);
                        cacheKey = util_1.format('characters::name::%s::videogameId::%s', name, videogameId);
                        if (!options.isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, Character.getByName(name, options)];
                    case 4:
                        characters = _a.sent();
                        match = characters.filter(function (e) { return e.videogameId == videogameId; });
                        character = match.length > 0 ? match[0] : undefined;
                        if (!options.isCached) return [3 /*break*/, 6];
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, character)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, character];
                    case 7:
                        e_6 = _a.sent();
                        Logger_1.default.error('Character.getByNameAndGame error: %s', e_6);
                        throw e_6;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Character.getByNameAndGame = function (name, gameName, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isCached, cacheKey, cached, characters, videogame_1, match, character, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.debug('Character.getByNameAndGame called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        isCached = options.isCached != undefined ? options.isCached == true : true;
                        cacheKey = util_1.format('characters::name::%s::game::%s', name, gameName);
                        if (!isCached) return [3 /*break*/, 3];
                        return [4 /*yield*/, Cache_1.default.getInstance().get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, Character.getByName(name, options)];
                    case 4:
                        characters = _a.sent();
                        return [4 /*yield*/, VideoGame_1.VideoGame.getByName(gameName, options)];
                    case 5:
                        videogame_1 = _a.sent();
                        match = characters.filter(function (e) { return e.videogameId == videogame_1.id; });
                        character = match.length > 0 ? match[0] : undefined;
                        return [4 /*yield*/, Cache_1.default.getInstance().set(cacheKey, character)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, character];
                    case 7:
                        e_7 = _a.sent();
                        Logger_1.default.error('Character.getByNameAndGame error: %s', e_7);
                        throw e_7;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return Character;
}());
exports.Character = Character;
Character.prototype.toString = function () {
    return 'Character: ' +
        '\nName: ' + this.name +
        '\nID: ' + this.id +
        '\nVideoGame ID: ' + this.videogameId +
        '\nIs Common? ' + this.isCommon;
};
