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
exports.phase = "\nquery PhaseQuery($id: Int){\n\tphase(id: $id){\n\t\t" + Schema.phase + "\n\t}\n}\n";
exports.phaseSeeds = "\nquery PhaseSeedQuery($id: Int){\n\tphase(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t\tpage: {page},\n\t\t\tperPage: {perPage},\n\t\t\tsortBy: {sortBy},\n\t\t\tfilters: {filters}\n\t\t}){\n\t\t\t{pageInfo}\n\t\t\tnodes{\n\t\t\t\t" + Schema.seeds + "\n\t\t\t}\n\t\t}\n\t}\t\n}";
exports.phasePhaseGroups = "\nquery PhaseGroupsQuery($eventId: Int){\n\tevent(id: $eventId){\n\t\tphaseGroup{\n\t\t\t" + Schema.phaseGroup + "\n\t\t}\n\t}\n}";
exports.phaseSets = "\nquery PhaseSets($eventId:Int, $phaseId: Int){\n\tevent(id: $eventId){\n\t  phaseGroups{\n\t\tpaginatedSets(\n\t\t  page: {page},\n\t\t  perPage: {perPage},\n\t\t  sortBy: {sortBy}\n\t\t  filters: {\n\t\t\tphaseIds:[$phaseId]\n\t\t  }\n\t\t){\n\t\t  {pageInfo}\n\t\t  nodes{\n\t\t\t" + Schema.set + "\n\t\t  }\n\t\t}\n\t  }\n\t}\n  }";
exports.phaseEntrants = "\nquery PhaseEntrants($id: Int){\n\tphase(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t  page: {page},\n\t\t  perPage: {perPage},\n\t\t  sortBy: {sortBy},\n\t\t  filters: {filters}\n\t\t}){\n\t\t  {pageInfo},\n\t\t  nodes{\n\t\t\t  entrant{\n\t\t\t\t  " + Schema.entrant + "\n\t\t\t  }\n\t\t  }\n\t\t}\n\t}\t\n}";
