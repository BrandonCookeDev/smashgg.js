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
        ownerId
    }
}`;

exports.tournamentPlayers = `query TournamentParticipantQuery($slug: String) {
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

exports.tournamentPhases = `query TournamentPhases($slug: String){
    tournament(slug: $slug){
        id
        name
        slug
        events{
            id
            name
            slug
            phases{
                id
                name
                numSeeds
                groupCount
            }
        }
    }   
}`;

exports.tournamentPhaseGroups = `query TournamentPhaseGroups($slug: String){
    tournament(slug: $slug){
        id
        name
        slug
        events{
            id
            name
            slug
            phaseGroups{
                id
                phaseId
                waveId
                state
                firstRoundTime
                displayIdentifier
            }
        }
    }   
}`;

/** WARNING THIS DOES NOT WORK CURRENTLY DUE TO RECURSIVE LIMITATIONS, Use tournamentPhaseGroupIds instead **/
exports.tournamentSets = `query TournamentSets($slug: String){ 
    tournament(slug: $slug){
        events{
            phaseGroups{
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
        }
    }   
}`;

exports.tournamentPhaseGroupIds = `query PhaseGroupIdQuery($slug: String) {
    tournament(slug: $slug){
        events{
            phaseGroups{
                id
            }
        }
    }
}`;

exports.phaseGroupSets = `query PhaseGroupSetsById($id: Int){
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
}`;

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
}`;