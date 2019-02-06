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
exports.phaseGroup = "query PhaseGroupQuery($id: Int){\n\tphaseGroup(id: $id){\n\t\t" + Schema.phaseGroup + "\n\t}\n}";
exports.phaseGroupSeeds = "query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $orderBy: String){\n\tphaseGroup(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t\tpage: $page, $perPage: perPage, orderBy: $orderBy\n\t\t}){\n\t\t\tnodes{\n\t\t\t\t" + Schema.seeds + "\n\t\t\t}\n\t\t}\n\t}\n}";
exports.phaseGroupSeedStandings = "query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $orderBy: String){\n\tphaseGroup(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t\tpage: $page, $perPage: perPage, orderBy: $orderBy\n\t\t}){\n\t\t\tnodes{\n\t\t\t\tstandings: {\n\t\t\t\t\t" + Schema.standings + "\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}";
exports.phaseGroupSets = "query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $orderBy: String){\n\tphaseGroup(id: $id){\n\t\tpaginatedSets(query: {\n\t\t\tpage: $page, $perPage: perPage, orderBy: $orderBy\n\t\t}){\n\t\t\tnodes{\n\t\t\t\t" + Schema.set + "\n\t\t\t}\n\t\t}\n\t}\n}";
