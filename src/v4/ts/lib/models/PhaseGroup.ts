import _ from 'lodash'
import log from '../util/Logger'
import NI from '../util/NetworkInterface'
import * as queries from '../scripts/phaseGroupQueries'

import {IPhaseGroup, 
	IPhaseGroupData, 
	IPhaseGroupDataFull,
	IPhaseGroupEventData,
	IPhaseGroupSeedData,
	IPhaseGroupAttendeeData,
	IPhaseGroupEntrantData,
	IPhaseGroupSetData	
} from '../interfaces/IPhaseGroup'
import {IAttendee, IAttendeeData,IAttendeeOptions} from '../interfaces/IAttendee'
import {IEntrant, IEntrantDataFull, IEntrantOptions} from '../interfaces/IEntrant'
import {IGGSet, IGGSetOptions} from '../interfaces/IGGSet'
import {ISeed, ISeedData, ISeedOptions} from '../interfaces/ISeed'

import { Attendee } from './Attendee'
import { Entrant } from './Entrant' // TODO change this to internal
import { GGSet } from './GGSet'
import { Seed } from './Seed'

export class PhaseGroup implements IPhaseGroup{

	public static parse(data: IPhaseGroupData): IPhaseGroup{
	    if(data.wave === null){
	        return new PhaseGroup(
			data.id,
			data.phase.id,
			data.phase.name,
			data.displayIdentifier,
			data.firstRoundTime,
			data.state,
			null,
			null,
			null,
			data.tiebreakOrder
		)
	    } else {
		    return new PhaseGroup(
		    	data.id,
	    		data.phase.id,
    			data.phase.name,
			    data.displayIdentifier,
			    data.firstRoundTime,
		    	data.state,
	    		data.wave.id,
	    		data.wave.identifier,
	    		data.wave.startAt,
    			data.tiebreakOrder
		    )
		}
	}

	public static parseFull(data: IPhaseGroupDataFull): IPhaseGroup {
		return PhaseGroup.parse(data.phaseGroup)
	}

	public static parseEventData(data: IPhaseGroupEventData): IPhaseGroup[]{
		return data.event.phaseGroups.map(pg => PhaseGroup.parse(pg))
	}

	public static async get(theId: number): Promise<IPhaseGroup> {
		log.info('Getting Phase Group with id %s', theId)
		const data: IPhaseGroupDataFull = await NI.query(queries.phaseGroup, {id: theId})
		return PhaseGroup.parse(data.phaseGroup)
	}

	private id: number
	private phaseId: number | null
	private phaseName: string | null
	private displayIdentifier: string | null
	private firstRoundTime: number | null
	private state: number | null
	private waveId: number | null
	private waveIdentifier: string | null
	private waveStartAt: number | null
	private tiebreakOrder: object | null

    // SonarLint TODO: Need restructuring so we dont have as many parameters
    constructor(
		id: number,
		phaseId: number | null,
		phaseName: string | null,
		displayIdentifier: string | null,
		firstRoundTime: number | null,
		state: number | null,
		waveId: number | null,
		waveIdentifier: string | null,
		waveStartAt: number | null,
		tiebreakOrder: object | null
	){
		this.id = id 
		this.phaseId = phaseId
		this.phaseName = phaseName
		this.displayIdentifier = displayIdentifier  
		this.firstRoundTime = firstRoundTime  
		this.state = state
		this.waveId = waveId
		this.waveIdentifier = waveIdentifier
		this.waveStartAt = waveStartAt
		this.tiebreakOrder = tiebreakOrder  
	}

	public getId(): number {
		return this.id
	}

	public getPhaseId(): number | null{
		return this.phaseId
	}

	public getPhaseName(): string | null{
    		return this.phaseName
    	}

	public getDisplayIdentifier(): string | null{
		return this.displayIdentifier
	}

	public getFirstRoundTime(): number | null{
		return this.firstRoundTime
	}

	public getState(): number | null{
		return this.state
	}

	public getWaveId(): number | null{
		return this.waveId
	}

	public getWaveIdentifier(): string | null{
		return this.waveIdentifier
	}

	public getWaveStartAt(): number | null{
		return this.waveStartAt
	}

	public getTiebreakOrder(): object | [] | null{
		return this.tiebreakOrder
	}

	public async getSeeds(options: ISeedOptions = Seed.getDefaultSeedOptions()): Promise<ISeed[]> {
		log.info('Getting Seeds for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		
		const data: IPhaseGroupSeedData[] = await NI.paginatedQuery(
			`Phase Group Seeds [${this.id}]`,
			queries.phaseGroupSeeds, {id: this.id},
			options, {}, 2
		)

		const phaseGroups = _.flatten(data.map(pg => pg.phaseGroup))
		const seedData: ISeedData[] = _.flatten(phaseGroups.map(pg => pg.paginatedSeeds.nodes))
		const seeds = seedData.map(seed => Seed.parse(seed))
		return _.uniqBy(seeds, 'id')
	}

	public async getEntrants(options: IEntrantOptions = Entrant.getDefaultEntrantOptions()): Promise<IEntrant[]>{
		log.info('Getting Entrants for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		const phaseGroupEntrantData: IPhaseGroupEntrantData[] = await NI.paginatedQuery(
			`Phase Group Entrants [${this.id}]`, 
			queries.phaseGroupEntrants, {id: this.id},
			options, {}, 2
		) 
		const phaseGroups = phaseGroupEntrantData.map(groupData => groupData.phaseGroup)
		const entrants: IEntrant[] = 
			_.flatten(phaseGroups.map(
				pg => pg.paginatedSeeds.nodes.map(
					(e: IEntrantDataFull) => Entrant.parseFull(e)
				).filter(seed => seed != null)))
		return _.uniqBy(entrants, 'id')
	}

	public async getAttendees(options: IAttendeeOptions = Attendee.getDefaultAttendeeOptions()): Promise<IAttendee[]>{
		log.info('Getting Attendees for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		const data: IPhaseGroupAttendeeData[] = await NI.paginatedQuery(
			`Phase Group Attendees [${this.id}]`,
			queries.phaseGroupAttendees, {id: this.id},
			options, {}, 2
		)
		const seeds = _.flatten(data.map(entrant => entrant.phaseGroup.paginatedSeeds.nodes))
		const entrants = seeds.map(seed => seed.entrant).filter(entrant => entrant != null)
		const attendeeData: IAttendeeData[] = _.flatten(entrants.map(entrant => entrant.participants))
		const attendees: IAttendee[] = attendeeData.map(a => Attendee.parse(a))
		return _.uniqBy(attendees, 'id')
	}

	public async getSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()): Promise<IGGSet[]>{
		log.info('Getting Sets for Phase Group [%s]', this.id)
		log.verbose('Query variables: %s', JSON.stringify(options))
		const data: IPhaseGroupSetData[] = await NI.paginatedQuery(
			`Phase Group Sets [${this.id}]`,
			queries.phaseGroupSets, {id: this.id},
			options, {}, 2
		)
		const phaseGroups = data.map(pg => pg.phaseGroup)

		let sets: IGGSet[] = 
			_.flatten(phaseGroups.map(pg => pg.paginatedSets.nodes.map(set => GGSet.parse(set)).filter(set => set != null)))
		
		// optional filters
		if(options.filterByes) sets = GGSet.filterOutDQs(sets)
		if(options.filterResets) sets = GGSet.filterOutResets(sets)
		if(options.filterByes) sets = GGSet.filterOutByes(sets)

		return _.uniqBy(sets, 'id')
	}

	public async getCompleteSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()): Promise<IGGSet[]>{
		log.info('Getting Completed sets for Phase Group [%s]', this.id)
		const sets = await this.getSets(options)
		return GGSet.filterForCompleteSets(sets)
	}

	public async getIncompleteSets(options: IGGSetOptions = GGSet.getDefaultSetOptions()): Promise<IGGSet[]>{
		log.info('Getting Incompleted sets for Phase Group [%s]', this.id)
		const sets = await this.getSets(options)
		return GGSet.filterForIncompleteSets(sets)
	}

	public async getSetsXMinutesBack(
		minutes: number, 
		options: IGGSetOptions = GGSet.getDefaultSetOptions()
	): Promise<IGGSet[]>{
		log.info('Getting sets completed %s minutes ago for Phase Group [%s]', minutes, this.id)
		const sets = await this.getSets(options)
		return GGSet.filterForXMinutesBack(sets, minutes)
	}
}
