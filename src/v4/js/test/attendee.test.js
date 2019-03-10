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
var chai_1 = require("chai");
var Attendee_1 = require("../lib/Attendee");
var User_1 = require("../lib/User");
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var testData = __importStar(require("./data/attendee.testData"));
var testUser = __importStar(require("./data/user.testData"));
var attendee1, attendee2, attendee3;
describe('smash.gg Attendee (Participant)', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                    case 1:
                        _a.sent();
                        attendee1 = Attendee_1.Attendee.parseFull(testData.attendee1Data);
                        attendee2 = Attendee_1.Attendee.parseFull(testData.attendee2Data);
                        attendee3 = Attendee_1.Attendee.parseFull(testData.attendee3Data);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // attendee id
    it('should get the correct attendee Attendee (smash.gg Participant) id 1', function () {
        chai_1.expect(attendee1.getId()).to.be.equal(testData.attendee1Data.participant.id);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) id 2', function () {
        chai_1.expect(attendee2.getId()).to.be.equal(testData.attendee2Data.participant.id);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) id 3', function () {
        chai_1.expect(attendee3.getId()).to.be.equal(testData.attendee3Data.participant.id);
    });
    // gamer tag
    it('should get the correct attendee Attendee (smash.gg Participant) gamer tag 1', function () {
        chai_1.expect(attendee1.getGamerTag()).to.be.equal(testData.attendee1Data.participant.gamerTag);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) gamer tag 2', function () {
        chai_1.expect(attendee2.getGamerTag()).to.be.equal(testData.attendee2Data.participant.gamerTag);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) gamer tag 3', function () {
        chai_1.expect(attendee3.getGamerTag()).to.be.equal(testData.attendee3Data.participant.gamerTag);
    });
    // sponsor
    it('should get the correct attendee Attendee (smash.gg Participant) sponsor 1', function () {
        chai_1.expect(attendee1.getSponsor()).to.be.equal(testData.attendee1Data.participant.prefix);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) sponsor 2', function () {
        chai_1.expect(attendee2.getSponsor()).to.be.equal(testData.attendee2Data.participant.prefix);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) sponsor 3', function () {
        chai_1.expect(attendee3.getSponsor()).to.be.equal(testData.attendee3Data.participant.prefix);
    });
    // phone number
    it('should get the correct attendee Attendee (smash.gg Participant) phone number 1', function () {
        chai_1.expect(attendee1.getPhoneNumber()).to.be.equal(testData.attendee1Data.participant.phoneNumber);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) phone number 2', function () {
        chai_1.expect(attendee2.getPhoneNumber()).to.be.equal(testData.attendee2Data.participant.phoneNumber);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) phone number 3', function () {
        chai_1.expect(attendee3.getPhoneNumber()).to.be.equal(testData.attendee3Data.participant.phoneNumber);
    });
    // contact info
    it('should get the correct attendee Attendee (smash.gg Participant) contact info 1', function () {
        chai_1.expect(attendee1.getContactInfo()).to.deep.equal(testData.attendee1Data.participant.contactInfo);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) contact info 2', function () {
        chai_1.expect(attendee1.getContactInfo()).to.deep.equal(testData.attendee1Data.participant.contactInfo);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) contact info 3', function () {
        chai_1.expect(attendee1.getContactInfo()).to.deep.equal(testData.attendee1Data.participant.contactInfo);
    });
    // city
    it('should get the correct attendee Attendee (smash.gg Participant) city 1', function () {
        chai_1.expect(attendee1.getCity()).to.be.equal(testData.attendee1Data.participant.contactInfo.city);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) city 2', function () {
        chai_1.expect(attendee2.getCity()).to.be.equal(testData.attendee2Data.participant.contactInfo.city);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) city 3', function () {
        chai_1.expect(attendee3.getCity()).to.be.equal(testData.attendee3Data.participant.contactInfo.city);
    });
    // state 
    it('should get the correct attendee Attendee (smash.gg Participant) state 1', function () {
        chai_1.expect(attendee1.getState()).to.be.equal(testData.attendee1Data.participant.contactInfo.state);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) state 2', function () {
        chai_1.expect(attendee2.getState()).to.be.equal(testData.attendee2Data.participant.contactInfo.state);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) state 3', function () {
        chai_1.expect(attendee3.getState()).to.be.equal(testData.attendee3Data.participant.contactInfo.state);
    });
    // state id
    it('should get the correct attendee Attendee (smash.gg Participant) state id 1', function () {
        chai_1.expect(attendee1.getStateId()).to.be.equal(testData.attendee1Data.participant.contactInfo.stateId);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) state id 2', function () {
        chai_1.expect(attendee2.getStateId()).to.be.equal(testData.attendee2Data.participant.contactInfo.stateId);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) state id 3', function () {
        chai_1.expect(attendee3.getStateId()).to.be.equal(testData.attendee3Data.participant.contactInfo.stateId);
    });
    // country
    it('should get the correct attendee Attendee (smash.gg Participant) country 1', function () {
        chai_1.expect(attendee1.getCountry()).to.be.equal(testData.attendee1Data.participant.contactInfo.country);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) country 2', function () {
        chai_1.expect(attendee2.getCountry()).to.be.equal(testData.attendee2Data.participant.contactInfo.country);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) country 3', function () {
        chai_1.expect(attendee3.getCountry()).to.be.equal(testData.attendee3Data.participant.contactInfo.country);
    });
    // country id
    it('should get the correct attendee Attendee (smash.gg Participant) country id 1', function () {
        chai_1.expect(attendee1.getStateId()).to.be.equal(testData.attendee1Data.participant.contactInfo.countryId);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) country id 2', function () {
        chai_1.expect(attendee2.getStateId()).to.be.equal(testData.attendee2Data.participant.contactInfo.countryId);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) country id 3', function () {
        chai_1.expect(attendee3.getStateId()).to.be.equal(testData.attendee3Data.participant.contactInfo.countryId);
    });
    // contact name
    it('should get the correct attendee Attendee (smash.gg Participant) contact name 1', function () {
        chai_1.expect(attendee1.getContactName()).to.be.equal(testData.attendee1Data.participant.contactInfo.name);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) contact name 2', function () {
        chai_1.expect(attendee2.getContactName()).to.be.equal(testData.attendee2Data.participant.contactInfo.name);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) contact name 3', function () {
        chai_1.expect(attendee3.getContactName()).to.be.equal(testData.attendee3Data.participant.contactInfo.name);
    });
    // first name
    it('should get the correct attendee Attendee (smash.gg Participant) first name 1', function () {
        chai_1.expect(attendee1.getFirstName()).to.be.equal(testData.attendee1Data.participant.contactInfo.nameFirst);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) first name 2', function () {
        chai_1.expect(attendee2.getFirstName()).to.be.equal(testData.attendee2Data.participant.contactInfo.nameFirst);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) first name 3', function () {
        chai_1.expect(attendee3.getFirstName()).to.be.equal(testData.attendee3Data.participant.contactInfo.nameFirst);
    });
    // last name
    it('should get the correct attendee Attendee (smash.gg Participant) last name 1', function () {
        chai_1.expect(attendee1.getLastName()).to.be.equal(testData.attendee1Data.participant.contactInfo.nameLast);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) last name 2', function () {
        chai_1.expect(attendee2.getLastName()).to.be.equal(testData.attendee2Data.participant.contactInfo.nameLast);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) last name 3', function () {
        chai_1.expect(attendee3.getLastName()).to.be.equal(testData.attendee3Data.participant.contactInfo.nameLast);
    });
    // zipcode
    it('should get the correct attendee Attendee (smash.gg Participant) zipcode 1', function () {
        chai_1.expect(attendee1.getZipcode()).to.be.equal(testData.attendee1Data.participant.contactInfo.zipcode);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) zipcode 2', function () {
        chai_1.expect(attendee2.getZipcode()).to.be.equal(testData.attendee2Data.participant.contactInfo.zipcode);
    });
    it('should get the correct attendee Attendee (smash.gg Participant) zipcode 3', function () {
        chai_1.expect(attendee3.getZipcode()).to.be.equal(testData.attendee3Data.participant.contactInfo.zipcode);
    });
    // events entered
    xit('should get the correct events the attendee entered 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
    xit('should get the correct events the attendee entered 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
    xit('should get the correct events the attendee entered 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
    // user account
    it('should get the correct user account for an attendee 1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, User_1.User.getById(attendee1.getPlayerId())];
                    case 1:
                        actual = _a.sent();
                        chai_1.expect(actual).to.deep.equal(User_1.User.parse(testUser.user4));
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should get the correct user account for an attendee 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, User_1.User.getById(attendee2.getPlayerId())];
                    case 1:
                        actual = _a.sent();
                        chai_1.expect(actual).to.deep.equal(User_1.User.parse(testUser.user5));
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should get the correct user account for an attendee 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, User_1.User.getById(attendee3.getPlayerId())];
                    case 1:
                        actual = _a.sent();
                        chai_1.expect(actual).to.deep.equal(User_1.User.parse(testUser.user6));
                        return [2 /*return*/];
                }
            });
        });
    });
});
