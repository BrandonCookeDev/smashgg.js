import * as Schema from './schema'
export const user = `query UserQuery($id: ID!!) {
	player(id:$id){
		${Schema.user}
	}
}`

export const userRankings = `query UserRankings($id: ID!!) {
	player(id:$id){
		id
		rankings{
			id
			title
			rank
		}
	}
}`

export const userRecentGGSets = `query UserRecentSets($id: ID!!) {
	player(id:$id){
		id
		recentSets{
      		${Schema.set}     
		}
	}
}`