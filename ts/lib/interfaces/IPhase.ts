import { parseOptions } from "../util/Common";

export namespace IPhase{
	export interface Phase{
		id: number
		url: string
		data: Data | string
		isCached: boolean
		rawEncoding: string
		expandsString: string
		expands: Expands

		loadData(data: Data) : Data | string
		
		getData() : Data
		
		getPhase(id: number, options: Options) : Promise<Phase> 
		
		load(): Promise<Data | string> 
		
		getPhaseGroups(options: Options) : Promise<Array<PhaseGroup>>
		
		getSets(options: Options) : Promise<Array<GGSet>>
		
		getPlayers(options: Options) : Promise<Array<Player>>
		
		getIncompleteSets(options: Options) : Promise<Array<GGSet>>
		
		getCompleteSets(options: Options) : Promise<Array<GGSet>>
		
		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<Array<GGSet>>
		
		getFromDataEntities(prop: string) : any
		
		getName() : string
		
		getEventId() : string
		
		nullValueString(prop: string) : string
		
		emitPhaseReady() : void
		
		emitPhaseError(err: Error) : void
	}

	export interface Options{
		isCached?: boolean,
		expands?: Expands,
		rawEncoding?: string
	}

	export interface Expands{
		groups: boolean
	}

	export interface Data{
		id: number,
		[x: string]: any
	}

	export interface Entity{
		id: number,
		[x: string]: any
	}

	export function getDefaultData(){
		return {
			id: 0
		}
	}

	export function getDefaultExpands(){
		return {
			groups: true
		}
	}

	export function parseOptions(options: Options) : Options{
		return {
			expands: {
				groups: (options.expands != undefined && options.expands.groups == false) ? false : true
			},
			isCached: true,
			rawEncoding: 'JSON'
		}
	}
}