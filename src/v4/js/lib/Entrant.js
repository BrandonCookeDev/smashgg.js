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
        if (attendeeData.length == 1)
            return new Entrant(data.id, data.name, data.eventId, data.skill, attendeeData[0]);
        else if (attendeeData.length > 1)
            return attendeeData.map(function (attendee) {
                return new Entrant(data.id, data.name, data.eventId, data.skill, attendee);
            });
        else
            throw new Error('No attendee data');
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
    Entrant.prototype.getAttendeeId = function () {
        return this.attendeeData.getId();
    };
    Entrant.prototype.getGamerTag = function () {
        return this.attendeeData.getGamerTag();
    };
    Entrant.prototype.getSponsor = function () {
        return this.attendeeData.getSponsor();
    };
    Entrant.prototype.getPhoneNumber = function () {
        return this.attendeeData.getPhoneNumber();
    };
    Entrant.prototype.getContactInfo = function () {
        return this.attendeeData.getContactInfo();
    };
    Entrant.prototype.getCity = function () {
        return this.attendeeData.getCity();
    };
    Entrant.prototype.getState = function () {
        return this.attendeeData.getState();
    };
    Entrant.prototype.getStateId = function () {
        return this.attendeeData.getStateId();
    };
    Entrant.prototype.getCountry = function () {
        return this.attendeeData.getCountry();
    };
    Entrant.prototype.getCountryId = function () {
        return this.attendeeData.getCountryId();
    };
    Entrant.prototype.getContactName = function () {
        return this.attendeeData.getContactName();
    };
    Entrant.prototype.getFirstName = function () {
        return this.attendeeData.getFirstName();
    };
    Entrant.prototype.getLastName = function () {
        return this.attendeeData.getLastName();
    };
    Entrant.prototype.getZipcode = function () {
        return this.attendeeData.getZipcode();
    };
    Entrant.prototype.getConnectedAccounts = function () {
        return this.attendeeData.getConnectedAccounts();
    };
    return Entrant;
}());
exports.Entrant = Entrant;
