exports.phaseGroupSets = `query PhaseGroupSetsById($id: ID!){
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

exports.phaseGroupSets2 = `query PhaseGroupSetsById($id: ID!){
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

exports.phaseGroupSetsWithoutEntrants = `query PhaseGroupSetsById($id: ID!){
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

exports.phaseGroupSetsWithEntrants = `query PhaseGroupSetsById($id: ID!){
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
