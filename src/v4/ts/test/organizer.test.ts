import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
//import * as log from '../lib/util/Logger'

import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {IOrganizer} from '../lib/interfaces/IOrganizer'

import {Organizer} from '../lib/models/Organizer'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/tournament.testData'

let org1: IOrganizer, org2: IOrganizer, org3: IOrganizer

const TOURNAMENT_SLUG_1 = 'port-priority-7'
const TOURNAMENT_SLUG_2 = 'genesis-9-1'
const TOURNAMENT_SLUG_3 = 'let-s-make-big-moves-2023'

describe('startgg Organizer', function() {
	this.timeout(10000)

	before(async function() {
		this.timeout(20000)

		Initializer(process.env.API_TOKEN!)

        console.log('Getting organizers...')
        org1 = await Organizer.getByTournament(TOURNAMENT_SLUG_1)
		org2 = await Organizer.getByTournament(TOURNAMENT_SLUG_2)
		org3 = await Organizer.getByTournament(TOURNAMENT_SLUG_3)
		console.log('Retrieval complete! Starting testing...')
		return true
	})

	// id
	it('should get the correct tournament organizer id 1', () => {
		expect(org1.getId()).to.be.equal(testData.organizer1.tournament.owner.id)
	})
	it('should get the correct tournament organizer id 2', () => {
		expect(org2.getId()).to.be.equal(testData.organizer2.tournament.owner.id)
	})
	it('should get the correct tournament organizer id 3', () => {
		expect(org3.getId()).to.be.equal(testData.organizer3.tournament.owner.id)
	})

	// bio
	it('should get the correct tournament organizer bio 1', () => {
		expect(org1.getBio()).to.be.equal(testData.organizer1.tournament.owner.bio)
	})
	it('should get the correct tournament organizer bio 2', () => {
		expect(org2.getBio()).to.be.equal(testData.organizer2.tournament.owner.bio)
	})
	it('should get the correct tournament organizer bio 3', () => {
		expect(org3.getBio()).to.be.equal(testData.organizer3.tournament.owner.bio)
	})

	// email
	it('should get the correct tournament organizer bio 1', () => {
		expect(org1.getEmail()).to.be.equal(testData.organizer1.tournament.owner.email)
	})
	it('should get the correct tournament organizer bio 2', () => {
		expect(org2.getEmail()).to.be.equal(testData.organizer2.tournament.owner.email)
	})
	it('should get the correct tournament organizer bio 3', () => {
		expect(org3.getEmail()).to.be.equal(testData.organizer3.tournament.owner.email)
	})

	// gender pronoun
	it('should get the correct tournament organizer gender pronoun 1', () => {
		expect(org1.getGenderPronoun()).to.be.equal(testData.organizer1.tournament.owner.genderPronoun)
	})
	it('should get the correct tournament organizer gender pronoun 2', () => {
		expect(org2.getGenderPronoun()).to.be.equal(testData.organizer2.tournament.owner.genderPronoun)
	})
	it('should get the correct tournament organizer gender pronoun 3', () => {
		expect(org3.getGenderPronoun()).to.be.equal(testData.organizer3.tournament.owner.genderPronoun)
	})

	// gamerTag
	it('should get the correct tournament organizer gender pronoun 1', () => {
		expect(org1.getGamerTag()).to.be.equal(testData.organizer1.tournament.owner.player.gamerTag)
	})
	it('should get the correct tournament organizer gender pronoun 2', () => {
		expect(org2.getGamerTag()).to.be.equal(testData.organizer2.tournament.owner.player.gamerTag)
	})
	it('should get the correct tournament organizer gender pronoun 3', () => {
		expect(org3.getGamerTag()).to.be.equal(testData.organizer3.tournament.owner.player.gamerTag)
	})
})
