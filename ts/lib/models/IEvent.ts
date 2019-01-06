import { ICommon } from './ICommon'
import { ITournament } from './ITournament'

import Entity = ICommon.Entity
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
		phases: Array<Phase> 
		groups: Array<PhaseGroup> 

		getTournamentData(tournamentId: string, options: TournamentOptions): Promise<Entity>
		
		getEventData(): Promise<string | object>
		
		loadData(data: object): object | string 
	
		getData() : Data
				
		getEvent(eventName: string, tournamentName: string, options: Options) : Promise<Event>
	
		getEventById(id: number, options: Options) : Promise<Event>
			
		load() : Promise<Data | string>
				
		getEventPhases(options: Options) : Promise<Array<Phase>>
	
		getEventPhaseGroups(options: Options) : Promise<Array<PhaseGroup>>
			
		getSets(options: Options) : Promise<Array<GGSet>>
			
		getPlayers(options: Options) : Promise<Array<Player>>
				
		getIncompleteSets(options: Options) : Promise<Array<GGSet>>
	
		getCompleteSets(options: Options) : Promise<Array<GGSet>>
			
		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<Array<GGSet>> 
			
		getFromDataEntities(prop: string) : any

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
		entities: {
			event: Entity,
			groups?: [Entity],
			phase?: [Entity]
		}
	}
}