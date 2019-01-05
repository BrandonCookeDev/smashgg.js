import log from 'winston'
import request from 'request-promise';
import { format } from 'util'

import * as Common from './Common'
import Entity = Common.Entity
import Data = Common.Data

const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';


export async function getTournamentData(tournamentId: string, expands: string): Promise<Entity>{
    try{
        let url: string = format(TOURNAMENT_URL, tournamentId);
        let data: Entity = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}

export async function getEventData(eventId: number, expands: string): Promise<Entity>
    try{
        let url: string = format(EVENT_URL, eventId);
        let data: Entity = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}
