"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Seed = /** @class */ (function () {
    function Seed(id, entrantId, placeholderName, seedNumber, placement, isBye) {
        this.id = id;
        this.entrantId = entrantId;
        this.placeholderName = placeholderName;
        this.seedNumber = seedNumber;
        this.placement = placement;
        this.isBye = isBye;
    }
    Seed.parse = function (data) {
        return new Seed(data.id, data.entrantId, data.placeholderName, data.seedNumber, data.placement, data.isBye);
    };
    Seed.parseFull = function (data) {
        return data.seed.map(function (seedData) { return Seed.parse(seedData); });
    };
    return Seed;
}());
exports.Seed = Seed;
