/* eslint-disable */
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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var expect = chai_1.default.expect;
var Character_1 = require("../lib/Character");
var Cache_1 = __importDefault(require("../lib/util/Cache"));
var MELEE_CHAR_COUNT = 27;
var PM_CHAR_COUNT = 42;
var BOWSER_ID = 1;
var MELEE_ID = 1;
var WOLF_ID = 116;
var PM_ID = 2;
describe('Smashgg Character', function () {
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Cache_1.default.getInstance().flushAll()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should get all characters', function () {
        return __awaiter(this, void 0, void 0, function () {
            var characters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Character_1.Character.getAll()];
                    case 1:
                        characters = _a.sent();
                        expect(characters.length > 0).to.be.true;
                        characters.forEach(function (character) {
                            expect(character).to.be.instanceof(Character_1.Character);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get a character by id number', function () {
        return __awaiter(this, void 0, void 0, function () {
            var bowser, wolf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Character_1.Character.getById(BOWSER_ID)];
                    case 1:
                        bowser = _a.sent();
                        return [4 /*yield*/, Character_1.Character.getById(WOLF_ID)];
                    case 2:
                        wolf = _a.sent();
                        expect(bowser).to.be.instanceof(Character_1.Character);
                        expect(wolf).to.be.instanceof(Character_1.Character);
                        expect(bowser.getName()).to.be.equal('Bowser');
                        expect(wolf.getName()).to.be.equal('Wolf');
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get all characters for a game by game id', function () {
        return __awaiter(this, void 0, void 0, function () {
            var meleeCharacters, pmCharacters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Character_1.Character.getByGameId(MELEE_ID)];
                    case 1:
                        meleeCharacters = _a.sent();
                        return [4 /*yield*/, Character_1.Character.getByGameId(PM_ID)];
                    case 2:
                        pmCharacters = _a.sent();
                        expect(meleeCharacters.length).to.be.equal(MELEE_CHAR_COUNT);
                        expect(pmCharacters.length).to.be.equal(PM_CHAR_COUNT);
                        meleeCharacters.forEach(function (character) {
                            expect(character).to.be.instanceof(Character_1.Character);
                        });
                        pmCharacters.forEach(function (character) {
                            expect(character).to.be.instanceof(Character_1.Character);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get all characters for a game by game name', function () {
        return __awaiter(this, void 0, void 0, function () {
            var meleeCharacters, pmCharacters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Character_1.Character.getByGameName('melee')];
                    case 1:
                        meleeCharacters = _a.sent();
                        return [4 /*yield*/, Character_1.Character.getByGameName('pm')];
                    case 2:
                        pmCharacters = _a.sent();
                        expect(meleeCharacters.length).to.be.equal(MELEE_CHAR_COUNT);
                        expect(pmCharacters.length).to.be.equal(PM_CHAR_COUNT);
                        meleeCharacters.forEach(function (character) {
                            expect(character).to.be.instanceof(Character_1.Character);
                        });
                        pmCharacters.forEach(function (character) {
                            expect(character).to.be.instanceof(Character_1.Character);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get characters by their name', function () {
        return __awaiter(this, void 0, void 0, function () {
            var bowser, wolf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Character_1.Character.getByName('bowser')];
                    case 1:
                        bowser = _a.sent();
                        return [4 /*yield*/, Character_1.Character.getByName('wolf')];
                    case 2:
                        wolf = _a.sent();
                        expect(bowser.length).to.be.equal(6);
                        expect(wolf.length).to.be.equal(2);
                        bowser.forEach(function (character) {
                            expect(character).to.be.instanceof(Character_1.Character);
                        });
                        wolf.forEach(function (character) {
                            expect(character).to.be.instanceof(Character_1.Character);
                        });
                        expect(bowser[0].id).to.be.equal(BOWSER_ID);
                        expect(bowser[0].videogameId).to.be.equal(MELEE_ID);
                        expect(wolf[0].id).to.be.equal(WOLF_ID);
                        expect(wolf[0].videogameId).to.be.equal(PM_ID);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get characters by their name and their game name', function () {
        return __awaiter(this, void 0, void 0, function () {
            var bowser, wolf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Character_1.Character.getByNameAndGame('bowser', 'melee')];
                    case 1:
                        bowser = _a.sent();
                        return [4 /*yield*/, Character_1.Character.getByNameAndGame('wolf', 'pm')];
                    case 2:
                        wolf = _a.sent();
                        expect(bowser).to.be.instanceof(Character_1.Character);
                        expect(wolf).to.be.instanceof(Character_1.Character);
                        expect(bowser.id).to.be.equal(BOWSER_ID);
                        expect(bowser.videogameId).to.be.equal(MELEE_ID);
                        expect(wolf.id).to.be.equal(WOLF_ID);
                        expect(wolf.videogameId).to.be.equal(PM_ID);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get characters by their name and their game id', function () {
        return __awaiter(this, void 0, void 0, function () {
            var bowser, wolf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(10000);
                        return [4 /*yield*/, Character_1.Character.getByNameAndGameId('bowser', MELEE_ID)];
                    case 1:
                        bowser = _a.sent();
                        return [4 /*yield*/, Character_1.Character.getByNameAndGameId('wolf', PM_ID)];
                    case 2:
                        wolf = _a.sent();
                        expect(bowser).to.be.instanceof(Character_1.Character);
                        expect(wolf).to.be.instanceof(Character_1.Character);
                        expect(bowser.id).to.be.equal(BOWSER_ID);
                        expect(bowser.videogameId).to.be.equal(MELEE_ID);
                        expect(wolf.id).to.be.equal(WOLF_ID);
                        expect(wolf.videogameId).to.be.equal(PM_ID);
                        return [2 /*return*/, true];
                }
            });
        });
    });
});
