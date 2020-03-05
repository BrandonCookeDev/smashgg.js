import { Attendee } from '../../lib/models/Attendee'
import { IAttendee } from '../../lib/interfaces/IAttendee'
import { IGGSetSlotAttendeeData } from '../../lib/interfaces/IGGSet'
import {
	IAttendeeData,
	IAttendeeDataFull
} from '../../lib/interfaces/IAttendee'

export const participant1Data: IAttendeeData = {
	id: 1148324,
	gamerTag: 'Mew2King',
	prefix: 'MVG FOX',
	createdAt: 1507144428,
	claimed: true,
	verified: true,
	playerId: 1003,
	phoneNumber: null,
	contactInfo: {
		id: 'participants_1148324',
		city: 'Orlando',
		state: 'FL',
		stateId: null,
		country: 'United States',
		countryId: null,
		name: 'Jason Zimmerman',
		nameFirst: 'Jason',
		nameLast: 'Zimmerman',
		zipcode: null
	},
	connectedAccounts: null,
	events: [
		{
			id: 23596
		},
		{
			id: 23597
		},
		{
			id: 23598
		},
		{
			id: 23599
		},
		{
			id: 23600
		}
	]
}

export const participant2Data: IAttendeeData = {
	id: 928500,
	gamerTag: 'NIX',
	prefix: 'OeS',
	createdAt: 1499705847,
	claimed: true,
	verified: true,
	playerId: 137417,
	phoneNumber: null,
	contactInfo: {
		id: 'participants_928500',
		city: 'Powdersville',
		state: 'SC',
		stateId: null,
		country: 'United States',
		countryId: null,
		name: 'Davis Robertson',
		nameFirst: 'Davis',
		nameLast: 'Robertson',
		zipcode: null
	},
	connectedAccounts: null,
	events: [
		{
		id: 23596
		},
		{
		id: 23597
		}
	]
}

export const participant3Data: IAttendeeData = {
	id: 1170540,
	gamerTag: 'bobby big ballz',
	prefix: null,
	createdAt: 1507935829,
	claimed: true,
	verified: true,
	playerId: 65777,
	phoneNumber: null,
	contactInfo: {
		id: 'participants_1170540',
		city: 'fudge floaties forever',
		state: 'MD',
		stateId: null,
		country: 'United States',
		countryId: null,
		name: '',
		nameFirst: 'Isaac',
		nameLast: 'P',
		zipcode: null
	},
	connectedAccounts: null,
	events: [
		{
		id: 23596
		},
		{
		id: 23597
		}
	]
}

export const attendee1Data: IAttendeeDataFull = {
	participant: participant1Data
}

export const attendee2Data: IAttendeeDataFull = {
	participant: participant2Data
}

export const attendee3Data: IAttendeeDataFull = {
	participant: participant3Data
}

export const slotAttendees1: IGGSetSlotAttendeeData = {
	set: {
		slots: [{
			entrant: {
				participants: [ participant1Data, participant2Data, participant3Data ]
			}
		}]
	}
}

export const attendee1: IAttendee = new Attendee(
	participant1Data.id,
	participant1Data.gamerTag,
	participant1Data.prefix,
	participant1Data.createdAt,
	participant1Data.claimed,
	participant1Data.verified,
	participant1Data.playerId,
	participant1Data.phoneNumber,
	participant1Data.connectedAccounts,
	participant1Data.contactInfo,
	participant1Data.events.map(e => e.id),
)

export const attendee2: IAttendee = new Attendee(
	participant2Data.id,
	participant2Data.gamerTag,
	participant2Data.prefix,
	participant2Data.createdAt,
	participant2Data.claimed,
	participant2Data.verified,
	participant2Data.playerId,
	participant2Data.phoneNumber,
	participant2Data.connectedAccounts,
	participant2Data.contactInfo,
	participant2Data.events.map(e => e.id),
)

export const attendee3: IAttendee = new Attendee(
	participant3Data.id,
	participant3Data.gamerTag,
	participant3Data.prefix,
	participant3Data.createdAt,
	participant3Data.claimed,
	participant3Data.verified,
	participant3Data.playerId,
	participant3Data.phoneNumber,
	participant3Data.connectedAccounts,
	participant3Data.contactInfo,
	participant3Data.events.map(e => e.id),
)

export const attendees: IAttendee[] = [
	attendee1, attendee2, attendee3
]
