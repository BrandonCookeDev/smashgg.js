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
exports.streamQueue = "query StreamQueueQuery($tournamentId: Int!, $includePlayerStreams: Boolean){\n\tstream{\n\t\t" + Schema.stream + "\n\t}\n\tsets{\n\t\t" + Schema.set + "\n\t}\n}";
