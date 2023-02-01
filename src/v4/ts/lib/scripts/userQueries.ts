import * as Schema from './schema'
export const user = `query UserQuery($id: ID!) {
	user(id:$id){
	    ${Schema.user}
	}
}`

export const userRecentStandings = `query UserRankings($id: ID!) {
	player(id:$id){
		id
        recentStandings{
            placement
            container{
                ... on Event{
                      id
                     name
                    tournament{
                        name
                    }
                }
            }
        }
    }
}
`

export const userRecentGGSets = `query UserRecentSets($id: ID!) {
	player(id:$id){
		id
		recentSets{
      		${Schema.set}     
		}
	}
}`
