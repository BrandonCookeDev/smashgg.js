import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import {expect} from 'chai'
import {Entrant} from '../lib/models/Entrant'
import {Attendee} from '../lib/models/Attendee'
import Initializer from '../lib/util/Initializer'

import * as testData from './data/player.testData'
let player1: Entrant, player2: Entrant, player3: Entrant

describe('startgg Player (Entrant) Singles', () => {
	before(async () => {
		Initializer(process.env.API_TOKEN!)
		player1 = Entrant.parse(testData.player1Data)
		player2 = Entrant.parse(testData.player2Data)
		player3 = Entrant.parse(testData.player3Data)
		return true
	})

	// id
	it('should get the correct Player (smash.gg Entrant) Id 1', () => {
		expect(player1.getId()).to.be.equal(testData.player1Data.id)
	})
	it('should get the correct Player (smash.gg Entrant) Id 2', () => {
		expect(player2.getId()).to.be.equal(testData.player2Data.id)
	})
	it('should get the correct Player (smash.gg Entrant) Id 3', () => {
		expect(player3.getId()).to.be.equal(testData.player3Data.id)
	})

	// name
	it('should get the correct Player name 1', () => {
		expect(player1.getName()).to.be.equal(testData.player1Data.name)
	})
	it('should get the correct Player name 2', () => {
		expect(player2.getName()).to.be.equal(testData.player2Data.name)
	})
	it('should get the correct Player name 3', () => {
		expect(player3.getName()).to.be.equal(testData.player3Data.name)
	})
	
	// eventId
	it('should get the correct Event ID of the Player 1', () => {
		expect(player1.getEventId()).to.be.equal(testData.player1Data.eventId)
	})
	it('should get the correct Event ID of the Player 2', () => {
		expect(player2.getEventId()).to.be.equal(testData.player2Data.eventId)
	})
	it('should get the correct Event ID of the Player 3', () => {
		expect(player3.getEventId()).to.be.equal(testData.player3Data.eventId)
	})

	// skill
	it('should get the correct Player skill 1', () => {
		expect(player1.getSkill()).to.be.equal(testData.player1Data.skill)
	})
	it('should get the correct Player skill 2', () => {
		expect(player1.getSkill()).to.be.equal(testData.player1Data.skill)
	})
	it('should get the correct Player skill 3', () => {
		expect(player3.getSkill()).to.be.equal(testData.player3Data.skill)
	})

	// attendee data
	it('should get the correct Player Attendee Data (smash.gg Participant) object 1', () => {
		expect(player1.getAttendeeData()).to.have.deep.members([Attendee.parse(testData.player1Data.participants[0])])
	})
	it('should get the correct Player Attendee Data (smash.gg Participant) object 2', () => {
		expect(player2.getAttendeeData()).to.have.deep.members([Attendee.parse(testData.player2Data.participants[0])])
	})
	it('should get the correct Player Attendee Data (smash.gg Participant) object 3', () => {
		expect(player3.getAttendeeData()).to.have.deep.members([Attendee.parse(testData.player3Data.participants[0])])
	})

	// attendee
	it('should get the correct Player Attendee (smash.gg Participant) object 1', () => {
		expect(player1.getAttendee()).to.deep.equal(Attendee.parse(testData.player1Data.participants[0]))
	})
	it('should get the correct Player Attendee (smash.gg Participant) object 2', () => {
		expect(player2.getAttendee()).to.deep.equal(Attendee.parse(testData.player2Data.participants[0]))
	})
	it('should get the correct Player Attendee (smash.gg Participant) object 3', () => {
		expect(player3.getAttendee()).to.deep.equal(Attendee.parse(testData.player3Data.participants[0]))
	})

	// attendee id
	it('should get the correct Player Attendee (smash.gg Participant) id 1', () => {
		expect(player1.getAttendeeId()).to.be.equal(testData.player1Data.participants[0].id)
	})
	it('should get the correct Player Attendee (smash.gg Participant) id 2', () => {
		expect(player2.getAttendeeId()).to.be.equal(testData.player2Data.participants[0].id)
	})
	it('should get the correct Player Attendee (smash.gg Participant) id 3', () => {
		expect(player3.getAttendeeId()).to.be.equal(testData.player3Data.participants[0].id)
	})

	// gamer tag
	it('should get the correct Player Attendee (smash.gg Participant) gamer tag 1', () => {
		expect(player1.getGamerTag()).to.be.equal(testData.player1Data.participants[0].gamerTag)
	})
	it('should get the correct Player Attendee (smash.gg Participant) gamer tag 2', () => {
		expect(player2.getGamerTag()).to.be.equal(testData.player2Data.participants[0].gamerTag)
	})
	it('should get the correct Player Attendee (smash.gg Participant) gamer tag 3', () => {
		expect(player3.getGamerTag()).to.be.equal(testData.player3Data.participants[0].gamerTag)
	})

	// sponsor
	it('should get the correct Player Attendee (smash.gg Participant) sponsor 1', () => {
		expect(player1.getSponsor()).to.be.equal(testData.player1Data.participants[0].prefix)
	})
	it('should get the correct Player Attendee (smash.gg Participant) sponsor 2', () => {
		expect(player2.getSponsor()).to.be.equal(testData.player2Data.participants[0].prefix)
	})
	it('should get the correct Player Attendee (smash.gg Participant) sponsor 3', () => {
		expect(player3.getSponsor()).to.be.equal(testData.player3Data.participants[0].prefix)
	})

	// phone number
	it('should get the correct Player Attendee (smash.gg Participant) phone number 1', () => {
		expect(player1.getPhoneNumber()).to.be.equal(testData.player1Data.participants[0].phoneNumber)
	})
	it('should get the correct Player Attendee (smash.gg Participant) phone number 2', () => {
		expect(player2.getPhoneNumber()).to.be.equal(testData.player2Data.participants[0].phoneNumber)
	})
	it('should get the correct Player Attendee (smash.gg Participant) phone number 3', () => {
		expect(player3.getPhoneNumber()).to.be.equal(testData.player3Data.participants[0].phoneNumber)
	})

	// contact info
	it('should get the correct Player Attendee (smash.gg Participant) contact info 1', () => {
		expect(player1.getContactInfo()).to.deep.equal(testData.player1Data.participants[0].contactInfo)
	})
	it('should get the correct Player Attendee (smash.gg Participant) contact info 2', () => {
		expect(player1.getContactInfo()).to.deep.equal(testData.player1Data.participants[0].contactInfo)
	})
	it('should get the correct Player Attendee (smash.gg Participant) contact info 3', () => {
		expect(player1.getContactInfo()).to.deep.equal(testData.player1Data.participants[0].contactInfo)
	})

	// city
	it('should get the correct Player Attendee (smash.gg Participant) city 1', () => {
		expect(player1.getCity()).to.be.equal(testData.player1Data.participants[0].contactInfo!.city)
	})
	it('should get the correct Player Attendee (smash.gg Participant) city 2', () => {
		expect(player2.getCity()).to.be.equal(testData.player2Data.participants[0].contactInfo!.city)
	})
	it('should get the correct Player Attendee (smash.gg Participant) city 3', () => {
		expect(player3.getCity()).to.be.equal(testData.player3Data.participants[0].contactInfo!.city)
	})

	// state 
	it('should get the correct Player Attendee (smash.gg Participant) state 1', () => {
		expect(player1.getState()).to.be.equal(testData.player1Data.participants[0].contactInfo!.state)
	})
	it('should get the correct Player Attendee (smash.gg Participant) state 2', () => {
		expect(player2.getState()).to.be.equal(testData.player2Data.participants[0].contactInfo!.state)
	})
	it('should get the correct Player Attendee (smash.gg Participant) state 3', () => {
		expect(player3.getState()).to.be.equal(testData.player3Data.participants[0].contactInfo!.state)
	})

	// state id
	it('should get the correct Player Attendee (smash.gg Participant) state id 1', () => {
		expect(player1.getStateId()).to.be.equal(testData.player1Data.participants[0].contactInfo!.stateId)
	})
	it('should get the correct Player Attendee (smash.gg Participant) state id 2', () => {
		expect(player2.getStateId()).to.be.equal(testData.player2Data.participants[0].contactInfo!.stateId)
	})
	it('should get the correct Player Attendee (smash.gg Participant) state id 3', () => {
		expect(player3.getStateId()).to.be.equal(testData.player3Data.participants[0].contactInfo!.stateId)
	})

	// country
	it('should get the correct Player Attendee (smash.gg Participant) country 1', () => {
		expect(player1.getCountry()).to.be.equal(testData.player1Data.participants[0].contactInfo!.country)
	})
	it('should get the correct Player Attendee (smash.gg Participant) country 2', () => {
		expect(player2.getCountry()).to.be.equal(testData.player2Data.participants[0].contactInfo!.country)
	})
	it('should get the correct Player Attendee (smash.gg Participant) country 3', () => {
		expect(player3.getCountry()).to.be.equal(testData.player3Data.participants[0].contactInfo!.country)
	})

	// country id
	it('should get the correct Player Attendee (smash.gg Participant) country id 1', () => {
		expect(player1.getStateId()).to.be.equal(testData.player1Data.participants[0].contactInfo!.countryId)
	})
	it('should get the correct Player Attendee (smash.gg Participant) country id 2', () => {
		expect(player2.getStateId()).to.be.equal(testData.player2Data.participants[0].contactInfo!.countryId)
	})
	it('should get the correct Player Attendee (smash.gg Participant) country id 3', () => {
		expect(player3.getStateId()).to.be.equal(testData.player3Data.participants[0].contactInfo!.countryId)
	})

	// contact name
	it('should get the correct Player Attendee (smash.gg Participant) contact name 1', () => {
		expect(player1.getContactName()).to.be.equal(testData.player1Data.participants[0].contactInfo!.name)
	})
	it('should get the correct Player Attendee (smash.gg Participant) contact name 2', () => {
		expect(player2.getContactName()).to.be.equal(testData.player2Data.participants[0].contactInfo!.name)
	})
	it('should get the correct Player Attendee (smash.gg Participant) contact name 3', () => {
		expect(player3.getContactName()).to.be.equal(testData.player3Data.participants[0].contactInfo!.name)
	})

	// first name
	it('should get the correct Player Attendee (smash.gg Participant) first name 1', () => {
		expect(player1.getFirstName()).to.be.equal(testData.player1Data.participants[0].contactInfo!.nameFirst)
	})
	it('should get the correct Player Attendee (smash.gg Participant) first name 2', () => {
		expect(player2.getFirstName()).to.be.equal(testData.player2Data.participants[0].contactInfo!.nameFirst)
	})
	it('should get the correct Player Attendee (smash.gg Participant) first name 3', () => {
		expect(player3.getFirstName()).to.be.equal(testData.player3Data.participants[0].contactInfo!.nameFirst)
	})

	// last name
	it('should get the correct Player Attendee (smash.gg Participant) last name 1', () => {
		expect(player1.getLastName()).to.be.equal(testData.player1Data.participants[0].contactInfo!.nameLast)
	})
	it('should get the correct Player Attendee (smash.gg Participant) last name 2', () => {
		expect(player2.getLastName()).to.be.equal(testData.player2Data.participants[0].contactInfo!.nameLast)
	})
	it('should get the correct Player Attendee (smash.gg Participant) last name 3', () => {
		expect(player3.getLastName()).to.be.equal(testData.player3Data.participants[0].contactInfo!.nameLast)
	})

	// zipcode
	it('should get the correct Player Attendee (smash.gg Participant) zipcode 1', () => {
		expect(player1.getZipcode()).to.be.equal(testData.player1Data.participants[0].contactInfo!.zipcode)
	})
	it('should get the correct Player Attendee (smash.gg Participant) zipcode 2', () => {
		expect(player2.getZipcode()).to.be.equal(testData.player2Data.participants[0].contactInfo!.zipcode)
	})
	it('should get the correct Player Attendee (smash.gg Participant) zipcode 3', () => {
		expect(player3.getZipcode()).to.be.equal(testData.player3Data.participants[0].contactInfo!.zipcode)
	})

	// connected accounts
	it('should get the correct Player Attendee (smash.gg Participant) id', () => {
		expect(player1.getConnectedAccounts()).to.be.equal(testData.player1Data.participants[0].connectedAccounts)
	})

})

/*
describe('startgg Player (Entrant) Doubles', () => {
	before(async () => {
		//player1 = Player.parse(testData.player1Data)
		//player2 = Player.parse(testData.player2Data)
		//player3 = Player.parse(testData.player3Data)
		return true
	})
})
*/
