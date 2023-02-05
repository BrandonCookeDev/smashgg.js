import * as Schema from './schema'
export const tournament = `query TournamentQuery($id: ID!){
    tournament(id: $id){
        ${Schema.tournament}
    }
}`
export const tournamentBySlug = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        ${Schema.tournament}
    }
}`

export const tournamentOrganizer = `query organizerQuery($slug: String!){
    tournament(slug: $slug){
        owner{
            ${Schema.organizer}
        }
    }
}
`

export const tournamentVenue = `query tournamentVenue($id: ID!){
    tournament(id: $id){
		${Schema.venue}
	}	
}`

export const tournamentEntrants =
`query TournamentEntrants($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: EventEntrantPageQueryFilter){
    tournament(id: $id){
        events{
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
    }
}`

export const tournamentAttendees =
`query TournamentAttendees($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: ParticipantPageFilter){
    tournament(id: $id){
        participants(query: {
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            filter: $filter
        },
        isAdmin: false){
            {pageInfo}
            nodes{
                ${Schema.attendee}
            }
        }
    }  
}`

export const tournamentAttendeeSearch = `query SearchTournamentAttendeesQuery($id:ID!, $smashtag:String){
    tournament(id:$id){
      participants(query:{
        page: 1,
        perPage: 50,
        sortBy: "asc",
        filter:{
          search:{
            fieldsToSearch:["gamerTag"],
            searchString: $smashtag
          }
        }
      }, isAdmin:false){
        nodes{
          ${Schema.attendee}
        }
      }
    }
  }
`

export const tournamentAttendeeSearchByPrefix =
`query SearchTournamentAttendeesBySponsorQuery($id:ID!, $sponsor:String){
    tournament(id:$id){
      participants(query:{
        page: 1,
        perPage: 50,
        sortBy: "asc",
        filter:{
          search:{
            fieldsToSearch:["prefix"],
            searchString: $sponsor
          }
        }
      }, isAdmin:false){
        nodes{
          ${Schema.attendee}
        }
      }
    }
  }
`

export const tournamentEvents = `query TournamentEvents($id: ID!){
    tournament(id: $id){
        events{
            ${Schema.event}
        }
    }
}`

export const tournamentPhases = `query TournamentPhases($id: ID!){
    tournament(id: $id){
        events{
            id
            phases{
                ${Schema.phase}
            }
        }
    }   
}`

export const tournamentPhaseGroups = `query TournamentPhaseGroups($id: ID!){
    tournament(id: $id){
        events{
            phaseGroups{
                ${Schema.phaseGroup}
            }
        }
    }   
}`

// WARNING THIS DOES NOT WORK CURRENTLY DUE TO RECURSIVE LIMITATIONS, Use tournamentPhaseGroupIds instead **/
export const tournamentSets = `query TournamentSets($id: ID!){
    tournament(id: $id){
        events{
            phaseGroups{
                sets{
                    ${Schema.set}
                }
            }
        }
    }   
}`

export const tournamentPhaseGroupIds = `query PhaseGroupIdQuery($id: ID!){
    tournament(id: $id){
        events{
            id
            phaseGroups{
                id
            }
        }
    }
}`
