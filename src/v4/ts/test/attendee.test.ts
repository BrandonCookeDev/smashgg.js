import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import {expect} from 'chai'

import {IAttendee} from '../lib/interfaces/IAttendee'

import {Attendee} from '../lib/models/Attendee'
import {User} from '../lib/models/User'
import {Phase} from '../lib/models/Phase'
import {PhaseGroup} from '../lib/models/PhaseGroup'
import Initializer from '../lib/util/Initializer'

import * as testData from './data/attendee.testData'
let attendee1: IAttendee, attendee2: IAttendee, attendee3: IAttendee

describe('startgg Attendee (Participant)', () => {
	before(async () => {
		Initializer(process.env.API_TOKEN!)
		attendee1 = Attendee.parseFull(testData.attendee1Data)
		attendee2 = Attendee.parseFull(testData.attendee2Data)
		attendee3 = Attendee.parseFull(testData.attendee3Data)
		return true
	})

	// attendee id
	it('should get the correct attendee Attendee (smash.gg Participant) id 1', () => {
		expect(attendee1.getId()).to.be.equal(testData.attendee1Data.participant.id)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) id 2', () => {
		expect(attendee2.getId()).to.be.equal(testData.attendee2Data.participant.id)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) id 3', () => {
		expect(attendee3.getId()).to.be.equal(testData.attendee3Data.participant.id)
	})

	// gamer tag
	it('should get the correct attendee Attendee (smash.gg Participant) gamer tag 1', () => {
		expect(attendee1.getGamerTag()).to.be.equal(testData.attendee1Data.participant.gamerTag)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) gamer tag 2', () => {
		expect(attendee2.getGamerTag()).to.be.equal(testData.attendee2Data.participant.gamerTag)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) gamer tag 3', () => {
		expect(attendee3.getGamerTag()).to.be.equal(testData.attendee3Data.participant.gamerTag)
	})

	// sponsor
	it('should get the correct attendee Attendee (smash.gg Participant) sponsor 1', () => {
		expect(attendee1.getSponsor()).to.be.equal(testData.attendee1Data.participant.prefix)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) sponsor 2', () => {
		expect(attendee2.getSponsor()).to.be.equal(testData.attendee2Data.participant.prefix)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) sponsor 3', () => {
		expect(attendee3.getSponsor()).to.be.equal(testData.attendee3Data.participant.prefix)
	})

	// phone number
	it('should get the correct attendee Attendee (smash.gg Participant) phone number 1', () => {
		expect(attendee1.getPhoneNumber()).to.be.equal(testData.attendee1Data.participant.phoneNumber)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) phone number 2', () => {
		expect(attendee2.getPhoneNumber()).to.be.equal(testData.attendee2Data.participant.phoneNumber)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) phone number 3', () => {
		expect(attendee3.getPhoneNumber()).to.be.equal(testData.attendee3Data.participant.phoneNumber)
	})

	// contact info
	it('should get the correct attendee Attendee (smash.gg Participant) contact info 1', () => {
		expect(attendee1.getContactInfo()).to.deep.equal(testData.attendee1Data.participant.contactInfo)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) contact info 2', () => {
		expect(attendee1.getContactInfo()).to.deep.equal(testData.attendee1Data.participant.contactInfo)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) contact info 3', () => {
		expect(attendee1.getContactInfo()).to.deep.equal(testData.attendee1Data.participant.contactInfo)
	})

	// city
	it('should get the correct attendee Attendee (smash.gg Participant) city 1', () => {
		expect(attendee1.getCity()).to.be.equal(testData.attendee1Data.participant.contactInfo!.city)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) city 2', () => {
		expect(attendee2.getCity()).to.be.equal(testData.attendee2Data.participant.contactInfo!.city)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) city 3', () => {
		expect(attendee3.getCity()).to.be.equal(testData.attendee3Data.participant.contactInfo!.city)
	})

	// state 
	it('should get the correct attendee Attendee (smash.gg Participant) state 1', () => {
		expect(attendee1.getState()).to.be.equal(testData.attendee1Data.participant.contactInfo!.state)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) state 2', () => {
		expect(attendee2.getState()).to.be.equal(testData.attendee2Data.participant.contactInfo!.state)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) state 3', () => {
		expect(attendee3.getState()).to.be.equal(testData.attendee3Data.participant.contactInfo!.state)
	})

	// state id
	it('should get the correct attendee Attendee (smash.gg Participant) state id 1', () => {
		expect(attendee1.getStateId()).to.be.equal(testData.attendee1Data.participant.contactInfo!.stateId)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) state id 2', () => {
		expect(attendee2.getStateId()).to.be.equal(testData.attendee2Data.participant.contactInfo!.stateId)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) state id 3', () => {
		expect(attendee3.getStateId()).to.be.equal(testData.attendee3Data.participant.contactInfo!.stateId)
	})

	// country
	it('should get the correct attendee Attendee (smash.gg Participant) country 1', () => {
		expect(attendee1.getCountry()).to.be.equal(testData.attendee1Data.participant.contactInfo!.country)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) country 2', () => {
		expect(attendee2.getCountry()).to.be.equal(testData.attendee2Data.participant.contactInfo!.country)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) country 3', () => {
		expect(attendee3.getCountry()).to.be.equal(testData.attendee3Data.participant.contactInfo!.country)
	})

	// country id
	it('should get the correct attendee Attendee (smash.gg Participant) country id 1', () => {
		expect(attendee1.getStateId()).to.be.equal(testData.attendee1Data.participant.contactInfo!.countryId)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) country id 2', () => {
		expect(attendee2.getStateId()).to.be.equal(testData.attendee2Data.participant.contactInfo!.countryId)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) country id 3', () => {
		expect(attendee3.getStateId()).to.be.equal(testData.attendee3Data.participant.contactInfo!.countryId)
	})

	// contact name
	it('should get the correct attendee Attendee (smash.gg Participant) contact name 1', () => {
		expect(attendee1.getContactName()).to.be.equal(testData.attendee1Data.participant.contactInfo!.name)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) contact name 2', () => {
		expect(attendee2.getContactName()).to.be.equal(testData.attendee2Data.participant.contactInfo!.name)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) contact name 3', () => {
		expect(attendee3.getContactName()).to.be.equal(testData.attendee3Data.participant.contactInfo!.name)
	})

	// first name
	it('should get the correct attendee Attendee (smash.gg Participant) first name 1', () => {
		expect(attendee1.getFirstName()).to.be.equal(testData.attendee1Data.participant.contactInfo!.nameFirst)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) first name 2', () => {
		expect(attendee2.getFirstName()).to.be.equal(testData.attendee2Data.participant.contactInfo!.nameFirst)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) first name 3', () => {
		expect(attendee3.getFirstName()).to.be.equal(testData.attendee3Data.participant.contactInfo!.nameFirst)
	})

	// last name
	it('should get the correct attendee Attendee (smash.gg Participant) last name 1', () => {
		expect(attendee1.getLastName()).to.be.equal(testData.attendee1Data.participant.contactInfo!.nameLast)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) last name 2', () => {
		expect(attendee2.getLastName()).to.be.equal(testData.attendee2Data.participant.contactInfo!.nameLast)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) last name 3', () => {
		expect(attendee3.getLastName()).to.be.equal(testData.attendee3Data.participant.contactInfo!.nameLast)
	})

	// zipcode
	it('should get the correct attendee Attendee (smash.gg Participant) zipcode 1', () => {
		expect(attendee1.getZipcode()).to.be.equal(testData.attendee1Data.participant.contactInfo!.zipcode)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) zipcode 2', () => {
		expect(attendee2.getZipcode()).to.be.equal(testData.attendee2Data.participant.contactInfo!.zipcode)
	})
	it('should get the correct attendee Attendee (smash.gg Participant) zipcode 3', () => {
		expect(attendee3.getZipcode()).to.be.equal(testData.attendee3Data.participant.contactInfo!.zipcode)
	})

	// user account
	it('should get the correct user account for an attendee 1', async function() {
		this.timeout(5000)
		const actual = await User.getById(attendee1.getPlayerId()!)
		
		expect(actual).to.be.instanceof(User)
		expect(actual).to.not.be.equal(null)

		// expect(actual).to.deep.equal(User.parse(testUser.user4))
	})

	it('should get the correct user account for an attendee 2', async function() {
		this.timeout(5000)
		const actual = await User.getById(attendee2.getPlayerId()!)
		
		expect(actual).to.be.instanceof(User)
		expect(actual).to.not.be.equal(null)
		
		// expect(actual).to.deep.equal(User.parse(testUser.user5))
	})

	// phases entered
	it('should get the correct phases an attendee entered 1', async function() {
		this.timeout(5000)
		const actual = await attendee1.getEnteredPhases()
		expect(actual.length).to.be.greaterThan(0)
		
		actual.forEach(data => {
			expect(data).to.be.instanceOf(Phase)
		})
	})

	it('should get the correct phases an attendee entered 2', async function() {
		this.timeout(5000)
		const actual = await attendee2.getEnteredPhases()
		expect(actual.length).to.be.greaterThan(0)
		
		actual.forEach(data => {
			expect(data).to.be.instanceOf(Phase)
		})
	})

	// phase groups entered
	it('should get the correct phase groups an attendee entered 1', async function() {
		this.timeout(5000)
		const actual = await attendee1.getEnteredPhaseGroups()
		expect(actual.length).to.be.greaterThan(0)
		
		actual.forEach(data => {
			expect(data).to.be.instanceOf(PhaseGroup)
		})
	})

	it('should get the correct phase groups an attendee entered 2', async function() {
		this.timeout(5000)
		const actual = await attendee2.getEnteredPhaseGroups()
		expect(actual.length).to.be.greaterThan(0)
		
		actual.forEach(data => {
			expect(data).to.be.instanceOf(PhaseGroup)
		})
	})
})
