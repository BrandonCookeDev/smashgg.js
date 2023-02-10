import * as Schema from './schema'
export const phaseGroup = `query PhaseGroupQuery($id: ID!){
	phaseGroup(id: $id){
		${Schema.phaseGroup}
	}
}
`

export const phaseGroupSeeds = 
`query PhaseGroupSeedsQuery($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){
	phaseGroup(id: $id){
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
}
`

export const phaseGroupSeedStandings = 
`query PhaseGroupSeedsQuery($id: ID!, $page: Int, $perPage: Int, $orderBy: String, $filter: SeedPageFilter){
	phaseGroup(id: $id){
		paginatedSeeds(query: {			
			page: $page, 
			perPage: $perPage, 
			sortBy: $sortBy,
			filter: $filter
		}){
			{pageInfo}
			nodes{
				standings{
					${Schema.standings}
				}
			}
		}
	}
}`

export const phaseGroupSets = 
`query PhaseGroupEntrants($id: ID!, $page: Int, $perPage: Int, $sortType: SetSortType, $filters: SetFilters){
	phaseGroup(id: $id){
	  paginatedSets(page:$page, perPage:$perPage, sortType:$sortType, filters:$filters){
		{pageInfo}
		nodes{
			${Schema.set}
		}
	  }
	}
  }`

export const phaseGroupEntrants = 
`query PhaseGroupEntrants($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){
	phaseGroup(id: $id){
		paginatedSeeds(query: {
			page: $page,
			perPage: $perPage,
			sortBy: $sortBy,
			filter: $filter
		}){
			{pageInfo}
			nodes{
				entrant{
					${Schema.entrant}
				}
			}
		}
	}	
}`

export const phaseGroupAttendees = 
`query PhaseGroupEntrants($id: ID!, $page: Int, $perPage: Int, $sortBy: String, $filter: SeedPageFilter){
	phaseGroup(id: $id){
		paginatedSeeds(query: {
			page: $page,
			perPage: $perPage,
			sortBy: $sortBy,
			filter: $filter
		}){
			{pageInfo}
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
