exports.tournament = `query TournamentQuery($slug: String) {
    tournament(slug: $slug){
        id
        name
    }
}`;