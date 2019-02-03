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
