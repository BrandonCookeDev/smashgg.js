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
exports.phaseGroupSeeds = "query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){\n\tphaseGroup(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t\tpage: $page, \n\t\t\tperPage: $perPage, \n\t\t\tsortBy: $sortBy,\n\t\t\tfilter: $filter\n\t\t}){\n\t\t\t{pageInfo}\n\t\t\tnodes{\n\t\t\t\t" + Schema.seeds + "\n\t\t\t}\n\t\t}\n\t}\n}";
exports.phaseGroupSeedStandings = "query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $orderBy: String, $filter: SeedPageFilter){\n\tphaseGroup(id: $id){\n\t\tpaginatedSeeds(query: {\t\t\t\n\t\t\tpage: $page, \n\t\t\tperPage: $perPage, \n\t\t\tsortBy: $sortBy,\n\t\t\tfilter: $filter\n\t\t}){\n\t\t\t{pageInfo}\n\t\t\tnodes{\n\t\t\t\tstandings{\n\t\t\t\t\t" + Schema.standings + "\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}";
exports.phaseGroupSets = "query PhaseGroupEntrants($id: Int, $page: Int, $perPage: Int, $sortType: SetSortType, $filters: SetFilters){\n\tphaseGroup(id: $id){\n\t  paginatedSets(page:$page, perPage:$perPage, sortType:$sortType, filters:$filters){\n\t\t{pageInfo}\n\t\tnodes{\n\t\t\t" + Schema.set + "\n\t\t}\n\t  }\n\t}\n  }";
exports.phaseGroupEntrants = "query PhaseGroupEntrants($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){\n\tphaseGroup(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t\tpage: $page,\n\t\t\tperPage: $perPage,\n\t\t\tsortBy: $sortBy,\n\t\t\tfilter: $filter\n\t\t}){\n\t\t\t{pageInfo}\n\t\t\tnodes{\n\t\t\t\tentrant{\n\t\t\t\t\t" + Schema.entrant + "\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\t\n}";
exports.phaseGroupAttendees = "query PhaseGroupEntrants($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){\n\tphaseGroup(id: $id){\n\t\tpaginatedSeeds(query: {\n\t\t\tpage: $page,\n\t\t\tperPage: $perPage,\n\t\t\tsortBy: $sortBy,\n\t\t\tfilter: $filter\n\t\t}){\n\t\t\t{pageInfo}\n\t\t\tnodes{\n\t\t\t\tentrant{\n\t\t\t\t\tparticipants{\n\t\t\t\t\t\t" + Schema.attendee + "\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\t\n}";
