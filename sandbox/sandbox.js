/* eslint-disable */
require('colors');
const smashgg = require('..');
const {Tournament, Event, GGSet, Player, Phase, PhaseGroup} = smashgg;

const tournamentSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/?/);
const eventSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/?(events\/([\S]*))\/?/);
const phaseSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/events\/([\S]*)\/brackets\/([0-9]*)\/?/);
const phaseGroupSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/events\/([\S]*)\/brackets\/([0-9]*)\/([0-9]*)\/?/);
const tarr = ['battle-the-finale','ethereal-gaming-tournament','bread-battles-3','jth-esports-online-tournament','late-night-rumble-iv','sop-tournament-3','redlight-rumble-online-2','bawk-on-the-battlefield-1','smash-kingdom-6-ultimate','doubles-division-5','bigjonnn-s-tournament','tvs-sunday-weekly-1-20-s7-ep-10','mythic-universe-team-doubles-3-1','smasholympics-january-month-1-of-the-circuit','grind-time-6','pfeil-elite-showdown-1','central-high-smash-tournament','smashing-legends-114','ssb-discord-tournament','dair-to-fight-2','hacknation-ultimate-monthly-1','smash-battlegrounds-ultimate-tourney','aether-network-charity-tournament-1','snowstorm-singles','mooncord-open-invite-2-1','mythic-universe-season-1-bracket-3','808-sandcombobreaks','smash-kingdom-5-ultimate','ultira','roadtosmash-tournament-2','r-smashbrosultimate-smash-fest-1','ownageddon3','rivals-smash-4','scs-circuit-s1-stage-1-the-beginning','anc-monthlies-8','european-bootcamp-weekly-55','the-coso-saga','israel-ultimate','bigtwo-cup-4','second-chances','nh-raven-s-free-to-play-online-cash-smash-ultimate','10-prize-joemeisterlive-s-weekly-tourney-6-free-entry-jwt6','be-the-boss-1','w-mart-smash-ultimate-tournament-3','smash-fight-club-5','ultimate-friday-night-doubles','combo-city','otg-online-7-smash-bros-ultimate','wifight-ultimate-6','escaping-workforce-s-online-circuit-week-14','chilluminati-championship-series-3','smash-bros-of-light-week-2','tvs-friday-weekly-1-18-s7-ep-9','liberty-12-ultimate','dlm-smash-tourney','eclipse-69','ultimate-ragnellfest','net-battle-series-5','twitch-tv-mang0-s-smash-ultimate-sub-tournament-3-2','dln-4-torneo-online-paname-o-de-la-nada','battle-network-thursdays-11','weekly-sbitonline-6','breakfast-club-1','soupuhman-s-monthly-tourney','kaos-3','smashing-legends-113','bobbywasabi-s-degenerate-discord-server-bracket-3','ntk-random-tournament-online','oh-snap-its-smash-on-wednesday-2','european-bootcamp-midweek-drills-25-1','wavebounce-light-series-6','event-check-in-test','see-me-in-ultimate-5-an-online-tourney-series','ccs-midweek-1','take-the-l-tuesdays-15','boost-power-online-1','glacial-gauntlet-1','flamewave-neo-38','bread-battles-2','super-smashing-squids-5','run-the-set-1','doubles-division-4','smash-3ds-ultimate-server-super-smash-bros-ultimate-tourney-6','clash-of-sargasso','tvs-sunday-weekly-1-13-s7-ep-8','mythic-universe-team-doubles-2','waifu-alert-smash-3-the-rise-of-the-woogle','smashguild-tournament-series-1','everyone-is-here-1','grind-time-5','fellowstv-open-circuit-2','pcs-sunday-wars-1','smash-kingdom-4-ultimate','smashing-legends-112','smash-fight-club-4','ssbu-online-tournament-2-held-by-freeze-0220','ultimate-casual-sba-tourney','hacknation-ultimate-weekly-5','vernias-skyworld-cup-2-1','smash-kingdom-3-ultimate'];

(async function(){
    let successes = 0;
    for(var i in tarr){
        let tourney = await Tournament.getTournament(tarr[i]);
        let sets = await tourney.getAllSets({isCached: false});
        console.log(`Got ${successes++} set groups out of ${tarr.length} tournaments`);
    }

})()

function parseTournamentSlug(slug){
    let parsed = tournamentSlugRegex.exec(slug);
    if(!parsed)
        return null;
    else
        return {
            tournamentName: parsed[2]
        }
}

function parseEventSlug(slug){
    let parsed = eventSlugRegex.exec(slug);
    if(!parsed)
        return null;
    else
        return {
            tournamentName: parsed[2],
            eventName: parsed[3]
        }
}

function parsePhaseSlug(slug){
    let parsed = phaseSlugRegex.exec(slug);
    if(!parsed)
        return null;
    else
        return {
            tournamentName: parsed[2],
            eventName: parsed[3],
            phaseId: parsed[4]
        }
}

function parsePhaseGroupSlug(slug){
    let parsed = phaseGroupSlugRegex.exec(slug);
    if(!parsed)
        return null;
    else
        return {
            tournamentName: parsed[2],
            eventName: parsed[3],
            phaseId: parsed[4],
            phaseGroupId: parsed[5]
        }
}