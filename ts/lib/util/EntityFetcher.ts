import log from 'winston'
import request from 'request-promise';
import { format } from 'util'
import * as Common from './Common'


import { ITournament } from '../models/ITournament'
import { IEvent } from '../models/IEvent'

import createExpandsString = Common.createExpandsString
import TournamentOptions = ITournament.Options
import TournamentData = ITournament.Data;
import parseTournamentOptions = ITournament.parseOptions;
import EventOptions = IEvent.Options
import EventData = IEvent.Data
import parseEventOptions = IEvent.parseOptions;

const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';


export async function getTournamentData(tournamentId: string, options: TournamentOptions): Promise<TournamentData>{
    try{
        options = parseTournamentOptions(options);
        let expands: string = createExpandsString(options.expands)
        let url: string = format(TOURNAMENT_URL, tournamentId, expands);
        let data: TournamentData = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}

export async function getEventData(eventId: string, options: EventOptions): Promise<EventData>{
    try{
        options = parseEventOptions(options);
        let expands: string = createExpandsString(options.expands)
        let url: string = format(EVENT_URL, eventId, expands);
        let data: EventData = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}

export async function getEventDataById(eventId: number, options: EventOptions): Promise<EventData>{
    try{
        options = parseEventOptions(options);
        let expands: string = createExpandsString(options.expands)
        let url: string = format(EVENT_URL, eventId, expands);
        let data: EventData = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}
