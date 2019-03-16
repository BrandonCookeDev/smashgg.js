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
exports.set = "query SetQuery($id: String!){\n\tset(id:$id){\n\t\t" + Schema.set + "\n\t}\n}";
exports.games = "query SetQuery($id: String!){\n\tset(id:$id){\n\t\tgames{\n\t\t\t" + Schema.game + "\n\t\t}\n\t}\n}";
exports.entrants = "query SetParticipants($id: String!){\n\tset(id: $id){\n\t\tslots{\n\t\t\tentrant{\n\t\t\t\t" + Schema.entrant + "\n\t\t\t}\n\t\t}\n\t}\n}";
exports.attendees = "query SetParticipants($id: String!){\n\tset(id: $id){\n\t\tslots{\n\t\t\tentrant{\n\t\t\t\tparticipants{\n\t\t\t\t\t" + Schema.attendee + "\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}";
