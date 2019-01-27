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
var sinon_1 = __importDefault(require("sinon"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
var internal_1 = require("../lib/internal");
var Cache_1 = __importDefault(require("../lib/util/Cache"));
var phaseGroup1;
var phaseGroup2;
var phaseGroup3;
var phaseGroup4;
var ID1 = 0;
var ID2 = 44445;
var ID3 = 301994;
function loadPhaseGroup(id, options) {
    return new Promise(function (resolve, reject) {
        var PG = new internal_1.PhaseGroup(id, options);
        PG.on('ready', function () {
            resolve(PG);
        });
    });
}
describe('Smash GG Phase Group', function () {
    beforeEach(function () {
        Cache_1.default.flush();
    });
    it('should correctly load Phase Group data', function (done) {
        this.timeout(5000);
        phaseGroup3 = new internal_1.PhaseGroup(ID3, { rawEncoding: 'base64' });
        phaseGroup3.on('ready', done);
    });
    it('should implement the convenience methods correctly', function () {
        return __awaiter(this, void 0, void 0, function () {
            var cPhaseGroup3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, internal_1.PhaseGroup.getPhaseGroup(ID3, { rawEncoding: 'base64' })];
                    case 1:
                        cPhaseGroup3 = _a.sent();
                        expect(cPhaseGroup3.data).to.deep.equal(phaseGroup3.data);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly return the phase id', function (done) {
        var phaseId1 = phaseGroup3.getPhaseId();
        expect(phaseId1).to.be.equal(100046);
        done();
    });
    it('should get all entrants', function () {
        return __awaiter(this, void 0, void 0, function () {
            var players;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, phaseGroup3.getPlayers()];
                    case 1:
                        players = _a.sent();
                        expect(players.length).to.be.equal(15);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get all sets', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, phaseGroup3.getSets()];
                    case 1:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(27);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should get sets completed within x minutes ago', function () {
        return __awaiter(this, void 0, void 0, function () {
            var clock, sets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        clock = sinon_1.default.useFakeTimers(new Date('Sat Nov 11 2017 11:50:47 GMT-0500 (EST)'));
                        return [4 /*yield*/, phaseGroup3.getSetsXMinutesBack(5)];
                    case 1:
                        sets = _a.sent();
                        expect(sets.length).to.be.equal(4);
                        sets.forEach(function (set) {
                            expect(set).to.be.instanceof(internal_1.GGSet);
                        });
                        clock.restore();
                        return [2 /*return*/, true];
                }
            });
        });
    });
});
