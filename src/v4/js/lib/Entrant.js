"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** aka Entrant **/
var Attendee_1 = require("./Attendee"); // TODO later change this to internal
var Entrant = /** @class */ (function () {
    function Entrant(id, name, eventId, skill, attendeeData) {
        this.id = id;
        this.name = name;
        this.eventId = eventId;
        this.skill = skill;
        this.attendeeData = attendeeData;
    }
    Entrant.parse = function (data) {
        var attendeeData = data.participants.map(function (attendeeData) { return Attendee_1.Attendee.parse(attendeeData); });
        return new Entrant(data.id, data.name, data.eventId, data.skill, attendeeData);
    };
    Entrant.parseFull = function (data) {
        return Entrant.parse(data.entrant);
    };
    Entrant.prototype.getId = function () {
        return this.id;
    };
    Entrant.prototype.getName = function () {
        return this.name;
    };
    Entrant.prototype.getEventId = function () {
        return this.eventId;
    };
    Entrant.prototype.getSkill = function () {
        return this.skill;
    };
    Entrant.prototype.getAttendeeData = function () {
        return this.attendeeData;
    };
    Entrant.prototype.getAttendee = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position];
    };
    Entrant.prototype.getAttendeeId = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getId();
    };
    Entrant.prototype.getGamerTag = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getGamerTag();
    };
    Entrant.prototype.getSponsor = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getSponsor();
    };
    Entrant.prototype.getPhoneNumber = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getPhoneNumber();
    };
    Entrant.prototype.getContactInfo = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getContactInfo();
    };
    Entrant.prototype.getCity = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getCity();
    };
    Entrant.prototype.getState = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getState();
    };
    Entrant.prototype.getStateId = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getStateId();
    };
    Entrant.prototype.getCountry = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getCountry();
    };
    Entrant.prototype.getCountryId = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getCountryId();
    };
    Entrant.prototype.getContactName = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getContactName();
    };
    Entrant.prototype.getFirstName = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getFirstName();
    };
    Entrant.prototype.getLastName = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getLastName();
    };
    Entrant.prototype.getZipcode = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getZipcode();
    };
    Entrant.prototype.getConnectedAccounts = function (position) {
        if (position === void 0) { position = 0; }
        return this.attendeeData[position].getConnectedAccounts();
    };
    return Entrant;
}());
exports.Entrant = Entrant;
var IEntrant;
(function (IEntrant) {
    function getDefaultEntrantOptions() {
        return {
            page: 1,
            perPage: 1,
            sortBy: null,
            filter: null
        };
    }
    IEntrant.getDefaultEntrantOptions = getDefaultEntrantOptions;
})(IEntrant = exports.IEntrant || (exports.IEntrant = {}));
