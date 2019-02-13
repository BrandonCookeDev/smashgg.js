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
exports.event = "query EventQuery($id: Int){\n    event(id:$id){   \n        " + Schema.event + "\n    }\n}";
exports.eventSlug = "query EventQuery($slug:String){\n    event(slug:$slug){\n        " + Schema.event + "\n  \t}\n}";
exports.eventPhases = "query EventPhases($id: Int){\n    event(id: $id){\n        phases{\n            " + Schema.phase + "\n        }   \n    }\n}";
exports.eventPhaseGroups = "query EventPhaseGroups($id: Int){\n    event(id: $id){\n        phaseGroups{\n            " + Schema.phaseGroup + "\n        }\n    }   \n}";
exports.eventSets = "query EventSets($id: Int, $page: Int, $perPage: Int, $hasPermissions: Boolean, $sortType: SetSortType, $filters: SetFilters){\n    event(id: $id){\n        phaseGroups{\n            paginatedSets(\n                page: $page,\n                perPage: $perPage,\n                sortType: $sortType,\n                hasPermissions: $hasPermissions,\n                filters: $filters\n            ){\n                {pageInfo}\n                nodes{\n                    " + Schema.set + "\n                }\n            }\n        }\n    }   \n}";
exports.eventEntrants = "query EventSets($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: EventEntrantPageQueryFilter){\n    event(id: $id){\n        entrants(query: {\n            page: $page,\n            perPage: $perPage,\n            sortBy: $sortBy,\n            filter: $filter\n        }){\n            {pageInfo}\n            nodes{\n                " + Schema.entrant + "\n            }\n        }\n    }\n}";
exports.eventAttendees = "query EventSets($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: EventEntrantPageQueryFilter){\n    event(id: $id){\n        entrants(query: {\n            page: $page,\n            perPage: $perPage,\n            sortBy: $sortBy,\n            filter: $filter\n        }){\n            {pageInfo}\n            nodes{\n                participants{\n                    " + Schema.attendee + "\n                }\n            }\n        }\n    }\n}";
