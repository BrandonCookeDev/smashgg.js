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
exports.tournament = "query TournamentQuery($id:Int){\n    tournament(id: $id){\n        " + Schema.tournament + "\n    }\n}";
exports.tournamentBySlug = "query TournamentQuery($slug: String) {\n    tournament(slug: $slug){\n        " + Schema.tournament + "\n    }\n}";
exports.tournamentOrganizer = "query tournamentOrganizer($slug: String){\n    tournament(slug: $slug){\n        ownerId\n        contactEmail\n        contactTwitter\n        contactPhone\n        contactInfo\n    }   \n}";
exports.tournamentVenue = "query tournamentVenue($slug: String) {\n\ttournament(slug: $slug){\n\t\tvenueName\n\t\tvenueAddress\n\t\tcity\n\t\taddrState\n\t\tcountryCode\n\t}\t\n}";
exports.tournamentPlayers = "query TournamentParticipantQuery($slug: String) {\n    tournament(slug: $slug){\n        id\n        name\n        slug\n        participants(query: {\n            page: 0,\n            perPage: 10000,\n            sortBy: \"asc\",\n        },\n        isAdmin: false){\n            nodes{\n                id\n                playerId\n                gamerTag\n                prefix\n            }\n        }\n    }  \n}";
exports.tournamentPhases = "query TournamentPhases($slug: String){\n    tournament(slug: $slug){\n        id\n        name\n        slug\n        events{\n            id\n            name\n            slug\n            phases{\n                id\n                name\n                numSeeds\n                groupCount\n            }\n        }\n    }   \n}";
exports.tournamentPhaseGroups = "query TournamentPhaseGroups($slug: String){\n    tournament(slug: $slug){\n        id\n        name\n        slug\n        events{\n            id\n            name\n            slug\n            phaseGroups{\n                id\n                phaseId\n                waveId\n                state\n                firstRoundTime\n                displayIdentifier\n            }\n        }\n    }   \n}";
/** WARNING THIS DOES NOT WORK CURRENTLY DUE TO RECURSIVE LIMITATIONS, Use tournamentPhaseGroupIds instead **/
exports.tournamentSets = "query TournamentSets($slug: String){ \n    tournament(slug: $slug){\n        events{\n            phaseGroups{\n                sets{\n                    " + Schema.set + "\n                }\n            }\n        }\n    }   \n}";
exports.tournamentPhaseGroupIds = "query PhaseGroupIdQuery($slug: String) {\n    tournament(slug: $slug){\n        events{\n            id\n            phaseGroups{\n                id\n            }\n        }\n    }\n}";
