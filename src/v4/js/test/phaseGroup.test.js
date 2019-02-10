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
var lodash_1 = __importDefault(require("lodash"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
var PhaseGroup_1 = require("../lib/PhaseGroup");
var Entrant_1 = require("../lib/Entrant");
var GGSet_1 = require("../lib/GGSet");
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var testData = __importStar(require("./data/phaseGroup.testData"));
var log = __importStar(require("../lib/util/Logger"));
var phaseGroup1;
var phaseGroup2;
var phaseGroup3;
var phaseGroup4;
var ID1 = 301994;
var ID2 = 887918; // g6 melee doubles top 6
var ID3 = 44445;
var ID4 = 618443; // cameron's 21st, unfinished
var LOG_LEVEL = log.levels.VERBOSE;
describe('smash.gg PhaseGroup', function () {
    this.timeout(15000);
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.setLogLevel(LOG_LEVEL);
                        return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, PhaseGroup_1.PhaseGroup.get(ID1)];
                    case 2:
                        phaseGroup1 = _a.sent();
                        return [4 /*yield*/, PhaseGroup_1.PhaseGroup.get(ID2)];
                    case 3:
                        phaseGroup2 = _a.sent();
                        return [4 /*yield*/, PhaseGroup_1.PhaseGroup.get(ID3)];
                    case 4:
                        phaseGroup3 = _a.sent();
                        return [4 /*yield*/, PhaseGroup_1.PhaseGroup.get(ID4)];
                    case 5:
                        phaseGroup4 = _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // id
    it('should return the correct phase group id 1', function () {
        expect(phaseGroup1.getId()).to.be.equal(testData.pg1.id);
    });
    it('should return the correct phase group id 2', function () {
        expect(phaseGroup2.getId()).to.be.equal(testData.pg2.id);
    });
    it('should return the correct phase group id 3', function () {
        expect(phaseGroup3.getId()).to.be.equal(testData.pg3.id);
    });
    it('should return the correct phase group id 4', function () {
        expect(phaseGroup4.getId()).to.be.equal(testData.pg4.id);
    });
    // phase id
    it('should return the correct phase id 1', function () {
        expect(phaseGroup1.getPhaseId()).to.be.equal(testData.pg1.phaseId);
    });
    it('should return the correct phase id 2', function () {
        expect(phaseGroup2.getPhaseId()).to.be.equal(testData.pg2.phaseId);
    });
    it('should return the correct phase id 3', function () {
        expect(phaseGroup3.getPhaseId()).to.be.equal(testData.pg3.phaseId);
    });
    it('should return the correct phase id 4', function () {
        expect(phaseGroup4.getPhaseId()).to.be.equal(testData.pg4.phaseId);
    });
    // displayIdentifier
    it('should return the correct display identifier 1', function () {
        expect(phaseGroup1.getDisplayIdentifier()).to.be.equal(testData.pg1.displayIdentifier);
    });
    it('should return the correct display identifier 2', function () {
        expect(phaseGroup2.getDisplayIdentifier()).to.be.equal(testData.pg2.displayIdentifier);
    });
    it('should return the correct display identifier 3', function () {
        expect(phaseGroup3.getDisplayIdentifier()).to.be.equal(testData.pg3.displayIdentifier);
    });
    it('should return the correct display identifier 4', function () {
        expect(phaseGroup4.getDisplayIdentifier()).to.be.equal(testData.pg4.displayIdentifier);
    });
    // firstRoundTime
    it('should return the correct first round time 1', function () {
        expect(phaseGroup1.getFirstRoundTime()).to.be.equal(testData.pg1.firstRoundTime);
    });
    it('should return the correct first round time 2', function () {
        expect(phaseGroup2.getFirstRoundTime()).to.be.equal(testData.pg2.firstRoundTime);
    });
    it('should return the correct first round time 3', function () {
        expect(phaseGroup3.getFirstRoundTime()).to.be.equal(testData.pg3.firstRoundTime);
    });
    it('should return the correct first round time 4', function () {
        expect(phaseGroup4.getFirstRoundTime()).to.be.equal(testData.pg4.firstRoundTime);
    });
    // wave id
    it('should return the correct wave id 1', function () {
        expect(phaseGroup1.getWaveId()).to.be.equal(testData.pg1.waveId);
    });
    it('should return the correct wave id 2', function () {
        expect(phaseGroup2.getWaveId()).to.be.equal(testData.pg2.waveId);
    });
    it('should return the correct wave id 3', function () {
        expect(phaseGroup3.getWaveId()).to.be.equal(testData.pg3.waveId);
    });
    it('should return the correct wave id 4', function () {
        expect(phaseGroup4.getWaveId()).to.be.equal(testData.pg4.waveId);
    });
    // tiebreaker
    it('should return the correct tiebreaker order 1', function () {
        expect(phaseGroup1.getTiebreakOrder()).to.deep.equal(testData.pg1.tiebreakOrder);
    });
    it('should return the correct tiebreaker order 2', function () {
        expect(phaseGroup2.getTiebreakOrder()).to.deep.equal(testData.pg2.tiebreakOrder);
    });
    it('should return the correct tiebreaker order 3', function () {
        expect(phaseGroup3.getTiebreakOrder()).to.deep.equal(testData.pg3.tiebreakOrder);
    });
    it('should return the correct tiebreaker order 4', function () {
        expect(phaseGroup4.getTiebreakOrder()).to.deep.equal(testData.pg4.tiebreakOrder);
    });
    // entrants
    it('should return the correct entrants 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup1.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (entrant) {
                            expect(entrant).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(26);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should return the correct entrants 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup2.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (entrant) {
                            expect(entrant).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(12);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should return the correct entrants 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup3.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (entrant) {
                            expect(entrant).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(46);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should return the correct entrants 4', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup4.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (entrant) {
                            expect(entrant).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(75);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // set
    it('should return the correct Sets 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup1.getSets()];
                    case 1:
                        sets = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(GGSet_1.GGSet);
                        });
                        expect(sets.length).to.be.equal(42);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should return the correct Sets 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup2.getSets()];
                    case 1:
                        sets = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(GGSet_1.GGSet);
                        });
                        expect(sets.length).to.be.equal(14);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should return the correct Sets 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup3.getSets()];
                    case 1:
                        sets = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(GGSet_1.GGSet);
                        });
                        expect(sets.length).to.be.equal(70);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should return the correct Sets 4', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phaseGroup4.getSets()];
                    case 1:
                        sets = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(GGSet_1.GGSet);
                        });
                        expect(sets.length).to.be.equal(42);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    /*
    id: number
    phaseId: number
    displayIdentifier: string | null
    firstRoundTime: number | null
    state: number | null
    waveId: number | null
    tiebreakOrder: object | null

    /*
    it('should correctly return the phase id', function(){
        let phaseId1 = phaseGroup3.getPhaseId()
        expect(phaseId1).to.be.equal(100046)
    })

    it('should get all entrants', async function(){
        this.timeout(5000)

        let players = await phaseGroup3.getPlayers()
        expect(players.length).to.be.equal(15)
        return true
    })

    it('should get all sets', async function(){
        this.timeout(5000)

        let sets = await phaseGroup3.getSets()
        expect(sets.length).to.be.equal(27)
        return true
    })

    it('should get sets completed within x minutes ago', async function(){
        this.timeout(5000)

        let clock = sinon.useFakeTimers(new Date('Sat Nov 11 2017 11:50:47 GMT-0500 (EST)'))
        let sets = await phaseGroup3.getSetsXMinutesBack(5)

        expect(sets.length).to.be.equal(4)
        sets.forEach(set => {
            expect(set).to.be.instanceof(GGSet);
        })

        clock.restore()
        return true
    })
    */
});
