"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var GGSet_1 = require("../../lib/GGSet");
var PlayerLite = GGSet_1.IGGSet.PlayerLite;
var gameData = __importStar(require("./games.testData"));
//11186682
exports.set1 = {
    "id": "11186682",
    "eventId": 23596,
    "phaseGroupId": 374033,
    "displayScore": "MVG FOX | Mew2King 3 - Ginger 0",
    "fullRoundText": "Winners Quarter-Final",
    "round": 2,
    "startedAt": null,
    "completedAt": 1510527738,
    "winnerId": 1106474,
    "totalGames": 5,
    "state": 3,
    "slots": [
        {
            "id": "11186682-0",
            "entrant": {
                "id": 1106474,
                "name": "MVG FOX | Mew2King",
                "participants": [
                    {
                        "id": 1148324
                    }
                ]
            }
        },
        {
            "id": "11186682-1",
            "entrant": {
                "id": 784069,
                "name": "Ginger",
                "participants": [
                    {
                        "id": 863946
                    }
                ]
            }
        }
    ]
};
exports.set2 = {
    "id": "11186683",
    "eventId": 23596,
    "phaseGroupId": 374033,
    "displayScore": "SS | Colbol 3 - Balance | Druggedfox 0",
    "fullRoundText": "Winners Quarter-Final",
    "round": 2,
    "startedAt": 1510527562,
    "completedAt": 1510527677,
    "winnerId": 1171874,
    "totalGames": 5,
    "state": 3,
    "slots": [
        {
            "id": "11186683-0",
            "entrant": {
                "id": 1171874,
                "name": "SS | Colbol",
                "participants": [
                    {
                        "id": 1207468
                    }
                ]
            }
        },
        {
            "id": "11186683-1",
            "entrant": {
                "id": 757871,
                "name": "Balance | Druggedfox",
                "participants": [
                    {
                        "id": 840037
                    }
                ]
            }
        }
    ]
};
exports.set3 = {
    "id": "8798920",
    "eventId": 28338,
    "phaseGroupId": 389114,
    "displayScore": "Balance | Druggedfox 3 - RNG | Swedish Delight 1",
    "fullRoundText": "Losers Final",
    "round": -12,
    "startedAt": 1498972858,
    "completedAt": 1499109168,
    "winnerId": 789171,
    "totalGames": 5,
    "state": 3,
    "slots": [
        {
            "id": "8798920-0",
            "entrant": {
                "id": 789171,
                "name": "Balance | Druggedfox",
                "participants": [
                    {
                        "id": 868742
                    }
                ]
            }
        },
        {
            "id": "8798920-1",
            "entrant": {
                "id": 767565,
                "name": "RNG | Swedish Delight",
                "participants": [
                    {
                        "id": 849572
                    }
                ]
            }
        }
    ]
};
exports.set1WithGames = {
    "set": {
        "games": gameData.games1
    }
};
exports.set2WithGames = {
    "set": {
        "games": gameData.games2
    }
};
exports.set3WithGames = {
    "set": {
        "games": gameData.games3
    }
};
exports.set1Full = {
    "set": exports.set1
};
exports.set2Full = {
    "set": exports.set2
};
exports.set3Full = {
    "set": exports.set3
};
exports.p1 = new PlayerLite('MVG FOX | Mew2King', 1106474, [1148324]);
exports.p2 = new PlayerLite('Ginger', 784069, [863946]);
exports.p3 = new PlayerLite('SS | Colbol', 1171874, [1207468]);
exports.p4 = new PlayerLite('Balance | Druggedfox', 757871, [840037]);
exports.p5 = new PlayerLite('Balance | Druggedfox', 789171, [868742]);
exports.p6 = new PlayerLite('RNG | Swedish Delight', 767565, [849572]);
exports.parsedDisplayScore1 = {
    tag1: 'MVG FOX | Mew2King',
    tag2: 'Ginger',
    score1: 3,
    score2: 0
};
exports.parsedDisplayScore2 = {
    tag1: 'SS | Colbol',
    tag2: 'Balance | Druggedfox',
    score1: 3,
    score2: 0
};
exports.parsedDisplayScore3 = {
    tag1: 'Balance | Druggedfox',
    tag2: 'RNG | Swedish Delight',
    score1: 3,
    score2: 1
};
