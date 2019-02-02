"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** aka Entrant **/
var Attendee_1 = require("./Attendee"); // TODO later change this to internal
var Player = /** @class */ (function () {
    function Player(id, name, eventId, skill, attendeeData) {
        this.id = id;
        this.name = name;
        this.eventId = eventId;
        this.skill = skill;
        this.attendeeData = attendeeData;
    }
    Player.parse = function (data) {
        var attendeeData = data.participants.map(function (attendeeData) { return Attendee_1.Attendee.parse(attendeeData); });
        if (attendeeData.length == 1)
            return new Player(data.id, data.name, data.eventId, data.skill, attendeeData[0]);
        else if (attendeeData.length > 1)
            return attendeeData.map(function (attendee) {
                return new Player(data.id, data.name, data.eventId, data.skill, attendee);
            });
        else
            throw new Error('No attendee data');
    };
    Player.parseFull = function (data) {
        return Player.parse(data.entrant);
    };
    Player.prototype.getId = function () {
        return this.id;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.getEventId = function () {
        return this.eventId;
    };
    Player.prototype.getSkill = function () {
        return this.skill;
    };
    Player.prototype.getAttendeeData = function () {
        return this.attendeeData;
    };
    Player.prototype.getAttendeeId = function () {
        return this.attendeeData.getId();
    };
    Player.prototype.getGamerTag = function () {
        return this.attendeeData.getGamerTag();
    };
    Player.prototype.getSponsor = function () {
        return this.attendeeData.getSponsor();
    };
    Player.prototype.getPhoneNumber = function () {
        return this.attendeeData.getPhoneNumber();
    };
    Player.prototype.getContactInfo = function () {
        return this.attendeeData.getContactInfo();
    };
    Player.prototype.getCity = function () {
        return this.attendeeData.getCity();
    };
    Player.prototype.getState = function () {
        return this.attendeeData.getState();
    };
    Player.prototype.getStateId = function () {
        return this.attendeeData.getStateId();
    };
    Player.prototype.getCountry = function () {
        return this.attendeeData.getCountry();
    };
    Player.prototype.getCountryId = function () {
        return this.attendeeData.getCountryId();
    };
    Player.prototype.getContactName = function () {
        return this.attendeeData.getContactName();
    };
    Player.prototype.getFirstName = function () {
        return this.attendeeData.getFirstName();
    };
    Player.prototype.getLastName = function () {
        return this.attendeeData.getLastName();
    };
    Player.prototype.getZipcode = function () {
        return this.attendeeData.getZipcode();
    };
    Player.prototype.getConnectedAccounts = function () {
        return this.attendeeData.getConnectedAccounts();
    };
    return Player;
}());
exports.Player = Player;
