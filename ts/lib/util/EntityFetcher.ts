import log from 'winston'
import request from 'request-promise';
import { format } from 'util'

import * as Common from './Common'
import Entity = Common.Entity
import Data = Common.Data


import { ITournament } from '../models/ITournament'
import { IEvent } from '../models/IEvent'

import createExpandsString = Common.createExpandsString
import TournamentOptions = ITournament.Options
import EventOptions = IEvent.Options


const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';


export async function getTournamentData(tournamentId: string, options: TournamentOptions): Promise<Entity>{
    try{
        let expands: string = createExpandsString(options.expands)
        let url: string = format(TOURNAMENT_URL, tournamentId, expands);
        let data: Entity = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}

export async function getEventDataById(eventId: number, options: EventOptions): Promise<Entity>{
    try{
        let expands: string = createExpandsString(options.expands)
        let url: string = format(EVENT_URL, eventId, expands);
        let data: Entity = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}
