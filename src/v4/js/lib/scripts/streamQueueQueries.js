"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Schema = __importStar(require("./schema"));
exports.streamQueue = "query StreamQueueQuery($tournamentId: ID!, $includePlayerStreams: Boolean){\n\tstreamQueue(tournamentId:$tournamentId, includePlayerStreams:$includePlayerStreams){\n\t\tstream{\n\t\t\t" + Schema.stream + "\n\t\t}\n\t\tsets{\n\t\t\t" + Schema.set + "\n\t\t}\n\t}\n}";
