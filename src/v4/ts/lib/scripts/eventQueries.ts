import * as Schema from './schema'

export const event = `query EventQuery($id: Int){
    event(id:$id){   
        ${Schema.event}
    }
}`

export const eventSlug = `query EventQuery($slug:String){
    event(slug:$slug){
        ${Schema.event}
  	}
}`

export const eventPhases = `query EventPhases($id: Int){
    event(id: $id){
        phases{
            ${Schema.phase}
        }   
    }
}`

export const eventPhaseGroups = `query EventPhaseGroups($id: Int){
    event(id: $id){
        phaseGroups{
            ${Schema.phaseGroup}
        }
    }   
}`

export const eventSets = `query EventSets($id: Int, $page: Int, $perPage: Int, $hasPermissions: Boolean, $sortType: SetSortType, $filters: SetFilters){
    event(id: $id){
        phaseGroups{
            paginatedSets(
                page: $page,
                perPage: $perPage,
                sortType: $sortType,
                hasPermissions: $hasPermissions,
                filters: $filters
            ){
                {pageInfo}
                nodes{
                    ${Schema.set}
                }
            }
        }
    }   
}`

export const eventEntrants = `query EventSets($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: EventEntrantPageQueryFilter){
    event(id: $id){
        entrants(query: {
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            filter: $filter
        }){
            {pageInfo}
            nodes{
                ${Schema.entrant}
            }
        }
    }
}`

export const eventAttendees = `query EventAttendees($id: Int, $page: Int, $perPage: Int, $sortBy: String, $isAdmin: Boolean, $filter: ParticipantPageFilter){
    event(id: $id){
        tournament{
            participants(query: {
                page: $page,
                perPage: $perPage,
                sortBy: $sortBy,
                filter: $filter
            }, isAdmin: $isAdmin){
                {pageInfo}
                nodes{
                    ${Schema.attendee}
                }
            }
        }
    }
}`

export const eventAttendees2 = `query EventAttendees($id: Int, $page: Int, $perPage: Int, $sortBy: String, $filter: EventEntrantPageQueryFilter){
    event(id: $id){
        entrants(query: {
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            filter: $filter
        }){
            {pageInfo}
            nodes{
                participants{
                    ${Schema.attendee}
                }
            }
        }
    }
}`