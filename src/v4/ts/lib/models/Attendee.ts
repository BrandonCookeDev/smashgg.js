import _ from 'lodash'
import Log from '../util/Logger'
import * as queries from '../scripts/attendeeQueries'
import NI from '../util/NetworkInterface'

import {IContactInfo} from '../interfaces/IContactInfo'
import {IAttendee, 
	IAttendeeData, 
	IAttendeeOptions,
	IAttendeeDataFull, 
	IAttendeeWithPhasesData, 
	IAttendeeWithPhaseGroupsData
} from '../interfaces/IAttendee'
import {IPhaseGroup, IPhaseGroupData} from '../interfaces/IPhaseGroup'
import {IPhase, IPhaseData} from '../interfaces/IPhase'

import {User} from './User' // TODO change to internal later
import { Phase } from './Phase'
import { PhaseGroup } from './PhaseGroup'

export class Attendee implements IAttendee{
	public static parse(data: IAttendeeData): IAttendee {
        const eventIds = data.events ? data.events.map(event => event.id) : null
		return new Attendee(
			data.id,
			data.gamerTag,
			data.prefix,
			data.createdAt,
			data.claimed,
			data.verified,
			data.playerId,
			data.phoneNumber,
			data.connectedAccounts,
			data.contactInfo,
			eventIds
		)
	}
	
	public static parseFull(data: IAttendeeDataFull): IAttendee{
		return this.parse(data.participant)
	}

	public static eq(a1: IAttendee, a2: IAttendee){
		return a1.getGamerTag() === a2.getGamerTag() && 
				a1.getSponsor() === a2.getSponsor() && 
				a1.getPlayerId() === a2.getPlayerId()
	}

	public static getDefaultAttendeeOptions(): IAttendeeOptions{
		return {
			areSeedsPublished: true,
			page: null,
			perPage: 1,
			sortBy: null,
			filter: null
		}
	}
	
	private id: number
	private gamerTag: string
	private prefix: string | null
	private createdAt: number | null
	private claimed: boolean | null
	private verified: boolean | null
	private playerId: number | null
	private phoneNumber: number | null
	private connectedAccounts: object | null
	private contactInfo: IContactInfo | null
	private eventIds: number[] | null

    // SonarLint TODO: Need restructuring so we dont have as many parameters
	constructor(
		id: number,
		gamerTag: string,
		prefix: string | null,
		createdAt: number | null,
		claimed: boolean | null,
		verified: boolean | null,
		playerId: number | null,
		phoneNumber: number | null,
		connectedAccounts: object | null,
		contactInfo: IContactInfo | null,
		eventIds: number[] | null
	){
		this.id = id
		this.gamerTag = gamerTag
		this.prefix = prefix
		this.createdAt = createdAt
		this.claimed = claimed
		this.verified = verified
		this.playerId = playerId
		this.phoneNumber = phoneNumber
		this.contactInfo = contactInfo
		this.connectedAccounts = connectedAccounts
		this.eventIds = eventIds
	}

	public getId(): number{
		return this.id
	}
	
	public getGamerTag(): string{
		return this.gamerTag
	}
	
	public getSponsor(): string | null{
		return this.prefix
	}
	
	public getCreatedAt(): number | null{
		return this.createdAt
	}
	
	public getClaimed(): boolean | null{
		return this.claimed
	}
	
	public getVerified(): boolean | null{
		return this.verified
	}
	
	public getPlayerId(): number | null{
		return this.playerId
	}
	
	public getPhoneNumber(): number | null{
		return this.phoneNumber
	}
	
	public getContactInfo(): IContactInfo | null {
		return this.contactInfo
	}

	public getCity(): string | null{
		if(this.contactInfo)
			return this.contactInfo.city
		else return null
	}

	public getState(): string | null{
		if(this.contactInfo)
			return this.contactInfo.state
		else return null
	}

	public getStateId(): number | null{
		if(this.contactInfo)
			return this.contactInfo.stateId
		else return null
	}

	public getCountry(): string | null{
		if(this.contactInfo)
			return this.contactInfo.country
		else return null
	}

	public getCountryId(): number | null{
		if(this.contactInfo)
			return this.contactInfo.countryId
		else return null
	}

	public getContactName(): string | null{
		if(this.contactInfo)
			return this.contactInfo.name
		else return null
	}
	public getFirstName(): string | null{
		if(this.contactInfo)
			return this.contactInfo.nameFirst
		else return null
	}

	public getLastName(): string | null{
		if(this.contactInfo)
			return this.contactInfo.nameLast
		else return null
	}

	public getZipcode(): string | null{
		if(this.contactInfo)
			return this.contactInfo.zipcode
		else return null
	}
	
	public getConnectedAccounts(): object | null{
		return this.connectedAccounts
	}

	/* TODO implement
	async getEvents() : Promise<Event[]> {
		Log.info('Getting Events that Attendee %s (Participant %s) entered', this.gamerTag, this.id);
		return Event.getByIds();
	}
	*/

	public async getUserAccount(): Promise<User> {
		Log.info('Getting User account that Attendee %s (Participant %s) entered', this.gamerTag, this.id)
		return await User.getById(this.playerId!)
	}

	public async getEnteredPhases(): Promise<IPhase[]> {
		Log.info('Getting Phases that Attendee %s (Participant %s) entered', this.gamerTag, this.id)
		const data: IAttendeeWithPhasesData = await NI.query(queries.getAttendeePhases, {id: this.id})
		const seedData = _.flatten(data.participant.entrants.map(entrant => entrant.seeds))
		const phaseData: IPhaseData[] = _.flatten(seedData.map(seed => seed.phase))
		const phases: IPhase[] = phaseData.map(phase => Phase.parse(phase))
		return phases
	}

	public async getEnteredPhaseGroups(): Promise<IPhaseGroup[]> {
		Log.info('Getting Phase Groups that Attendee %s (Participant %s) entered', this.gamerTag, this.id)
		const data: IAttendeeWithPhaseGroupsData = await NI.query(queries.getAttendeePhaseGroups, {id: this.id})
		const seedData = _.flatten(data.participant.entrants.map(entrant => entrant.seeds))
		const groupData: IPhaseGroupData[] = _.flatten(seedData.map(seed => seed.phaseGroup))
		const groups: IPhaseGroup[] = groupData.map(group => PhaseGroup.parse(group))
		return groups
	}
}
