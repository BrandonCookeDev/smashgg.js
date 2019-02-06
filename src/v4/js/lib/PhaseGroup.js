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
    return PhaseGroup;
}());
exports.PhaseGroup = PhaseGroup;
