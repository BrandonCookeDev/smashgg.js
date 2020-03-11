import { Attendee } from '../../lib/models/Attendee'
import { IAttendee } from '../../lib/interfaces/IAttendee'
import { IGGSetSlotAttendeeData } from '../../lib/interfaces/IGGSet'
import {
	IAttendeeData,
	IAttendeeDataFull
} from '../../lib/interfaces/IAttendee'

export const attendee1Data: IAttendeeData = {
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

export const attendee2Data: IAttendeeData = {
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

export const attendee3Data: IAttendeeData = {
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

export const attendee1DataFull: IAttendeeDataFull = {
	participant: attendee1Data
}

export const attendee2DataFull: IAttendeeDataFull = {
	participant: attendee2Data
}

export const attendee3DataFull: IAttendeeDataFull = {
	participant: attendee3Data
}

export const slotAttendees1: IGGSetSlotAttendeeData = {
	set: {
		slots: [{
			entrant: {
				participants: [ attendee1Data, attendee2Data, attendee3Data ]
			}
		}]
	}
}

export const attendee1: IAttendee = new Attendee(
	attendee1Data.id,
	attendee1Data.gamerTag,
	attendee1Data.prefix,
	attendee1Data.createdAt,
	attendee1Data.claimed,
	attendee1Data.verified,
	attendee1Data.playerId,
	attendee1Data.phoneNumber,
	attendee1Data.connectedAccounts,
	attendee1Data.contactInfo,
	attendee1Data.events.map(e => e.id),
)

export const attendee2: IAttendee = new Attendee(
	attendee2Data.id,
	attendee2Data.gamerTag,
	attendee2Data.prefix,
	attendee2Data.createdAt,
	attendee2Data.claimed,
	attendee2Data.verified,
	attendee2Data.playerId,
	attendee2Data.phoneNumber,
	attendee2Data.connectedAccounts,
	attendee2Data.contactInfo,
	attendee2Data.events.map(e => e.id),
)

export const attendee3: IAttendee = new Attendee(
	attendee3Data.id,
	attendee3Data.gamerTag,
	attendee3Data.prefix,
	attendee3Data.createdAt,
	attendee3Data.claimed,
	attendee3Data.verified,
	attendee3Data.playerId,
	attendee3Data.phoneNumber,
	attendee3Data.connectedAccounts,
	attendee3Data.contactInfo,
	attendee3Data.events.map(e => e.id),
)

export const attendees: IAttendee[] = [
	attendee1, attendee2, attendee3
]
