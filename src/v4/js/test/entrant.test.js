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
var Entrant_1 = require("../lib/Entrant");
var Attendee_1 = require("../lib/Attendee");
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var testData = __importStar(require("./data/player.testData"));
var player1, player2, player3;
describe('smashgg Player (Entrant) Singles', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                    case 1:
                        _a.sent();
                        player1 = Entrant_1.Entrant.parse(testData.player1Data);
                        player2 = Entrant_1.Entrant.parse(testData.player2Data);
                        player3 = Entrant_1.Entrant.parse(testData.player3Data);
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // id
    it('should get the correct Player (smash.gg Entrant) Id 1', function () {
        chai_1.expect(player1.getId()).to.be.equal(testData.player1Data.id);
    });
    it('should get the correct Player (smash.gg Entrant) Id 2', function () {
        chai_1.expect(player2.getId()).to.be.equal(testData.player2Data.id);
    });
    it('should get the correct Player (smash.gg Entrant) Id 3', function () {
        chai_1.expect(player3.getId()).to.be.equal(testData.player3Data.id);
    });
    // name
    it('should get the correct Player name 1', function () {
        chai_1.expect(player1.getName()).to.be.equal(testData.player1Data.name);
    });
    it('should get the correct Player name 2', function () {
        chai_1.expect(player2.getName()).to.be.equal(testData.player2Data.name);
    });
    it('should get the correct Player name 3', function () {
        chai_1.expect(player3.getName()).to.be.equal(testData.player3Data.name);
    });
    // eventId
    it('should get the correct Event ID of the Player 1', function () {
        chai_1.expect(player1.getEventId()).to.be.equal(testData.player1Data.eventId);
    });
    it('should get the correct Event ID of the Player 2', function () {
        chai_1.expect(player2.getEventId()).to.be.equal(testData.player2Data.eventId);
    });
    it('should get the correct Event ID of the Player 3', function () {
        chai_1.expect(player3.getEventId()).to.be.equal(testData.player3Data.eventId);
    });
    // skill
    it('should get the correct Player skill 1', function () {
        chai_1.expect(player1.getSkill()).to.be.equal(testData.player1Data.skill);
    });
    it('should get the correct Player skill 2', function () {
        chai_1.expect(player1.getSkill()).to.be.equal(testData.player1Data.skill);
    });
    it('should get the correct Player skill 3', function () {
        chai_1.expect(player3.getSkill()).to.be.equal(testData.player3Data.skill);
    });
    // attendee data
    it('should get the correct Player Attendee (smash.gg Participant) object 1', function () {
        chai_1.expect(player1.getAttendeeData()).to.deep.equal(Attendee_1.Attendee.parse(testData.player1Data.participants[0]));
    });
    it('should get the correct Player Attendee (smash.gg Participant) object 2', function () {
        chai_1.expect(player2.getAttendeeData()).to.deep.equal(Attendee_1.Attendee.parse(testData.player2Data.participants[0]));
    });
    it('should get the correct Player Attendee (smash.gg Participant) object 3', function () {
        chai_1.expect(player3.getAttendeeData()).to.deep.equal(Attendee_1.Attendee.parse(testData.player3Data.participants[0]));
    });
    // attendee id
    it('should get the correct Player Attendee (smash.gg Participant) id 1', function () {
        chai_1.expect(player1.getAttendeeId()).to.be.equal(testData.player1Data.participants[0].id);
    });
    it('should get the correct Player Attendee (smash.gg Participant) id 2', function () {
        chai_1.expect(player2.getAttendeeId()).to.be.equal(testData.player2Data.participants[0].id);
    });
    it('should get the correct Player Attendee (smash.gg Participant) id 3', function () {
        chai_1.expect(player3.getAttendeeId()).to.be.equal(testData.player3Data.participants[0].id);
    });
    // gamer tag
    it('should get the correct Player Attendee (smash.gg Participant) gamer tag 1', function () {
        chai_1.expect(player1.getGamerTag()).to.be.equal(testData.player1Data.participants[0].gamerTag);
    });
    it('should get the correct Player Attendee (smash.gg Participant) gamer tag 2', function () {
        chai_1.expect(player2.getGamerTag()).to.be.equal(testData.player2Data.participants[0].gamerTag);
    });
    it('should get the correct Player Attendee (smash.gg Participant) gamer tag 3', function () {
        chai_1.expect(player3.getGamerTag()).to.be.equal(testData.player3Data.participants[0].gamerTag);
    });
    // sponsor
    it('should get the correct Player Attendee (smash.gg Participant) sponsor 1', function () {
        chai_1.expect(player1.getSponsor()).to.be.equal(testData.player1Data.participants[0].prefix);
    });
    it('should get the correct Player Attendee (smash.gg Participant) sponsor 2', function () {
        chai_1.expect(player2.getSponsor()).to.be.equal(testData.player2Data.participants[0].prefix);
    });
    it('should get the correct Player Attendee (smash.gg Participant) sponsor 3', function () {
        chai_1.expect(player3.getSponsor()).to.be.equal(testData.player3Data.participants[0].prefix);
    });
    // phone number
    it('should get the correct Player Attendee (smash.gg Participant) phone number 1', function () {
        chai_1.expect(player1.getPhoneNumber()).to.be.equal(testData.player1Data.participants[0].phoneNumber);
    });
    it('should get the correct Player Attendee (smash.gg Participant) phone number 2', function () {
        chai_1.expect(player2.getPhoneNumber()).to.be.equal(testData.player2Data.participants[0].phoneNumber);
    });
    it('should get the correct Player Attendee (smash.gg Participant) phone number 3', function () {
        chai_1.expect(player3.getPhoneNumber()).to.be.equal(testData.player3Data.participants[0].phoneNumber);
    });
    // contact info
    it('should get the correct Player Attendee (smash.gg Participant) contact info 1', function () {
        chai_1.expect(player1.getContactInfo()).to.deep.equal(testData.player1Data.participants[0].contactInfo);
    });
    it('should get the correct Player Attendee (smash.gg Participant) contact info 2', function () {
        chai_1.expect(player1.getContactInfo()).to.deep.equal(testData.player1Data.participants[0].contactInfo);
    });
    it('should get the correct Player Attendee (smash.gg Participant) contact info 3', function () {
        chai_1.expect(player1.getContactInfo()).to.deep.equal(testData.player1Data.participants[0].contactInfo);
    });
    // city
    it('should get the correct Player Attendee (smash.gg Participant) city 1', function () {
        chai_1.expect(player1.getCity()).to.be.equal(testData.player1Data.participants[0].contactInfo.city);
    });
    it('should get the correct Player Attendee (smash.gg Participant) city 2', function () {
        chai_1.expect(player2.getCity()).to.be.equal(testData.player2Data.participants[0].contactInfo.city);
    });
    it('should get the correct Player Attendee (smash.gg Participant) city 3', function () {
        chai_1.expect(player3.getCity()).to.be.equal(testData.player3Data.participants[0].contactInfo.city);
    });
    // state 
    it('should get the correct Player Attendee (smash.gg Participant) state 1', function () {
        chai_1.expect(player1.getState()).to.be.equal(testData.player1Data.participants[0].contactInfo.state);
    });
    it('should get the correct Player Attendee (smash.gg Participant) state 2', function () {
        chai_1.expect(player2.getState()).to.be.equal(testData.player2Data.participants[0].contactInfo.state);
    });
    it('should get the correct Player Attendee (smash.gg Participant) state 3', function () {
        chai_1.expect(player3.getState()).to.be.equal(testData.player3Data.participants[0].contactInfo.state);
    });
    // state id
    it('should get the correct Player Attendee (smash.gg Participant) state id 1', function () {
        chai_1.expect(player1.getStateId()).to.be.equal(testData.player1Data.participants[0].contactInfo.stateId);
    });
    it('should get the correct Player Attendee (smash.gg Participant) state id 2', function () {
        chai_1.expect(player2.getStateId()).to.be.equal(testData.player2Data.participants[0].contactInfo.stateId);
    });
    it('should get the correct Player Attendee (smash.gg Participant) state id 3', function () {
        chai_1.expect(player3.getStateId()).to.be.equal(testData.player3Data.participants[0].contactInfo.stateId);
    });
    // country
    it('should get the correct Player Attendee (smash.gg Participant) country 1', function () {
        chai_1.expect(player1.getCountry()).to.be.equal(testData.player1Data.participants[0].contactInfo.country);
    });
    it('should get the correct Player Attendee (smash.gg Participant) country 2', function () {
        chai_1.expect(player2.getCountry()).to.be.equal(testData.player2Data.participants[0].contactInfo.country);
    });
    it('should get the correct Player Attendee (smash.gg Participant) country 3', function () {
        chai_1.expect(player3.getCountry()).to.be.equal(testData.player3Data.participants[0].contactInfo.country);
    });
    // country id
    it('should get the correct Player Attendee (smash.gg Participant) country id 1', function () {
        chai_1.expect(player1.getStateId()).to.be.equal(testData.player1Data.participants[0].contactInfo.countryId);
    });
    it('should get the correct Player Attendee (smash.gg Participant) country id 2', function () {
        chai_1.expect(player2.getStateId()).to.be.equal(testData.player2Data.participants[0].contactInfo.countryId);
    });
    it('should get the correct Player Attendee (smash.gg Participant) country id 3', function () {
        chai_1.expect(player3.getStateId()).to.be.equal(testData.player3Data.participants[0].contactInfo.countryId);
    });
    // contact name
    it('should get the correct Player Attendee (smash.gg Participant) contact name 1', function () {
        chai_1.expect(player1.getContactName()).to.be.equal(testData.player1Data.participants[0].contactInfo.name);
    });
    it('should get the correct Player Attendee (smash.gg Participant) contact name 2', function () {
        chai_1.expect(player2.getContactName()).to.be.equal(testData.player2Data.participants[0].contactInfo.name);
    });
    it('should get the correct Player Attendee (smash.gg Participant) contact name 3', function () {
        chai_1.expect(player3.getContactName()).to.be.equal(testData.player3Data.participants[0].contactInfo.name);
    });
    // first name
    it('should get the correct Player Attendee (smash.gg Participant) first name 1', function () {
        chai_1.expect(player1.getFirstName()).to.be.equal(testData.player1Data.participants[0].contactInfo.nameFirst);
    });
    it('should get the correct Player Attendee (smash.gg Participant) first name 2', function () {
        chai_1.expect(player2.getFirstName()).to.be.equal(testData.player2Data.participants[0].contactInfo.nameFirst);
    });
    it('should get the correct Player Attendee (smash.gg Participant) first name 3', function () {
        chai_1.expect(player3.getFirstName()).to.be.equal(testData.player3Data.participants[0].contactInfo.nameFirst);
    });
    // last name
    it('should get the correct Player Attendee (smash.gg Participant) last name 1', function () {
        chai_1.expect(player1.getLastName()).to.be.equal(testData.player1Data.participants[0].contactInfo.nameLast);
    });
    it('should get the correct Player Attendee (smash.gg Participant) last name 2', function () {
        chai_1.expect(player2.getLastName()).to.be.equal(testData.player2Data.participants[0].contactInfo.nameLast);
    });
    it('should get the correct Player Attendee (smash.gg Participant) last name 3', function () {
        chai_1.expect(player3.getLastName()).to.be.equal(testData.player3Data.participants[0].contactInfo.nameLast);
    });
    // zipcode
    it('should get the correct Player Attendee (smash.gg Participant) zipcode 1', function () {
        chai_1.expect(player1.getZipcode()).to.be.equal(testData.player1Data.participants[0].contactInfo.zipcode);
    });
    it('should get the correct Player Attendee (smash.gg Participant) zipcode 2', function () {
        chai_1.expect(player2.getZipcode()).to.be.equal(testData.player2Data.participants[0].contactInfo.zipcode);
    });
    it('should get the correct Player Attendee (smash.gg Participant) zipcode 3', function () {
        chai_1.expect(player3.getZipcode()).to.be.equal(testData.player3Data.participants[0].contactInfo.zipcode);
    });
    // connected accounts
    it('should get the correct Player Attendee (smash.gg Participant) id', function () {
        chai_1.expect(player1.getConnectedAccounts()).to.be.equal(testData.player1Data.participants[0].connectedAccounts);
    });
});
/*
describe('smashgg Player (Entrant) Doubles', function(){
    before(async function(){
        //player1 = Player.parse(testData.player1Data)
        //player2 = Player.parse(testData.player2Data)
        //player3 = Player.parse(testData.player3Data)
        return true;
    })
})
*/ 
