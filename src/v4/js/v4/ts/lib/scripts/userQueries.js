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
exports.user = "query UserQuery($id: Int!) {\n\tplayer(id:$id){\n\t\t" + Schema.user + "\n\t}\n}";
exports.userRankings = "query UserRankings($id: Int!) {\n\tplayer(id:$id){\n\t\tid\n\t\trankings{\n\t\t\tid\n\t\t\ttitle\n\t\t\trank\n\t\t}\n\t}\n}";
exports.userRecentGGSets = "query UserRecentSets($id: Int!) {\n\tplayer(id:$id){\n\t\tid\n\t\trecentSets{\n      \t\t" + Schema.set + "     \n\t\t}\n\t}\n}";
