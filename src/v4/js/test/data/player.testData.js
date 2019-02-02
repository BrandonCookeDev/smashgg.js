"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AttendeeData = __importStar(require("./attendee.testData"));
exports.player1Data = {
    "id": 1106474,
    "name": "MVG FOX | Mew2King",
    "eventId": 23596,
    "skill": 10,
    "participants": [AttendeeData.participant1Data]
};
exports.player2Data = {
    "id": 889002,
    "name": "OeS | NIX",
    "eventId": 23596,
    "skill": 8,
    "participants": [AttendeeData.participant2Data]
};
exports.player3Data = {
    "id": 1128945,
    "name": "bobby big ballz",
    "eventId": 23596,
    "skill": 6,
    "participants": [AttendeeData.participant3Data]
};
exports.entrant1 = {
    "entrant": exports.player1Data
};
exports.entrant2 = {
    "entrant": exports.player2Data
};
exports.entrant3 = {
    "entrant": exports.player3Data
};
