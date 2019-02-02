import * as Schema from './schema'
export const user = `query UserQuery($id: Int!) {
	player(id:$id){
		${Schema.user}
	}
}`

export const userRankings = `query UserRankings($id: Int!) {
	player(id:$id){
		id
		rankings{
			id
			title
			rank
		}
	}
}`

export const userRecentGGSets = `query UserRecentSets($id: Int!) {
	player(id:$id){
		id
		recentSets{
      		${Schema.set}     
		}
	}
}`