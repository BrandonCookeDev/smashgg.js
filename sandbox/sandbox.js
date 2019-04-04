/* eslint-disable */
require('colors');
require('dotenv').config({path: require('path').join(__dirname, '..', '.env')});
const smashgg = require('..');
smashgg.initialize(process.env.API_TOKEN);
const {Tournament, Event, GGSet, Player, Phase, PhaseGroup} = smashgg;

const tournamentSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/?/);
const eventSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/?(events\/([\S]*))\/?/);
const phaseSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/events\/([\S]*)\/brackets\/([0-9]*)\/?/);
const phaseGroupSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/events\/([\S]*)\/brackets\/([0-9]*)\/([0-9]*)\/?/);

(async function(){

    let evt = await Event.get('svenska-raketligan-open-qualifiers-5', 'svenska-raketligan-open-qualifiers-1')
    let attendees = await evt.getAttendees({areSeedsPublished: false, isVerified: true});
    console.log(attendees.length)
    
    let entrants = await evt.getEntrants({areSeedsPublished: false});
    console.log(entrants.length)

    return true;
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