export const user = `query UserQuery($id: Int!) {
	player(id:$id){
		id
		gamerTag
		prefix
		color
		twitchStream
		twitterHandle
		youtube
		region
		state
		country
		gamerTagChangedAt
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
      		id
			displayScore
			round
			fullRoundText
			createdAt
			completedAt
			startedAt
			state
			totalGames
			winnerId
			wPlacement
			lPlacement
			slots(includeByes:true){
				entrant{
				name
				}
			}      
		}
	}
}`