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
/** aka Participant **/
var User_1 = require("./User"); // TODO change to internal later
var Logger_1 = __importDefault(require("./util/Logger"));
var Attendee = /** @class */ (function () {
    function Attendee(id, gamerTag, prefix, createdAt, claimed, verified, playerId, phoneNumber, connectedAccounts, contactInfo, eventIds) {
        this.id = id;
        this.gamerTag = gamerTag;
        this.prefix = prefix;
        this.createdAt = createdAt;
        this.claimed = claimed;
        this.verified = verified;
        this.playerId = playerId;
        this.phoneNumber = phoneNumber;
        this.contactInfo = contactInfo;
        this.connectedAccounts = connectedAccounts;
        this.eventIds = eventIds;
    }
    Attendee.parse = function (data) {
        var eventIds = data.events.map(function (event) { return event.id; });
        return new Attendee(data.id, data.gamerTag, data.prefix, data.createdAt, data.claimed, data.verified, data.playerId, data.phoneNumber, data.connectedAccounts, data.contactInfo, eventIds);
    };
    Attendee.parseFull = function (data) {
        return this.parse(data.participant);
    };
    Attendee.prototype.getId = function () {
        return this.id;
    };
    Attendee.prototype.getGamerTag = function () {
        return this.gamerTag;
    };
    Attendee.prototype.getSponsor = function () {
        return this.prefix;
    };
    Attendee.prototype.getCreatedAt = function () {
        return this.createdAt;
    };
    Attendee.prototype.getClaimed = function () {
        return this.claimed;
    };
    Attendee.prototype.getVerified = function () {
        return this.verified;
    };
    Attendee.prototype.getPlayerId = function () {
        return this.playerId;
    };
    Attendee.prototype.getPhoneNumber = function () {
        return this.phoneNumber;
    };
    Attendee.prototype.getContactInfo = function () {
        return this.contactInfo;
    };
    Attendee.prototype.getCity = function () {
        if (this.contactInfo)
            return this.contactInfo.city;
        else
            return null;
    };
    Attendee.prototype.getState = function () {
        if (this.contactInfo)
            return this.contactInfo.state;
        else
            return null;
    };
    Attendee.prototype.getStateId = function () {
        if (this.contactInfo)
            return this.contactInfo.stateId;
        else
            return null;
    };
    Attendee.prototype.getCountry = function () {
        if (this.contactInfo)
            return this.contactInfo.country;
        else
            return null;
    };
    Attendee.prototype.getCountryId = function () {
        if (this.contactInfo)
            return this.contactInfo.countryId;
        else
            return null;
    };
    Attendee.prototype.getContactName = function () {
        if (this.contactInfo)
            return this.contactInfo.name;
        else
            return null;
    };
    Attendee.prototype.getFirstName = function () {
        if (this.contactInfo)
            return this.contactInfo.nameFirst;
        else
            return null;
    };
    Attendee.prototype.getLastName = function () {
        if (this.contactInfo)
            return this.contactInfo.nameLast;
        else
            return null;
    };
    Attendee.prototype.getZipcode = function () {
        if (this.contactInfo)
            return this.contactInfo.zipcode;
        else
            return null;
    };
    Attendee.prototype.getConnectedAccounts = function () {
        return this.connectedAccounts;
    };
    /* TODO implement
    async getEvents() : Promise<Event[]> {
        Log.info('Getting Events that Attendee %s (Participant %s) entered', this.gamerTag, this.id);
        return Event.getByIds();
    }
    */
    Attendee.prototype.getUserAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting User account that Attendee %s (Participant %s) entered', this.gamerTag, this.playerId);
                        return [4 /*yield*/, User_1.User.getById(this.playerId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Attendee;
}());
exports.Attendee = Attendee;
