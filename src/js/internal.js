"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var T = __importStar(require("./Tournament"));
var E = __importStar(require("./Event"));
var P = __importStar(require("./Phase"));
var PG = __importStar(require("./PhaseGroup"));
module.exports = {
    Tournament: T,
    Event: E,
    Phase: P,
    PhaseGroup: PG
};
