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
/* eslint-disable */
require("../lib/util/ErrorHandler");
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
var internal_1 = require("../lib/internal");
var Cache_1 = __importDefault(require("../lib/util/Cache"));
var testPlayers_1 = __importDefault(require("./data/testPlayers"));
var p1, p2, p3;
describe('Smash GG Player', function () {
    before(Cache_1.default.flush);
    it('should correctly load a player from raw data', function (done) {
        p1 = internal_1.Player.resolve(testPlayers_1.default.players[0]);
        p2 = internal_1.Player.resolve(testPlayers_1.default.players[1]);
        p3 = internal_1.Player.resolve(testPlayers_1.default.players[2]);
        expect(p1.id).to.be.equal(21568);
        expect(p2.id).to.be.equal(244170);
        expect(p3.id).to.be.equal(36490);
        expect(p1.tag).to.be.equal('Gas$');
        expect(p2.tag).to.be.equal('T');
        expect(p3.tag).to.be.equal('Kiwiwizard');
        expect(p1.name).to.be.equal('Grayson Garrett');
        expect(p2.name).to.be.equal('Trevor Greiff');
        expect(p3.name).to.be.equal('Davis Balser');
        expect(p1.country).to.be.equal('United States');
        expect(p2.country).to.be.equal('United States');
        expect(p3.country).to.be.equal('US');
        expect(p1.state).to.be.equal('GA');
        expect(p2.state).to.be.equal('TN');
        expect(p3.state).to.be.equal('GA');
        expect(p1.sponsor).to.be.equal('Test1');
        expect(p2.sponsor).to.be.equal('Test2');
        expect(p3.sponsor).to.be.equal('Test3');
        expect(p1.data).to.be.equal(testPlayers_1.default.players[0]);
        expect(p2.data).to.be.equal(testPlayers_1.default.players[1]);
        expect(p3.data).to.be.equal(testPlayers_1.default.players[2]);
        done();
    });
    it('should get player by id correctly', function () {
        return __awaiter(this, void 0, void 0, function () {
            var player1, player2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, internal_1.Player.getPlayer(61838)];
                    case 1:
                        player1 = _a.sent();
                        return [4 /*yield*/, internal_1.Player.getPlayer(61839)];
                    case 2:
                        player2 = _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    });
});
