
exports.phaseGroupSets = `query PhaseGroupSetsById($id: Int){
    phaseGroup(id: $id){
        sets{
            id
            fullRoundText
            displayScore
            startedAt
            completedAt
        }
    }
}`

exports.phaseGroupSets2 = `query PhaseGroupSetsById($id: Int){
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
}`

exports.phaseGroupSetsWithoutEntrants = `query PhaseGroupSetsById($id: Int){
    phaseGroup(id: $id){
        sets{
            id
            round
            displayScore
            fullRoundText
            startedAt
            completedAt
            winnerId
            totalGames
            state
        }
    }
}`

exports.phaseGroupSetsWithEntrants = `query PhaseGroupSetsById($id: Int){
    phaseGroup(id: $id){
        sets{
            id
            round
            displayScore
            fullRoundText
            startedAt
            completedAt
            winnerId
            totalGames
            state
            slots{
                id
                entrant {
                    id
                    name
                    participants {
                        id
                    }
                }
            }
        }
    }
}`

exports.eventById = `query EventByIdQuery($id: Int) {
    event(id: $id){
        id
        name
        slug
        startAt
        tournament{
            id
            name
            slug
            timezone
        }
    }
}`

exports.event = `query EventByTournamentSlugQuery($slug:String){
    tournament(slug:$slug){
        id
        name
        slug
        timezone
        events{
            id
            name
            slug
            startAt
        }
    }
}`

exports.eventPlayers = `query EventParticipantQuery($slug: String, $eventIds: [Int]) {
    tournament(slug: $slug){
        id
        name
        slug
        participants(query: {
            page: 0,
            perPage: 10000,
            sortBy: "asc",
            filter: {
                eventIds: $eventIds
            }
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
}`