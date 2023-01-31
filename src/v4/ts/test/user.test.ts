import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import sinon from 'sinon'
import {expect} from 'chai'
import {User} from '../lib/models/User'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/user.testData'

let user1: User, user2: User, user3: User
const USER_ID_1 = 159429 // Davemon
const USER_ID_2 = 34475  // Mike G
const USER_ID_3 = 7802   // j00t
const DAVEMON_RANKINGS = [
	{
		id: 294398,
		title: 'Tennessee: Spring 2018',
		rank: 2
	},
	{
		id: 317143,
		title: 'Tennessee: Fall 2018',
		rank: 2
	}
]

describe('smashgg User', () => {
	before(async function() {
		this.timeout(15000)
		await Initializer(process.env.API_TOKEN!)
		user1 = await User.getById(USER_ID_1)
		user2 = await User.getById(USER_ID_2)
		user3 = await User.getById(USER_ID_3)
		return true
	})

	// equality
	it('should be the expected User object', () => {
		expect(user1).to.deep.equal(User.parse(testData.user1))
	})
	it('should be the expected User object', () => {
		expect(user2).to.deep.equal(User.parse(testData.user2))
	})
	it('should be the expected User object', () => {
		expect(user3).to.deep.equal(User.parse(testData.user3))
	})

	// id
	it('should get the correct id 1', function() {
		this.timeout(5000)
		expect(user1.getId()).to.be.equal(USER_ID_1)
	})
	it('should get the correct id 2', function() {
		this.timeout(5000)
		expect(user2.getId()).to.be.equal(USER_ID_2)
	})
	it('should get the correct id 3', function() {
		this.timeout(5000)
		expect(user3.getId()).to.be.equal(USER_ID_3)
	})

	// player gamertag
	it('should get the correct player  gamer tag 1', function() {
		this.timeout(5000)
		expect(user1.getPlayerGamertag()).to.be.equal('Davemon')
	})
	it('should get the correct player  gamer tag 2', function() {
		this.timeout(5000)
		expect(user2.getPlayerGamertag()).to.be.equal('Mike G')
	})
	it('should get the correct player  gamer tag 3', function() {
		this.timeout(5000)
		expect(user3.getPlayerGamertag()).to.be.equal('j00t')
	})
	
	// prefix
	it('should get the correct sponsor 1', function() {
		this.timeout(5000)
		expect(user1.getSponsor()).to.be.equal('eski')
	})
	it('should get the correct sponsor 2', function() {
		this.timeout(5000)
		expect(user2.getSponsor()).to.be.equal('')
	})
	it('should get the correct sponsor 3', function() {
		this.timeout(5000)
		expect(user3.getSponsor()).to.be.null
	})

	// rankings
	it('should get the correct rankings back 1', async function() {
		this.timeout(5000)
		expect(await user1.getRankings()).to.have.deep.members(DAVEMON_RANKINGS)
		return true
	})
	it('should get the correct rankings back 2', async function() {
		this.timeout(5000)
		expect(await user2.getRankings()).to.be.null
		return true
	})
	it('should get the correct rankings back 3', async function() {
		this.timeout(5000)
		expect(await user3.getRankings()).to.be.null
		return true
	})

	// TODO implement
	// recent sets
	xit('should get the correct recent sets back 1', async function() {
		this.timeout(5000)

	})
	xit('should get the correct recent sets back 2', async function() {
		this.timeout(5000)

	})
	xit('should get the correct recent sets back 3', async function() {
		this.timeout(5000)

	})

})
