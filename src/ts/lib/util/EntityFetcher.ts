import log from 'winston'
import request from 'request-promise';
import { format } from 'util'
import * as Common from './Common'

/* Interfaces */
import { ITournament } from '../internal'
import { IEvent } from '../internal'
import { IPhase } from '../internal'
import { IPhaseGroup } from '../internal'

import createExpandsString = Common.createExpandsString
import TournamentOptions = ITournament.Options
import TournamentData = ITournament.Data;
import EventOptions = IEvent.Options
import EventData = IEvent.EventData
import PhaseOptions = IPhase.Options
import PhaseData = IPhase.Data
import PhaseGroupOptions = IPhaseGroup.Options
import PhaseGroupData = IPhaseGroup.Data

import parseTournamentOptions = ITournament.parseOptions
import parseEventOptions = IEvent.parseOptions
import parsePhaseOptions = IPhase.parseOptions
import parsePhaseGroupOptions = IPhaseGroup.parseOptions

const TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s?%s';
const EVENT_URL = 'https://api.smash.gg/event/%s?%s';
const EVENT_TOURNAMENT_URL = 'https://api.smash.gg/tournament/%s/event/%s?%s'
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

export async function getEventData(eventId: string, tournamentId: string, options: EventOptions): Promise<EventData>{
    try{
        options = parseEventOptions(options);
        let expands: string = createExpandsString(options.expands)
        let url: string = format(EVENT_TOURNAMENT_URL, tournamentId, eventId, expands);
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

export async function getPhase(phaseId: number, options: PhaseOptions): Promise<PhaseData> {
    try{
        options = parsePhaseOptions(options);
        let expands: string = createExpandsString(options.expands)
        let url: string = format(PHASE_URL, phaseId, expands);
        let data: PhaseData = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}

export async function getPhaseGroup(phaseGroupId: number, options: PhaseGroupOptions): Promise<PhaseGroupData> {
    try{
        options = parsePhaseGroupOptions(options);
        let expands: string = createExpandsString(options.expands)
        let url: string = format(PHASE_URL, phaseGroupId, expands);
        let data: PhaseGroupData = JSON.parse(await request(url));
        return data;
    } catch(err){
        console.error('Error creating Tournament. For more info, implement Event.on(\'error\')');
        log.error('Event error: %s', err.message);
        throw err;
    }
}