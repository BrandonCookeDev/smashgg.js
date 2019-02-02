"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = "query UserQuery($id: Int!) {\n\tplayer(id:$id){\n\t\tid\n\t\tgamerTag\n\t\tprefix\n\t\tcolor\n\t\ttwitchStream\n\t\ttwitterHandle\n\t\tyoutube\n\t\tregion\n\t\tstate\n\t\tcountry\n\t\tgamerTagChangedAt\n\t}\n}";
exports.userRankings = "query UserRankings($id: Int!) {\n\tplayer(id:$id){\n\t\tid\n\t\trankings{\n\t\t\tid\n\t\t\ttitle\n\t\t\trank\n\t\t}\n\t}\n}";
exports.userRecentGGSets = "query UserRecentSets($id: Int!) {\n\tplayer(id:$id){\n\t\tid\n\t\trecentSets{\n      \t\tid\n\t\t\tdisplayScore\n\t\t\tround\n\t\t\tfullRoundText\n\t\t\tcreatedAt\n\t\t\tcompletedAt\n\t\t\tstartedAt\n\t\t\tstate\n\t\t\ttotalGames\n\t\t\twinnerId\n\t\t\twPlacement\n\t\t\tlPlacement\n\t\t\tslots(includeByes:true){\n\t\t\t\tentrant{\n\t\t\t\tname\n\t\t\t\t}\n\t\t\t}      \n\t\t}\n\t}\n}";
