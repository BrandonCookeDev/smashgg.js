import * as Schema from './schema'
export const phaseGroup = `query PhaseGroupQuery($id: Int){
	phaseGroup(id: $id){
		${Schema.phaseGroup}
	}
}`

export const phaseGroupSeeds = `query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $orderBy: String){
	phaseGroup(id: $id){
		paginatedSeeds(query: {
			page: $page, $perPage: perPage, orderBy: $orderBy
		}){
			nodes{
				${Schema.seeds}
			}
		}
	}
}`

export const phaseGroupSeedStandings = `query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $orderBy: String){
	phaseGroup(id: $id){
		paginatedSeeds(query: {
			page: $page, $perPage: perPage, orderBy: $orderBy
		}){
			nodes{
				standings: {
					${Schema.standings}
				}
			}
		}
	}
}`

export const phaseGroupSets = `query PhaseGroupSeedsQuery($id: Int, $page: Int, $perPage: Int, $orderBy: String){
	phaseGroup(id: $id){
		paginatedSets(query: {
			page: $page, $perPage: perPage, orderBy: $orderBy
		}){
			nodes{
				${Schema.set}
			}
		}
	}
}`