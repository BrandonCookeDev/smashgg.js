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

exports.event = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        id
        name
        slug
        events{
            id
            name
            slug
            startAt
        }
    }
}`;