import Encoder from '../util/Encoder'
import Entity = ICommon.Entity;

/* Interfaces */
import { ICommon } from './ICommon'
import { IEvent } from './IEvent'
import { IPlayer } from './IPlayer'
import { IGGSet } from './IGGSet'

/* Types */
import TEvent = IEvent.Event
import TPlayer = IPlayer.Player
import TGGSet = IGGSet.GGSet

export namespace ITournament{
	export interface Tournament{

		url: string
		data: Data | string
		name: string | number
		expands: Expands 
		expandsString: string 
		isCached: boolean
		rawEncoding: string 
		
		loadData(data: object) : object | string

		getData() : Data

		//getTournament(tournamentId: string, options: Options) : Tournament

		//getTournamentById(tournamentId: number, options: Options) : Tournament

		load() : Promise<Data | string> 

		getAllPlayers(options: Options) : Promise<Array<TPlayer>> 

		getAllSets(options: Options) : Promise<Array<TGGSet>>

		getAllEvents(options: Options) : Promise<Array<TEvent>>

		getIncompleteSets(options: Options) : Promise<Array<TGGSet>>
	
		getCompleteSets(options: Options) : Promise<Array<TGGSet>>

		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<Array<TGGSet>>

		getFromDataEntities(prop: string) : any

		getId() : number

		getName() : string 

		getSlug() : string

		getTimezone() : string

		getStartTime() : Date | null

		getStartTimeString() : string | null

		getEndTime() : Date | null

		getEndTimeString() : string | null

		getWhenRegistrationCloses() : Date | null

		getWhenRegistrationClosesString() : string | null

		getCity() : string
		
		getState() : string
		
		getZipCode() : string
		
		getContactEmail() : string
		
		getContactTwitter() : string
		
		getOwnerId() : string 

		getVenueFee() : string
		
		getProcessingFee() : string 
		
		nullValueString(prop: string) : string
		
		emitTournamentReady() : void
		
		emitTournamentError(err: Error) : void
	}

	export interface Options{
		expands?: Expands, 
		isCached?: boolean, 
		rawEncoding?: string
	}

	export interface Expands{
		event: boolean,
		phase: boolean,
		groups: boolean,
		stations: boolean
	}

	export interface Data{
		tournament: Entity
		event?: [Entity],
		phase?: [Entity],
		groups?: [Entity],
		stations?: {
			[x: string]: any
		},
		[x: string]: any
	}

	export function getDefaultData(): Data{
		return {
			tournament:{ 
				id: 0
			}
		}
	}

	export function getDefaultOptions(): Options{
		return {
			expands:{
				event: true,
				phase: true,
				groups: true,
				stations: true
			},
			isCached: true,
			rawEncoding: 'JSON'
		}
	}

	export function parseOptions(options: Options){
		return {
			expands: {
				event: (options.expands != undefined && options.expands.event == false) ? false : true,
				phase: (options.expands != undefined  && options.expands.phase == false) ? false : true,
				groups: (options.expands != undefined && options.expands.groups == false) ? false : true,
				stations: (options.expands != undefined && options.expands.stations == false) ? false : true
			},
			isCached: options.isCached != undefined ? options.isCached === true : true,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}
}