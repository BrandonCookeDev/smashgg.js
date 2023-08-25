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

export const attendee1Data: IAttendeeDataFull = {
	participant: participant1Data
}

export const attendee2Data: IAttendeeDataFull = {
	participant: participant2Data
}
