import * as Schema from './schema'
export const phase = `
query PhaseQuery($id: ID!){
	phase(id: $id){
		${Schema.phase}
	}
}
`

export const phaseSeeds = `
query PhaseSeedQuery($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){
	phase(id: $id){
		paginatedSeeds(query: {
			page: $page,
			perPage: $perPage,
			sortBy: $sortBy,
			filter: $filter
		}){
			{pageInfo}
			nodes{
				${Schema.seeds}
			}
		}
	}	
}`

export const phasePhaseGroups2 = `
query PhaseGroupsQuery($eventId: Int){
	event(id: $eventId){
		phaseGroups{
			${Schema.phaseGroup}
		}
	}
}`

export const phasePhaseGroups = `
query PhaseGroupsQuery($id:ID!){
	phase(id:$id){
		phaseGroups(query:{}){
			nodes{
				${Schema.phaseGroup}
			}
		}
	}
}
`

export const phaseSets = `
query PhaseSets($eventId:Int, $page: Int, $perPage: Int, $sortType: SetSortType, $filters: SetFilters, $hasPermissions: Boolean){
	event(id: $eventId){
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

export const phaseEntrants = `
query PhaseEntrants($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){
	phase(id: $id){
		paginatedSeeds(query: {
		  page: $page,
		  perPage: $perPage,
		  sortBy: $sortBy,
		  filter: $filter
		}){
		  {pageInfo},
		  nodes{
			  entrant{
				  ${Schema.entrant}
			  }
		  }
		}
	}	
}`

export const phaseAttendees = `
query PhaseAttendees($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){
	phase(id: $id){
		paginatedSeeds(query:{
		  page: $page,
		  perPage: $perPage,
		  sortBy: $sortBy,
		  filter: $filter
		}){
		  {pageInfo},
		  nodes{
			  entrant{
				  participants{
						${Schema.attendee}
					}
			  }
		  }
		}
	}	
}`