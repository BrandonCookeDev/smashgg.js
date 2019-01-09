import { ICommon } from './ICommon'
import { ITournament } from './ITournament'
import { IPhase } from './IPhase'
import { IPhaseGroup } from './IPhaseGroup'
import { IPlayer } from './IPlayer'
import { IGGSet } from './IGGSet'
import Encoder from '../util/Encoder'

/* Types */
import TPhase = IPhase.Phase
import TPhaseGroup = IPhaseGroup.PhaseGroup
import TPlayer = IPlayer.Player
import TGGSet = IGGSet.GGSet

import Entity = ICommon.Entity
import TournamentData = ITournament.Data
import TournamentOptions = ITournament.Options

export namespace IEvent{
	export interface Event{
		id: number 
		url: string 
		data: Data | string
		eventId: string | number
		expands: Expands 
		expandsString: string 
		tournamentId: string | undefined
		tournamentSlug: string 
		isCached: boolean 
		rawEncoding: string 
		phases: Array<TPhase> 
		groups: Array<TPhaseGroup> 
		
		loadData(data: object): object | string 
	
		getData() : Data
				
		//getEvent(eventName: string, tournamentName: string, options: Options) : Promise<Event>
	
		//getEventById(id: number, options: Options) : Promise<Event>
			
		load(options: Options, tournamentOptions: TournamentOptions) : Promise<Data | string>
				
		getEventPhases(options: Options) : Promise<Array<TPhase>>
	
		getEventPhaseGroups(options: Options) : Promise<Array<TPhaseGroup>>
			
		getSets(options: Options) : Promise<Array<TGGSet>>
			
		getPlayers(options: Options) : Promise<Array<TPlayer>>
				
		getIncompleteSets(options: Options) : Promise<Array<TGGSet>>
	
		getCompleteSets(options: Options) : Promise<Array<TGGSet>>
			
		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<Array<TGGSet>> 
			
		getFromEventEntities(prop: string) : any

		getFromTournamentEntities(prop: string) : any

		getId() : number
			
		getName() : string
			
		getTournamentId() : number
			
		getSlug() : string
			
		getTournamentSlug() : string
			
		getStartTime() : Date | null
			
		getStartTimeString() : string | null
			
		getEndTime() : Date | null
			
		getEndTimeString() : string | null
			
		nullValueString(prop: string) : string
	
		emitEventReady() : void
			
		emitEventError(err: Error) : void
		
	}

	export interface Options{
		isCached?: boolean,
		rawEncoding?: string,
		expands?: Expands
	}

	export interface Expands{
		phase: boolean,
		groups: boolean 
	}

	export interface Data{
		tournament: TournamentData,
		event: EventData
	}

	export interface EventData{
		entities: {
			slug: string,
			tournamentId: number,
			event: Entity,
			groups?: [Entity],
			phase?: [Entity],
			[x: string]: any
		}
	}

	export function getDefaultData(): Data{
		return {
			tournament: ITournament.getDefaultData(),
			event: getDefaultEventData()
		}
	}

	export function getDefaultEventData(): EventData{
		return {
			entities: {
				slug: '',
				tournamentId: 0,
				event: {
					id: 0
				}
			}
		}
	}

	export function getTournamentSlug(slug: string) : string{
		return slug.substring(slug.indexOf('/') + 1, slug.indexOf('/', slug.indexOf('/') + 1));
	}


	export function getDefaultOptions(): Options {
		return {
			expands:{
				phase: true,
				groups: true
			},
			isCached: true,
			rawEncoding: 'JSON'
		}
	}

	export function parseOptions(options: Options) : Options {
		return{
			expands: {
				phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
				groups: (options.expands != undefined && options.expands.groups == false) ? false : true
			},
			isCached: options.isCached != undefined ? options.isCached === true : true,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}
}