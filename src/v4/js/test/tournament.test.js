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
var moment_1 = __importDefault(require("moment"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
var Tournament_1 = require("../lib/Tournament");
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var testData = __importStar(require("./data/tournament.testData"));
var tournament1, tournament2, tournament3;
var TOURNAMENT_ID_1 = 6620;
var TOURNAMENT_SLUG_1 = 'tournament/tipped-off-12-presented-by-the-lab-gaming-center';
var TOURNAMENT_ID_2 = 63515;
var TOURNAMENT_SLUG_2 = 'tournament/21xx-cameron-s-birthday-bash-1';
var TOURNAMENT_ID_3 = 1609;
var TOURNAMENT_SLUG_3 = 'tournament/ceo-2016';
describe('smashgg Tournament', function () {
    this.timeout(10000);
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var ti1, ti2, ti3, ts1, ts2, ts3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Tournament_1.Tournament.get(TOURNAMENT_ID_1)];
                    case 2:
                        ti1 = _a.sent();
                        return [4 /*yield*/, Tournament_1.Tournament.get(TOURNAMENT_ID_2)];
                    case 3:
                        ti2 = _a.sent();
                        return [4 /*yield*/, Tournament_1.Tournament.get(TOURNAMENT_ID_3)];
                    case 4:
                        ti3 = _a.sent();
                        return [4 /*yield*/, Tournament_1.Tournament.getBySlug(TOURNAMENT_SLUG_1)];
                    case 5:
                        ts1 = _a.sent();
                        return [4 /*yield*/, Tournament_1.Tournament.getBySlug(TOURNAMENT_SLUG_2)];
                    case 6:
                        ts2 = _a.sent();
                        return [4 /*yield*/, Tournament_1.Tournament.getBySlug(TOURNAMENT_SLUG_3)];
                    case 7:
                        ts3 = _a.sent();
                        expect(ti1).to.deep.equal(ts1);
                        expect(ti2).to.deep.equal(ts2);
                        expect(ti3).to.deep.equal(ts3);
                        tournament1 = ti1;
                        tournament2 = ti2;
                        tournament3 = ti3;
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // id
    it('should get the correct tournament id 1', function () {
        expect(tournament1.getId()).to.be.equal(testData.tournament1.id);
    });
    it('should get the correct tournament id 2', function () {
        expect(tournament2.getId()).to.be.equal(testData.tournament2.id);
    });
    it('should get the correct tournament id 3', function () {
        expect(tournament3.getId()).to.be.equal(testData.tournament3.id);
    });
    // name
    it('should get the correct tournament name 1', function () {
        expect(tournament1.getName()).to.be.equal(testData.tournament1.name);
    });
    it('should get the correct tournament name 2', function () {
        expect(tournament2.getName()).to.be.equal(testData.tournament2.name);
    });
    it('should get the correct tournament name 3', function () {
        expect(tournament3.getName()).to.be.equal(testData.tournament3.name);
    });
    // slug
    it('should get the correct tournament slug 1', function () {
        expect(tournament1.getSlug()).to.be.equal(testData.tournament1.slug);
    });
    it('should get the correct tournament slug 2', function () {
        expect(tournament2.getSlug()).to.be.equal(testData.tournament2.slug);
    });
    it('should get the correct tournament slug 3', function () {
        expect(tournament3.getSlug()).to.be.equal(testData.tournament3.slug);
    });
    // timezone
    it('should get the correct tournament timezone 1', function () {
        expect(tournament1.getTimezone()).to.be.equal(testData.tournament1.timezone);
    });
    it('should get the correct tournament timezone 2', function () {
        expect(tournament2.getTimezone()).to.be.equal(testData.tournament2.timezone);
    });
    it('should get the correct tournament timezone 3', function () {
        expect(tournament3.getTimezone()).to.be.equal(testData.tournament3.timezone);
    });
    // start time
    it('should get the correct tournament end time 1', function () {
        expect(moment_1.default(tournament1.getStartTime()).isSame(moment_1.default.unix(testData.tournament1.startAt).toDate())).to.be.true;
    });
    it('should get the correct tournament end time 2', function () {
        expect(moment_1.default(tournament2.getStartTime()).isSame(moment_1.default.unix(testData.tournament2.startAt).toDate())).to.be.true;
    });
    it('should get the correct tournament end time 3', function () {
        expect(moment_1.default(tournament3.getStartTime()).isSame(moment_1.default.unix(testData.tournament3.startAt).toDate())).to.be.true;
    });
    // start time string
    it('should get the correct tournament start time 1', function () {
        expect(tournament1.getStartTimeString()).to.be.equal(String(moment_1.default.unix(testData.tournament1.startAt).toDate()));
    });
    it('should get the correct tournament start time 2', function () {
        expect(tournament2.getStartTimeString()).to.be.equal(String(moment_1.default.unix(testData.tournament2.startAt).toDate()));
    });
    it('should get the correct tournament start time 3', function () {
        expect(tournament3.getStartTimeString()).to.be.equal(String(moment_1.default.unix(testData.tournament3.startAt).toDate()));
    });
    // end time
    it('should get the correct tournament end time 1', function () {
        expect(moment_1.default(tournament1.getEndTime()).isSame(moment_1.default.unix(testData.tournament1.endAt).toDate())).to.be.true;
    });
    it('should get the correct tournament end time 2', function () {
        expect(moment_1.default(tournament2.getEndTime()).isSame(moment_1.default.unix(testData.tournament2.endAt).toDate())).to.be.true;
    });
    it('should get the correct tournament end time 3', function () {
        expect(moment_1.default(tournament3.getEndTime()).isSame(moment_1.default.unix(testData.tournament3.endAt).toDate())).to.be.true;
    });
    // end time string
    it('should get the correct tournament end time 1', function () {
        expect(tournament1.getEndTimeString()).to.be.equal(String(moment_1.default.unix(testData.tournament1.endAt).toDate()));
    });
    it('should get the correct tournament end time 2', function () {
        expect(tournament2.getEndTimeString()).to.be.equal(String(moment_1.default.unix(testData.tournament2.endAt).toDate()));
    });
    it('should get the correct tournament end time 3', function () {
        expect(tournament3.getEndTimeString()).to.be.equal(String(moment_1.default.unix(testData.tournament3.endAt).toDate()));
    });
    // venue
    it('should get the correct tournament venue 1', function () {
        expect(tournament1.getVenue()).to.deep.equal(testData.venue1);
    });
    it('should get the correct tournament venue 2', function () {
        expect(tournament2.getVenue()).to.deep.equal(testData.venue2);
    });
    it('should get the correct tournament venue 3', function () {
        expect(tournament3.getVenue()).to.deep.equal(testData.venue3);
    });
    // venue name
    it('should get the correct tournament venue name 1', function () {
        expect(tournament1.getVenueName()).to.be.equal(testData.tournament1.venueName);
        expect(tournament1.getVenueName()).to.be.equal(testData.venue1.name);
    });
    it('should get the correct tournament venue name 2', function () {
        expect(tournament2.getVenueName()).to.be.equal(testData.tournament2.venueName);
        expect(tournament2.getVenueName()).to.be.equal(testData.venue2.name);
    });
    it('should get the correct tournament venue name 3', function () {
        expect(tournament3.getVenueName()).to.be.equal(testData.tournament3.venueName);
        expect(tournament3.getVenueName()).to.be.equal(testData.venue3.name);
    });
    // venue city
    it('should get the correct tournament venue city 1', function () {
        expect(tournament1.getCity()).to.be.equal(testData.tournament1.city);
        expect(tournament1.getCity()).to.be.equal(testData.venue1.city);
    });
    it('should get the correct tournament venue city 2', function () {
        expect(tournament2.getCity()).to.be.equal(testData.tournament2.city);
        expect(tournament2.getCity()).to.be.equal(testData.venue2.city);
    });
    it('should get the correct tournament venue city 3', function () {
        expect(tournament3.getCity()).to.be.equal(testData.tournament3.city);
        expect(tournament3.getCity()).to.be.equal(testData.venue3.city);
    });
    // address
    it('should get the correct tournament venue address 1', function () {
        expect(tournament1.getAddress()).to.be.equal(testData.tournament1.venueAddress);
        expect(tournament1.getAddress()).to.be.equal(testData.venue1.address);
    });
    it('should get the correct tournament venue address 2', function () {
        expect(tournament2.getAddress()).to.be.equal(testData.tournament2.venueAddress);
        expect(tournament2.getAddress()).to.be.equal(testData.venue2.address);
    });
    it('should get the correct tournament venue address 3', function () {
        expect(tournament3.getAddress()).to.be.equal(testData.tournament3.venueAddress);
        expect(tournament3.getAddress()).to.be.equal(testData.venue3.address);
    });
    // state
    it('should get the correct tournament venue state 1', function () {
        expect(tournament1.getState()).to.be.equal(testData.tournament1.addrState);
        expect(tournament1.getState()).to.be.equal(testData.venue1.state);
    });
    it('should get the correct tournament venue state 2', function () {
        expect(tournament2.getState()).to.be.equal(testData.tournament2.addrState);
        expect(tournament2.getState()).to.be.equal(testData.venue2.state);
    });
    it('should get the correct tournament venue state 3', function () {
        expect(tournament3.getState()).to.be.equal(testData.tournament3.addrState);
        expect(tournament3.getState()).to.be.equal(testData.venue3.state);
    });
    // zip code
    it('should get the correct tournament venue zip code 1', function () {
        expect(tournament1.getZipCode()).to.be.equal(testData.tournament1.postalCode);
        expect(tournament1.getZipCode()).to.be.equal(testData.venue1.postalCode);
    });
    it('should get the correct tournament venue zip code 2', function () {
        expect(tournament2.getZipCode()).to.be.equal(testData.tournament2.postalCode);
        expect(tournament2.getZipCode()).to.be.equal(testData.venue2.postalCode);
    });
    it('should get the correct tournament venue zip code 3', function () {
        expect(tournament3.getZipCode()).to.be.equal(testData.tournament3.postalCode);
        expect(tournament3.getZipCode()).to.be.equal(testData.venue3.postalCode);
    });
    // organizer
    it('should get the correct tournament organizer 1', function () {
        expect(tournament1.getOrganizer()).to.deep.equal(testData.organizer1);
    });
    it('should get the correct tournament organizer 2', function () {
        expect(tournament2.getOrganizer()).to.deep.equal(testData.organizer2);
    });
    it('should get the correct tournament organizer 3', function () {
        expect(tournament3.getOrganizer()).to.deep.equal(testData.organizer3);
    });
    // organizer id
    it('should get the correct tournament organizer id 1', function () {
        expect(tournament1.getOwnerId()).to.be.equal(testData.tournament1.ownerId);
        expect(tournament1.getOwnerId()).to.be.equal(testData.organizer1.id);
    });
    it('should get the correct tournament organizer id 2', function () {
        expect(tournament2.getOwnerId()).to.be.equal(testData.tournament2.ownerId);
        expect(tournament2.getOwnerId()).to.be.equal(testData.organizer2.id);
    });
    it('should get the correct tournament organizer id 3', function () {
        expect(tournament3.getOwnerId()).to.be.equal(testData.tournament3.ownerId);
        expect(tournament3.getOwnerId()).to.be.equal(testData.organizer3.id);
    });
    // organizer contact info
    it('should get the correct tournament organizer contact info 1', function () {
        expect(tournament1.getContactInfo()).to.be.equal(testData.tournament1.contactInfo);
        expect(tournament1.getContactInfo()).to.be.equal(testData.organizer1.info);
    });
    it('should get the correct tournament organizer contact info 2', function () {
        expect(tournament2.getContactInfo()).to.be.equal(testData.tournament2.contactInfo);
        expect(tournament2.getContactInfo()).to.be.equal(testData.organizer2.info);
    });
    it('should get the correct tournament organizer contact info 3', function () {
        expect(tournament3.getContactInfo()).to.be.equal(testData.tournament3.contactInfo);
        expect(tournament3.getContactInfo()).to.be.equal(testData.organizer3.info);
    });
    // organizer contact email
    it('should get the correct tournament organizer contact email 1', function () {
        expect(tournament1.getContactEmail()).to.be.equal(testData.tournament1.contactEmail);
        expect(tournament1.getContactEmail()).to.be.equal(testData.organizer1.email);
    });
    it('should get the correct tournament organizer contact email 2', function () {
        expect(tournament2.getContactEmail()).to.be.equal(testData.tournament2.contactEmail);
        expect(tournament2.getContactEmail()).to.be.equal(testData.organizer2.email);
    });
    it('should get the correct tournament organizer contact email 3', function () {
        expect(tournament3.getContactEmail()).to.be.equal(testData.tournament3.contactEmail);
        expect(tournament3.getContactEmail()).to.be.equal(testData.organizer3.email);
    });
    // organizer contact info
    it('should get the correct tournament organizer contact twitter 1', function () {
        expect(tournament1.getContactTwitter()).to.be.equal(testData.tournament1.contactTwitter);
        expect(tournament1.getContactTwitter()).to.be.equal(testData.organizer1.twitter);
    });
    it('should get the correct tournament organizer contact twitter 2', function () {
        expect(tournament2.getContactTwitter()).to.be.equal(testData.tournament2.contactTwitter);
        expect(tournament2.getContactTwitter()).to.be.equal(testData.organizer2.twitter);
    });
    it('should get the correct tournament organizer contact twitter 3', function () {
        expect(tournament3.getContactTwitter()).to.be.equal(testData.tournament3.contactTwitter);
        expect(tournament3.getContactTwitter()).to.be.equal(testData.organizer3.twitter);
    });
});
