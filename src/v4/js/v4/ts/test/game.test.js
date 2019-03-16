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
var path_1 = __importDefault(require("path"));
var ROOT = path_1.default.join(__dirname, '..', '..', '..', '..', '.env');
var dotenv_1 = require("dotenv");
dotenv_1.config({ path: ROOT });
require("../lib/util/ErrorHandler");
var chai_1 = require("chai");
var Game_1 = require("../lib/Game");
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var testData = __importStar(require("./data/games.testData"));
var games1, games2, games3;
var selections1, selections2, selections3;
describe('smash.gg Game', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                    case 1:
                        _a.sent();
                        games1 = Game_1.Game.parseFull(testData.games1Full);
                        games2 = Game_1.Game.parseFull(testData.games2Full);
                        games3 = Game_1.Game.parseFull(testData.games3Full);
                        selections1 = Game_1.Selections.parse(testData.selectionsS1G1P2);
                        selections2 = Game_1.Selections.parse(testData.selectionsS1G2P2);
                        selections3 = Game_1.Selections.parse(testData.selectionsS1G3P2);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // id
    it('should return the id of a game 1', function () {
        for (var i = 0; i < games1.length; i++) {
            var game = games1[i];
            chai_1.expect(game.getId()).to.be.equal(+testData.games1[i].id);
        }
    });
    it('should return the id of a game 2', function () {
        for (var i = 0; i < games2.length; i++) {
            var game = games2[i];
            chai_1.expect(game.getId()).to.be.equal(+testData.games2[i].id);
        }
    });
    it('should return the id of a game 3', function () {
        for (var i = 0; i < games3.length; i++) {
            var game = games3[i];
            chai_1.expect(game.getId()).to.be.equal(+testData.games3[i].id);
        }
    });
    // state
    it('should return the state of a game 1', function () {
        for (var i = 0; i < games1.length; i++) {
            var game = games1[i];
            chai_1.expect(game.getState()).to.be.equal(testData.games1[i].state);
        }
    });
    it('should return the state of a game 2', function () {
        for (var i = 0; i < games2.length; i++) {
            var game = games2[i];
            chai_1.expect(game.getState()).to.be.equal(testData.games2[i].state);
        }
    });
    it('should return the state of a game 3', function () {
        for (var i = 0; i < games3.length; i++) {
            var game = games3[i];
            chai_1.expect(game.getState()).to.be.equal(testData.games3[i].state);
        }
    });
    // winner id
    it('should return the winner id of a game 1', function () {
        for (var i = 0; i < games1.length; i++) {
            var game = games1[i];
            chai_1.expect(game.getWinnerId()).to.be.equal(testData.games1[i].winnerId);
        }
    });
    it('should return the winner id of a game 2', function () {
        for (var i = 0; i < games2.length; i++) {
            var game = games2[i];
            chai_1.expect(game.getWinnerId()).to.be.equal(testData.games2[i].winnerId);
        }
    });
    it('should return the winner id of a game 3', function () {
        for (var i = 0; i < games3.length; i++) {
            var game = games3[i];
            chai_1.expect(game.getWinnerId()).to.be.equal(testData.games3[i].winnerId);
        }
    });
    // order number
    it('should return the order number of a game 1', function () {
        for (var i = 0; i < games1.length; i++) {
            var game = games1[i];
            chai_1.expect(game.getOrderNumber()).to.be.equal(testData.games1[i].orderNum);
        }
    });
    it('should return the order number of a game 2', function () {
        for (var i = 0; i < games2.length; i++) {
            var game = games2[i];
            chai_1.expect(game.getOrderNumber()).to.be.equal(testData.games2[i].orderNum);
        }
    });
    it('should return the order number of a game 3', function () {
        for (var i = 0; i < games3.length; i++) {
            var game = games3[i];
            chai_1.expect(game.getOrderNumber()).to.be.equal(testData.games3[i].orderNum);
        }
    });
    // selections
    it('should return the correct array of selections 1', function () {
        for (var i = 0; i < games1.length; i++) {
            var game = games1[i];
            chai_1.expect(game.getSelections()).to.have.deep.members(Game_1.Selections.parseArray(testData.games1[i].selections));
        }
    });
    it('should return the correct array of selections 3', function () {
        for (var i = 0; i < games2.length; i++) {
            var game = games2[i];
            chai_1.expect(game.getSelections()).to.have.deep.members(Game_1.Selections.parseArray(testData.games2[i].selections));
        }
    });
    it('should return the correct array of selections 2', function () {
        for (var i = 0; i < games3.length; i++) {
            var game = games3[i];
            chai_1.expect(game.getSelections()).to.have.deep.members(Game_1.Selections.parseArray(testData.games3[i].selections));
        }
    });
    // selection by entrant id
    it('should return the correct selections for a given entrant id 1', function () {
        chai_1.expect(games1[0].getSelectionsForEntrantId(games1[0].getWinnerId())).to.deep.equal(selections1);
    });
    it('should return the correct selections for a given entrant id 1', function () {
        chai_1.expect(games1[0].getSelectionsForEntrantId(games1[1].getWinnerId())).to.deep.equal(selections2);
    });
    it('should return the correct selections for a given entrant id 1', function () {
        chai_1.expect(games1[0].getSelectionsForEntrantId(games1[2].getWinnerId())).to.deep.equal(selections3);
    });
    // selection type
    it('should return the correct selection type for a selection 1', function () {
        chai_1.expect(selections1.getSelectionType()).to.be.equal(testData.selectionsS1G1P2.selectionType);
    });
    it('should return the correct selection type for a selection 2', function () {
        chai_1.expect(selections2.getSelectionType()).to.be.equal(testData.selectionsS1G2P2.selectionType);
    });
    it('should return the correct selection type for a selection 3', function () {
        chai_1.expect(selections3.getSelectionType()).to.be.equal(testData.selectionsS1G3P2.selectionType);
    });
    // selection value
    it('should return the correct selection value for a selection 1', function () {
        chai_1.expect(selections1.getSelectionValue()).to.be.equal(testData.selectionsS1G1P2.selectionValue);
    });
    it('should return the correct selection value for a selection 2', function () {
        chai_1.expect(selections2.getSelectionValue()).to.be.equal(testData.selectionsS1G2P2.selectionValue);
    });
    it('should return the correct selection value for a selection 3', function () {
        chai_1.expect(selections3.getSelectionValue()).to.be.equal(testData.selectionsS1G3P2.selectionValue);
    });
    // entrant id
    it('should return the correct entrantId for a selection 1', function () {
        chai_1.expect(selections1.getEntrantId()).to.be.equal(testData.selectionsS1G1P2.entrantId);
    });
    it('should return the correct entrantId for a selection 2', function () {
        chai_1.expect(selections2.getEntrantId()).to.be.equal(testData.selectionsS1G2P2.entrantId);
    });
    it('should return the correct entrantId for a selection 3', function () {
        chai_1.expect(selections3.getEntrantId()).to.be.equal(testData.selectionsS1G3P2.entrantId);
    });
    // participant id
    it('should return the correct attendeeId for a selection 1', function () {
        chai_1.expect(selections1.getAttendeeId()).to.be.equal(testData.selectionsS1G1P2.participantId);
    });
    it('should return the correct attendeeId for a selection 2', function () {
        chai_1.expect(selections2.getAttendeeId()).to.be.equal(testData.selectionsS1G2P2.participantId);
    });
    it('should return the correct attendeeId for a selection 3', function () {
        chai_1.expect(selections3.getAttendeeId()).to.be.equal(testData.selectionsS1G3P2.participantId);
    });
});
