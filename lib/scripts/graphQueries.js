exports.tournament = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        id
        name
        slug
        city
        addrState
        timezone
        startAt
        endAt
        contactEmail
        contactTwitter
    }
}`;

exports.tournamentPlayers = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        id
        name
        slug
        participants(query: {
            page: 0,
            perPage: 10000,
            sortBy: "asc",
        },
        isAdmin: false){
            nodes{
                id
                playerId
                gamerTag
                prefix
            }
        }
    }  
}`;

exports.tournamentPhaseGroupIds = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        events{
            phaseGroups{
                id
            }
        }
    }
}`;

exports.phaseGroupSets = `query QueryPhaseGroupsByIds($id: Int){
    phaseGroup(id: $id){
        sets{
            id
            round
            fullRoundText
            startedAt
            completedAt
            winnerId
            totalGames
            state
        }
    }
}`;

exports.event = `query EventQuery($slug:String){
    tournament(slug:$slug){
        id
        slug
        events{
            id
            name
            slug
            startAt
        }
    }
}`;