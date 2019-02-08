"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Constants */
var PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';
var LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
var DEFAULT_ENCODING = 'json';
var PhaseGroup = /** @class */ (function () {
    function PhaseGroup(id, phaseId, displayIdentifier, firstRoundTime, state, waveId, tiebreakOrder) {
        this.id = id;
        this.phaseId = phaseId;
        this.displayIdentifier = displayIdentifier;
        this.firstRoundTime = firstRoundTime;
        this.state = state;
        this.waveId = waveId;
        this.tiebreakOrder = tiebreakOrder;
    }
    PhaseGroup.parse = function (data) {
        return new PhaseGroup(data.id, data.phaseId, data.displayIdentifier, data.firstRoundTime, data.state, data.waveId, data.tiebreakOrder);
    };
    PhaseGroup.parseFull = function (data) {
        return data.event.phaseGroups.map(function (pg) { return PhaseGroup.parse(pg); });
    };
    PhaseGroup.prototype.getId = function () {
        return this.id;
    };
    PhaseGroup.prototype.getPhaseId = function () {
        return this.phaseId;
    };
    PhaseGroup.prototype.getDisplayIdentifier = function () {
        return this.displayIdentifier;
    };
    PhaseGroup.prototype.getFirstRoundTime = function () {
        return this.firstRoundTime;
    };
    PhaseGroup.prototype.getState = function () {
        return this.state;
    };
    PhaseGroup.prototype.getWaveId = function () {
        return this.waveId;
    };
    PhaseGroup.prototype.getTiebreakOrder = function () {
        return this.tiebreakOrder;
    };
    PhaseGroup.prototype.getEntrants = function () {
    };
    PhaseGroup.prototype.getSets = function () {
    };
    PhaseGroup.prototype.getCompleteSets = function () {
    };
    PhaseGroup.prototype.getIncompleteSets = function () {
    };
    PhaseGroup.prototype.getSetsXMinutesBack = function (minutes) {
    };
    PhaseGroup.prototype.findPlayerByParticipantId = function (id) {
    };
    return PhaseGroup;
}());
exports.PhaseGroup = PhaseGroup;
