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
var testSets_1 = __importDefault(require("./data/testSets"));
var pWinkledink, pAmarula, pWizzrobe, pBootyBlast, pVasculinity;
var set1, set2, set3;
describe('Smash GG Set', function () {
    before(function (done) {
        Cache_1.default.flush();
        var o1 = testSets_1.default.sets[0];
        pWinkledink = new internal_1.Player(o1.WinnerPlayer.id, o1.WinnerPlayer.tag, o1.WinnerPlayer.slug, o1.WinnerPlayer.country, o1.WinnerPlayer.region, o1.WinnerPlayer.sponsor, o1.WinnerPlayer.participantId, o1.WinnerPlayer.data);
        pAmarula = new internal_1.Player(o1.LoserPlayer.id, o1.LoserPlayer.tag, o1.LoserPlayer.slug, o1.LoserPlayer.country, o1.LoserPlayer.region, o1.LoserPlayer.sponsor, o1.LoserPlayer.participantId, o1.LoserPlayer.data);
        var o2 = testSets_1.default.sets[1];
        pWizzrobe = new internal_1.Player(o2.WinnerPlayer.id, o2.WinnerPlayer.tag, o2.WinnerPlayer.slug, o2.WinnerPlayer.country, o2.WinnerPlayer.region, o2.WinnerPlayer.sponsor, o2.WinnerPlayer.participantId, o2.WinnerPlayer.data);
        pWinkledink = new internal_1.Player(o2.LoserPlayer.id, o2.LoserPlayer.tag, o2.LoserPlayer.slug, o2.LoserPlayer.country, o2.LoserPlayer.region, o2.LoserPlayer.sponsor, o2.LoserPlayer.participantId, o2.LoserPlayer.data);
        var o3 = testSets_1.default.sets[2];
        pBootyBlast = new internal_1.Player(o3.WinnerPlayer.id, o3.WinnerPlayer.tag, o3.WinnerPlayer.slug, o3.WinnerPlayer.country, o3.WinnerPlayer.region, o3.WinnerPlayer.sponsor, o3.WinnerPlayer.participantId, o3.WinnerPlayer.data);
        pVasculinity = new internal_1.Player(o3.LoserPlayer.id, o3.LoserPlayer.tag, o3.LoserPlayer.slug, o3.LoserPlayer.country, o3.LoserPlayer.region, o3.LoserPlayer.sponsor, o3.LoserPlayer.participantId, o3.LoserPlayer.data);
        set1 = new internal_1.GGSet(o1.id, o1.eventId, o1.round, pWinkledink, pAmarula, true, 3, 2, pWinkledink.id, pAmarula.id, o1.data);
        set2 = new internal_1.GGSet(o2.id, o2.eventId, o2.round, pWizzrobe, pWinkledink, true, 2, 1, pWizzrobe.id, pWinkledink.id, o2.data);
        set3 = new internal_1.GGSet(o3.id, o3.eventId, o3.round, pBootyBlast, pVasculinity, true, 3, 1, pBootyBlast.id, pVasculinity.id, o3.data);
        done();
    });
    it('should get a set by id', function () {
        return __awaiter(this, void 0, void 0, function () {
            var set1, set2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, Set.getSet(15896650)];
                    case 1:
                        set1 = _a.sent();
                        return [4 /*yield*/, Set.getSet(15896651)];
                    case 2:
                        set2 = _a.sent();
                        expect(set1).to.be.instanceof(Set);
                        expect(set2).to.be.instanceof(Set);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should give the correct Winner', function (done) {
        expect(set1.getWinner()).to.deep.equal(pWinkledink);
        expect(set2.getWinner()).to.deep.equal(pWizzrobe);
        expect(set3.getWinner()).to.deep.equal(pBootyBlast);
        done();
    });
    it('should give the correct Loser', function (done) {
        expect(set1.getLoser()).to.deep.equal(pAmarula);
        expect(set2.getLoser()).to.deep.equal(pWinkledink);
        expect(set3.getLoser()).to.deep.equal(pVasculinity);
        done();
    });
    it('should give the correct round', function (done) {
        expect(set1.getRound()).to.be.equal('Winners Round 1');
        expect(set2.getRound()).to.be.equal('Winners Quarter-Final');
        expect(set3.getRound()).to.be.equal('Winners Quarter-Final');
        done();
    });
    it('should give the correct bestOf count', function (done) {
        expect(set1.getBestOfCount()).to.be.equal(3);
        expect(set2.getBestOfCount()).to.be.equal(3);
        expect(set3.getBestOfCount()).to.be.equal(3);
        done();
    });
    it('should give the correct Winner score', function (done) {
        expect(set1.getWinnerScore()).to.be.equal(2);
        expect(set2.getWinnerScore()).to.be.equal(2);
        expect(set3.getWinnerScore()).to.be.equal(2);
        done();
    });
    it('should give the correct Loser score', function (done) {
        expect(set1.getLoserScore()).to.be.equal(0);
        expect(set2.getLoserScore()).to.be.equal(0);
        expect(set3.getLoserScore()).to.be.equal(1);
        done();
    });
    it('should give the correct Bracket ID', function (done) {
        expect(set1.getBracketId()).to.be.equal('58df119c60fbb');
        expect(set2.getBracketId()).to.be.equal('58df119c60fbb');
        expect(set3.getBracketId()).to.be.equal('58df119c60fbb');
        done();
    });
    it('should give the correct Winners Tournament Placement', function (done) {
        expect(set1.getWinnersTournamentPlacement()).to.be.equal(set1.getWinner().data.finalPlacement);
        expect(set2.getWinnersTournamentPlacement()).to.be.equal(set2.getWinner().data.finalPlacement);
        expect(set3.getWinnersTournamentPlacement()).to.be.equal(set3.getWinner().data.finalPlacement);
        done();
    });
    it('should give the correct Losers Tournament Placement', function (done) {
        expect(set1.getLosersTournamentPlacement()).to.be.equal(set1.getLoser().data.finalPlacement);
        expect(set2.getLosersTournamentPlacement()).to.be.equal(set2.getLoser().data.finalPlacement);
        expect(set3.getLosersTournamentPlacement()).to.be.equal(set3.getLoser().data.finalPlacement);
        done();
    });
    it('should give the correct Phase Group ID', function (done) {
        expect(set1.getPhaseGroupId()).to.be.equal(327638);
        expect(set2.getPhaseGroupId()).to.be.equal(327638);
        expect(set3.getPhaseGroupId()).to.be.equal(327638);
        done();
    });
    it('should give the correct Midsize Round Text', function (done) {
        expect(set1.getMidsizeRoundText()).to.be.equal('Winners 1');
        expect(set2.getMidsizeRoundText()).to.be.equal('Winners Quarters');
        expect(set3.getMidsizeRoundText()).to.be.equal('Winners Quarters');
        done();
    });
});
