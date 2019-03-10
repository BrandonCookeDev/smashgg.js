import {IAttendee} from '../../lib/Attendee'
import Data = IAttendee.Data
import AttendeeData = IAttendee.AttendeeData

export const participant1Data: AttendeeData = {
	"id": 1148324,
	"gamerTag": "Mew2King",
	"prefix": "MVG FOX",
	"createdAt": 1507144428,
	"claimed": true,
	"verified": true,
	"playerId": 1003,
	"phoneNumber": null,
	"contactInfo": {
		"id": "participants_1148324",
		"city": "Orlando",
		"state": "FL",
		"stateId": null,
		"country": "United States",
		"countryId": null,
		"name": "Jason Zimmerman",
		"nameFirst": "Jason",
		"nameLast": "Zimmerman",
		"zipcode": null
	},
	"connectedAccounts": null,
	"events": [
		{
			"id": 23596
		},
		{
			"id": 23597
		},
		{
			"id": 23598
		},
		{
			"id": 23599
		},
		{
			"id": 23600
		}
	]
}

export const participant2Data: AttendeeData = {
	"id": 928500,
	"gamerTag": "NIX",
	"prefix": "OeS",
	"createdAt": 1499705847,
	"claimed": true,
	"verified": true,
	"playerId": 137417,
	"phoneNumber": null,
	"contactInfo": {
		"id": "participants_928500",
		"city": "Powdersville",
		"state": "SC",
		"stateId": null,
		"country": "United States",
		"countryId": null,
		"name": "Davis Robertson",
		"nameFirst": "Davis",
		"nameLast": "Robertson",
		"zipcode": null
	},
	"connectedAccounts": null,
	"events": [
		{
		"id": 23596
		},
		{
		"id": 23597
		}
	]
}

export const participant3Data: AttendeeData = {
	"id": 1170540,
	"gamerTag": "bobby big ballz",
	"prefix": null,
	"createdAt": 1507935829,
	"claimed": true,
	"verified": true,
	"playerId": 65777,
	"phoneNumber": null,
	"contactInfo": {
		"id": "participants_1170540",
		"city": "fudge floaties forever",
		"state": "MD",
		"stateId": null,
		"country": "United States",
		"countryId": null,
		"name": "",
		"nameFirst": "Isaac",
		"nameLast": "P",
		"zipcode": null
	},
	"connectedAccounts": null,
	"events": [
		{
		"id": 23596
		},
		{
		"id": 23597
		}
	]
}

export const attendee1Data: Data = {
	"participant": participant1Data
}


export const attendee2Data: Data = {
	"participant": participant2Data
		
}

export const attendee3Data: Data = {
	"participant": participant3Data
}