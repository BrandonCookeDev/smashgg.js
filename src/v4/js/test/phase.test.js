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
var log = __importStar(require("../lib/util/Logger"));
var lodash_1 = __importDefault(require("lodash"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
var Phase_1 = require("../lib/Phase");
var PhaseGroup_1 = require("../lib/PhaseGroup");
var GGSet_1 = require("../lib/GGSet");
var Entrant_1 = require("../lib/Entrant");
var Attendee_1 = require("../lib/Attendee");
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var testData = __importStar(require("./data/phase.testData"));
var LOG_LEVEL = log.levels.DEBUG;
var ID1 = 111483;
var ID2 = 45262;
var ID3 = 100046;
var EVENT_ID_1 = 25545;
var EVENT_ID_2 = 11787;
var EVENT_ID_3 = 23596;
var phase1;
var phase2;
var phase3;
var concurrency = 4;
describe('Smash GG Phase', function () {
    var _this = this;
    this.timeout(10000);
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log.setLogLevel(LOG_LEVEL);
                    return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Phase_1.Phase.get(ID1, EVENT_ID_1)];
                case 2:
                    phase1 = _a.sent();
                    return [4 /*yield*/, Phase_1.Phase.get(ID2, EVENT_ID_2)];
                case 3:
                    phase2 = _a.sent();
                    return [4 /*yield*/, Phase_1.Phase.get(ID3, EVENT_ID_3)];
                case 4:
                    phase3 = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // id
    it('should get the correct id of the Phase 1', function () {
        expect(phase1.getId()).to.be.equal(testData.phase1.id);
    });
    it('should get the correct id of the Phase 2', function () {
        expect(phase2.getId()).to.be.equal(testData.phase2.id);
    });
    it('should get the correct id of the Phase 3', function () {
        expect(phase3.getId()).to.be.equal(testData.phase3.id);
    });
    // name
    it('should get the name of the Phase 1', function () {
        expect(phase1.getName()).to.be.equal(testData.phase1.name);
    });
    it('should get the name of the Phase 2', function () {
        expect(phase2.getName()).to.be.equal(testData.phase2.name);
    });
    it('should get the name of the Phase 3', function () {
        expect(phase3.getName()).to.be.equal(testData.phase3.name);
    });
    // event id
    it('should get the event id 1', function () {
        expect(phase1.getEventId()).to.be.equal(EVENT_ID_1);
    });
    it('should get the event id 2', function () {
        expect(phase2.getEventId()).to.be.equal(EVENT_ID_2);
    });
    it('should get the event id 3', function () {
        expect(phase3.getEventId()).to.be.equal(EVENT_ID_3);
    });
    // num seeds
    it('should get the Phase num seeds 1', function () {
        expect(phase1.getNumSeeds()).to.be.equal(testData.phase1.numSeeds);
    });
    it('should get the Phase num seeds 2', function () {
        expect(phase2.getNumSeeds()).to.be.equal(testData.phase2.numSeeds);
    });
    it('should get the Phase num seeds 3', function () {
        expect(phase3.getNumSeeds()).to.be.equal(testData.phase3.numSeeds);
    });
    // group count
    it('should get the Phase group count 1', function () {
        expect(phase1.getGroupCount()).to.be.equal(testData.phase1.groupCount);
    });
    it('should get the Phase group count 2', function () {
        expect(phase2.getGroupCount()).to.be.equal(testData.phase2.groupCount);
    });
    it('should get the Phase group count 3', function () {
        expect(phase3.getGroupCount()).to.be.equal(testData.phase3.groupCount);
    });
    // sets
    it('should correctly get all sets 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(60000);
                        return [4 /*yield*/, phase1.getSets()];
                    case 1:
                        sets = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(GGSet_1.GGSet);
                        });
                        expect(sets.length).to.be.equal(152);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    xit('should correctly get all sets 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(120000);
                        return [4 /*yield*/, phase2.getSets()];
                    case 1:
                        sets = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(GGSet_1.GGSet);
                        });
                        expect(sets.length).to.be.equal(1164);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    xit('should correctly get all sets 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var sets, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(60000);
                        return [4 /*yield*/, phase2.getSets()];
                    case 1:
                        sets = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(sets)).to.be.false;
                        sets.forEach(function (set) {
                            expect(set).to.be.an.instanceof(GGSet_1.GGSet);
                        });
                        expect(sets.length).to.be.equal(1164);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // entrants
    it('should correctly get all entrants 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase1.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (set) {
                            expect(set).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(175);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    xit('should correctly get all entrants 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase2.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (set) {
                            expect(set).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(429);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all entrants 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var entrants, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase3.getEntrants()];
                    case 1:
                        entrants = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(entrants)).to.be.false;
                        entrants.forEach(function (set) {
                            expect(set).to.be.an.instanceof(Entrant_1.Entrant);
                        });
                        expect(entrants.length).to.be.equal(250);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // attendee
    it('should correctly get all attendees 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var attendee, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase1.getAttendees()];
                    case 1:
                        attendee = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(attendee)).to.be.false;
                        attendee.forEach(function (set) {
                            expect(set).to.be.an.instanceof(Attendee_1.Attendee);
                        });
                        expect(attendee.length).to.be.equal(175);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    xit('should correctly get all attendees 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var attendee, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase2.getAttendees()];
                    case 1:
                        attendee = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(attendee)).to.be.false;
                        attendee.forEach(function (set) {
                            expect(set).to.be.an.instanceof(Attendee_1.Attendee);
                        });
                        expect(attendee.length).to.be.equal(200);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all attendees 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var attendee, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase3.getAttendees()];
                    case 1:
                        attendee = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(attendee)).to.be.false;
                        attendee.forEach(function (set) {
                            expect(set).to.be.an.instanceof(Attendee_1.Attendee);
                        });
                        expect(attendee.length).to.be.equal(250);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // phase groups
    it('should correctly get all phase groups 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var groups, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase1.getPhaseGroups()];
                    case 1:
                        groups = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(groups)).to.be.false;
                        groups.forEach(function (set) {
                            expect(set).to.be.an.instanceof(PhaseGroup_1.PhaseGroup);
                        });
                        expect(groups.length).to.be.equal(16);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all phase groups 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var groups, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase2.getPhaseGroups()];
                    case 1:
                        groups = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(groups)).to.be.false;
                        groups.forEach(function (set) {
                            expect(set).to.be.an.instanceof(PhaseGroup_1.PhaseGroup);
                        });
                        expect(groups.length).to.be.equal(32);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    it('should correctly get all phase groups 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var groups, hasDuplicates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(30000);
                        return [4 /*yield*/, phase3.getPhaseGroups()];
                    case 1:
                        groups = _a.sent();
                        hasDuplicates = function (a) {
                            return lodash_1.default.uniq(a).length !== a.length;
                        };
                        expect(hasDuplicates(groups)).to.be.false;
                        groups.forEach(function (set) {
                            expect(set).to.be.an.instanceof(PhaseGroup_1.PhaseGroup);
                        });
                        expect(groups.length).to.be.equal(16);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    /*
    it('should correctly get all phase groups', async function(){
        this.timeout(45000)

        let phaseGroups1 = await phase1.getPhaseGroups({concurrency: concurrency});

        expect(phaseGroups1.length).to.be.equal(16);

        var hasDuplicates = function(a: Array<PhaseGroup>) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(phaseGroups1)).to.be.false;

        phaseGroups1.forEach(set => {
            expect(set).to.be.an.instanceof(PhaseGroup);
        });

        return true;
    });

    it('should correctly get all phase groups 2', async function(){
        this.timeout(45000);
        
        let phaseGroups2 = await phase2.getPhaseGroups({concurrency: concurrency});

        expect(phaseGroups2.length).to.be.equal(32);

        var hasDuplicates = function(a: Array<PhaseGroup>) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(phaseGroups2)).to.be.false;

        phaseGroups2.forEach(set => {
            expect(set).to.be.an.instanceof(PhaseGroup);
        });

        return true
    })

    it('should correctly get all phase groups 3', async function(){
        this.timeout(45000);
        
        let phaseGroups3 = await phase3.getPhaseGroups({concurrency: concurrency});

        expect(phaseGroups3.length).to.be.equal(16);

        var hasDuplicates = function(a: Array<PhaseGroup>) {
            return _.uniq(a).length !== a.length;
        };
        expect(hasDuplicates(phaseGroups3)).to.be.false;

        phaseGroups3.forEach(set => {
            expect(set).to.be.an.instanceof(PhaseGroup)
        })

        return true;
    })

    it('should correctly get all sets for a phase', async function(){
        this.timeout(30000)

        let sets1 = await phase1.getSets({concurrency: concurrency});

        expect(sets1.length).to.be.equal(248);

        sets1.forEach(set => {
            expect(set).to.be.instanceof(GGSet);
        })

        return true;
    })

    xit('should correctly get all sets for a phase 2', async function(){
        this.timeout(45000);
        
        let sets2 = await phase2.getSets({concurrency: concurrency});

        expect(sets2.length).to.be.equal(1292);

        sets2.forEach(set => {
            expect(set).to.be.instanceof(GGSet);
        })

        return true;
    })

    it('should correctly get all sets for a phase 3', async function(){
        this.timeout(45000);
        
        let sets3 = await phase3.getSets({concurrency: concurrency});

        expect(sets3.length).to.be.equal(450);

        sets3.forEach(set => {
            expect(set).to.be.instanceof(GGSet);
        })

        return true
    })

    it('should correctly get all players for a phase', async function(){
        this.timeout(30000)
        
        let players1 = await phase1.getPlayers({concurrency: concurrency});

        expect(players1.length).to.be.equal(156);

        players1.forEach(set => {
            expect(set).to.be.instanceof(Entrant)
        })

        return true;
    })

    it('should correctly get all players for a phase', async function(){
        this.timeout(30000);
        
        let players2 = await phase2.getPlayers({concurrency: concurrency});

        expect(players2.length).to.be.equal(678);

        players2.forEach(set => {
            expect(set).to.be.instanceof(Entrant)
        })

        return true
    })

    it('should correctly get sets x minutes back', async function(){
        this.timeout(30000)

        let minutesBack = 5;
        let event = await Event.getEventById(phase1.getEventId(), {});
        let eventDate = moment(event.getStartTime() as Date).add(30, 'minutes').toDate();

        let clock = sinon.useFakeTimers(eventDate)
        let sets = await phase1.getSetsXMinutesBack(minutesBack)
        expect(sets.length).to.be.equal(5)
        sets.forEach(set=> {
            expect(set).to.be.instanceof(GGSet);

            let now = moment();
            let then = moment(set.getCompletedAt() as Date);
            let diff = moment.duration(now.diff(then)).minutes();
            expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
        })
        clock.restore()
        return true
    })
    */
});
