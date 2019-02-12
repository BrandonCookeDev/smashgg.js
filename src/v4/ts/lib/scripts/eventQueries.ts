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

export const eventSets = `query EventSets($id: Int, $page: Int, $perPage: Int, $hasPermissions: boolean, $sortType: String, $filters: SetFilters){
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

export const eventEntrants = `query EventSets($id: Int, $page: Int, $perPage: Int, $hasPermissions: boolean, $sortBy: String, $filter: EventEntrantPageQueryFilter){
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

export const eventAttendees = `query EventSets($id: Int, $page: Int, $perPage: Int, $hasPermissions: boolean, $sortBy: String, $filter: EventEntrantPageQueryFilter){
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