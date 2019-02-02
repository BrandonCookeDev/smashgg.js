
export const event = `query EventByTournamentSlugQuery($slug:String){
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

export const eventById = `query EventByIdQuery($id: Int) {
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

export const eventPlayers = `query EventParticipantQuery($slug: String, $eventIds: [Int]) {
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