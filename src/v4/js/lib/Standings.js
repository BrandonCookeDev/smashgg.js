"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Standings = /** @class */ (function () {
    function Standings(id, placement, entrantId, userIds) {
        this.id = id;
        this.placement = placement;
        this.entrantId = entrantId;
    }
    return Standings;
}());
exports.Standings = Standings;
var StandingsStats = /** @class */ (function () {
    function StandingsStats(score) {
        this.score = score;
    }
    return StandingsStats;
}());
exports.StandingsStats = StandingsStats;
