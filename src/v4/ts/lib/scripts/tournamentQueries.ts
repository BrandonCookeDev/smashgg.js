export const tournament = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        id
        name
        slug
        city
        postalCode
        addrState
        countryCode
        region
        venueAddress
        venueName
        gettingThere
        lat
        lng
        timezone
        startAt
        endAt
        contactInfo
        contactEmail
        contactTwitter
        ownerId
    }
}`

export const getTournamentOrganizer = `query tournamentOrganizer($slug: String){
    tournament(slug: $slug){
        ownerId
        contactEmail
        contactTwitter
        contactInfos
    }   
}`

export const tournamentVenue = `query tournamentVenue($slug: String) {
	tournament(slug: $slug){
		venueName
		venueAddress
		city
		addrState
		countryCode
	}	
}`

export const tournamentPlayers = `query TournamentParticipantQuery($slug: String) {
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
}`

export const tournamentPhases = `query TournamentPhases($slug: String){
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
}`

export const tournamentPhaseGroups = `query TournamentPhaseGroups($slug: String){
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
}`

/** WARNING THIS DOES NOT WORK CURRENTLY DUE TO RECURSIVE LIMITATIONS, Use tournamentPhaseGroupIds instead **/
export const tournamentSets = `query TournamentSets($slug: String){ 
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
        }
    }   
}`

export const tournamentPhaseGroupIds = `query PhaseGroupIdQuery($slug: String) {
    tournament(slug: $slug){
        events{
            id
            phaseGroups{
                id
            }
        }
    }
}`