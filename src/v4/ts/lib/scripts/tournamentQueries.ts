import * as Schema from './schema'
export const tournament = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        ${Schema.tournament}
    }
}`

export const tournamentOrganizer = `query tournamentOrganizer($slug: String){
    tournament(slug: $slug){
        ownerId
        contactEmail
        contactTwitter
        contactPhone
        contactInfo
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
                    ${Schema.set}
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