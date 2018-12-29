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