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
exports.phaseSeeds = "\nquery PhaseSeedQuery($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){\n\tphase(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t\tpage: $page,\n\t\t\tperPage: $perPage,\n\t\t\tsortBy: $sortBy,\n\t\t\tfilter: $filter\n\t\t}){\n\t\t\t{pageInfo}\n\t\t\tnodes{\n\t\t\t\t" + Schema.seeds + "\n\t\t\t}\n\t\t}\n\t}\t\n}";
exports.phasePhaseGroups = "\nquery PhaseGroupsQuery($eventId: Int){\n\tevent(id: $eventId){\n\t\tphaseGroups{\n\t\t\t" + Schema.phaseGroup + "\n\t\t}\n\t}\n}";
exports.phaseSets = "\nquery PhaseSets($eventId:Int, $page: Int, $perPage: Int, $sortType: SetSortType, $filters: SetFilters, $hasPermissions: Boolean){\n\tevent(id: $eventId){\n\t  phaseGroups{\n\t\t\tpaginatedSets(\n\t\t\t\tpage: $page,\n\t\t\t\tperPage: $perPage,\n\t\t\t\tsortType: $sortType,\n\t\t\t\thasPermissions: $hasPermissions,\n\t\t\t\tfilters: $filters\n\t\t\t){\n\t\t\t\t{pageInfo}\n\t\t\t\tnodes{\n\t\t\t\t\t" + Schema.set + "\n\t\t\t\t}\n\t\t\t}\n\t  }\n\t}\n}";
exports.phaseEntrants = "\nquery PhaseEntrants($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){\n\tphase(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t  page: $page,\n\t\t  perPage: $perPage,\n\t\t  sortBy: $sortBy,\n\t\t  filter: $filter\n\t\t}){\n\t\t  {pageInfo},\n\t\t  nodes{\n\t\t\t  entrant{\n\t\t\t\t  " + Schema.entrant + "\n\t\t\t  }\n\t\t  }\n\t\t}\n\t}\t\n}";
exports.phaseAttendees = "\nquery PhaseAttendees($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){\n\tphase(id: $id){\n\t\tpaginatedSeeds(query:{\n\t\t  page: $page,\n\t\t  perPage: $perPage,\n\t\t  sortBy: $sortBy,\n\t\t  filter: $filter\n\t\t}){\n\t\t  {pageInfo},\n\t\t  nodes{\n\t\t\t  entrant{\n\t\t\t\t  participants{\n\t\t\t\t\t\t" + Schema.attendee + "\n\t\t\t\t\t}\n\t\t\t  }\n\t\t  }\n\t\t}\n\t}\t\n}";
