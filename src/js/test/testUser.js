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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var User_1 = require("../lib/User");
var user1, user2, user3;
var USER_ID_1 = 159429; // Davemon
var USER_ID_2 = 34475; // Mike G
var USER_ID_3 = 7802; // j00t
var DAVEMON_RANKINGS = [
    {
        "id": 294398,
        "title": "Tennessee: Spring 2018",
        "rank": 2
    },
    {
        "id": 317143,
        "title": "Tennessee: Fall 2018",
        "rank": 2
    }
];
describe('smashgg User', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.getById(USER_ID_1)];
                    case 1:
                        user1 = _a.sent();
                        return [4 /*yield*/, User_1.User.getById(USER_ID_2)];
                    case 2:
                        user2 = _a.sent();
                        return [4 /*yield*/, User_1.User.getById(USER_ID_3)];
                    case 3:
                        user3 = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    // id
    it('should get the correct id 1', function () {
        chai_1.expect(user1.getId()).to.be.equal(USER_ID_1);
    });
    it('should get the correct id 2', function () {
        chai_1.expect(user2.getId()).to.be.equal(USER_ID_2);
    });
    it('should get the correct id 3', function () {
        chai_1.expect(user3.getId()).to.be.equal(USER_ID_3);
    });
    // gamertag
    it('should get the correct gamer tag 1', function () {
        chai_1.expect(user1.getGamerTag()).to.be.equal('Davemon');
    });
    it('should get the correct gamer tag 2', function () {
        chai_1.expect(user1.getGamerTag()).to.be.equal('Mike G');
    });
    it('should get the correct gamer tag 3', function () {
        chai_1.expect(user1.getGamerTag()).to.be.equal('j00t');
    });
    // prefix
    it('should get the correct sponsor 1', function () {
        chai_1.expect(user1.getSponsor()).to.be.equal('eski');
    });
    it('should get the correct sponsor 2', function () {
        chai_1.expect(user2.getSponsor()).to.be.equal('');
    });
    it('should get the correct sponsor 3', function () {
        chai_1.expect(user3.getSponsor()).to.be.null;
    });
    // color
    it('should get the correct color 1', function () {
        chai_1.expect(user1.getColor()).to.be.equal('#7185AD');
    });
    it('should get the correct color 2', function () {
        chai_1.expect(user2.getColor()).to.be.null;
    });
    it('should get the correct color 3', function () {
        chai_1.expect(user3.getColor()).to.be.null;
    });
    // twitch stream
    it('should get the correct twitch stream 1', function () {
        chai_1.expect(user1.getTwitchStream()).to.be.equal('xdavemon');
    });
    it('should get the correct twitch stream 2', function () {
        chai_1.expect(user2.getTwitchStream()).to.be.equal('mikegz');
    });
    it('should get the correct twitch stream 3', function () {
        chai_1.expect(user3.getTwitchStream()).to.be.null;
    });
    // twitter handle
    it('should get the correct twitter handle 1', function () {
        chai_1.expect(user1.getTwitterHandle()).to.be.equal('Davemonlol');
    });
    it('should get the correct twitter handle 2', function () {
        chai_1.expect(user2.getTwitterHandle()).to.be.equal('xMikeGeezy');
    });
    it('should get the correct twitter handle 3', function () {
        chai_1.expect(user3.getTwitterHandle()).to.be.null;
    });
    // youtube
    it('should get the correct youtube 1', function () {
        chai_1.expect(user1.getYoutube()).to.be.null;
    });
    it('should get the correct youtube 2', function () {
        chai_1.expect(user2.getYoutube()).to.be.null;
    });
    it('should get the correct youtube 3', function () {
        chai_1.expect(user3.getYoutube()).to.be.null;
    });
    // region 
    it('should get the correct region 1', function () {
        chai_1.expect(user1.getRegion()).to.be.null;
    });
    it('should get the correct region 2', function () {
        chai_1.expect(user2.getRegion()).to.be.null;
    });
    it('should get the correct region 3', function () {
        chai_1.expect(user3.getRegion()).to.be.null;
    });
    // state 
    it('should get the correct state 1', function () {
        chai_1.expect(user1.getState()).to.be.equal('TN');
    });
    it('should get the correct state 2', function () {
        chai_1.expect(user2.getState()).to.be.equal('GA');
    });
    it('should get the correct state 3', function () {
        chai_1.expect(user3.getState()).to.be.equal('AL');
    });
    // gamer tag last changed 
    it('should get the correct gamer tag changed at 1', function () {
        chai_1.expect(user1.getCountry()).to.be.null;
    });
    it('should get the correct gamer tag changed at 2', function () {
        chai_1.expect(user2.getCountry()).to.be.null;
    });
    it('should get the correct gamer tag changed at 3', function () {
        chai_1.expect(user3.getCountry()).to.be.null;
    });
    // rankings
    it('should get the correct rankings back 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                chai_1.expect(user1.getRankings).to.include.members(DAVEMON_RANKINGS);
                return [2 /*return*/];
            });
        });
    });
    it('should get the correct rankings back 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                chai_1.expect(user2.getRankings).to.be.null;
                return [2 /*return*/];
            });
        });
    });
    it('should get the correct rankings back 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                chai_1.expect(user3.getRankings).to.be.null;
                return [2 /*return*/];
            });
        });
    });
    // TODO implement
    // recent sets
    xit('should get the correct recent sets back 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
    xit('should get the correct recent sets back 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
    xit('should get the correct recent sets back 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
});
