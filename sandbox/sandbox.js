/* eslint-disable */
const smashgg = require('..');
const {Tournament, Event, GGSet, Player, Phase, PhaseGroup} = smashgg;

const tournamentSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/?/);
const eventSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/?(events\/([\S]*))\/?/);
const phaseSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/events\/([\S]*)\/brackets\/([0-9]*)\/?/);
const phaseGroupSlugRegex = new RegExp(/(http|https):\/\/api.smash.gg\/tournament\/([\S]*)\/events\/([\S]*)\/brackets\/([0-9]*)\/([0-9]*)\/?/);

(async function(){
    /** Put your sandbox code here */

    
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