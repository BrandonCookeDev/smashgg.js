import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import {expect} from 'chai'
import {User} from '../lib/models/User'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/user.testData'

let user1: User, user2: User, user3: User
const USER_ID_1 = 95277 // Davemon
const USER_ID_2 = 25927  // Mike G
const USER_ID_3 = 4027   // j00t
const DAVID_MONSTER_PLACEMENTS = [
        {
          "placement": 5,
          "container": {
            "id": 590520,
            "name": "Melee singles",
            "tournament": {
              "name": "Phaze Kraze Smash Weekly #2 6/30"
            }
          }
        },
        {
          "placement": 4,
          "container": {
            "id": 366003,
            "name": "Melee Singles",
            "tournament": {
              "name": "Anchor Down Smash #13"
            }
          }
        },
        {
          "placement": 129,
          "container": {
            "id": 317251,
            "name": "Melee - 1v1 Singles",
            "tournament": {
              "name": "Super Smash Con 2019"
            }
          }
        }
      ]

const MIKE_G_PLACEMENTS = [
        {
          "placement": 25,
          "container": {
            "id": 433931,
            "name": "Tekken 7",
            "tournament": {
              "name": "4o4 FIGHT NIGHT X"
            }
          }
        },
        {
          "placement": 65,
          "container": {
            "id": 23596,
            "name": "Melee Singles",
            "tournament": {
              "name": "Tipped Off 12 , Presented by The Lab Gaming Center!"
            }
          }
        },
        {
          "placement": 33,
          "container": {
            "id": 23597,
            "name": "Melee Doubles",
            "tournament": {
              "name": "Tipped Off 12 , Presented by The Lab Gaming Center!"
            }
          }
        }
      ]

const J00T_PLACEMENTS = [
        {
          "placement": 97,
          "container": {
            "id": 36506,
            "name": "Melee Singles",
            "tournament": {
              "name": "Function(3) - Recursion Series"
            }
          }
        },
        {
          "placement": 1025,
          "container": {
            "id": 12830,
            "name": "Melee Singles",
            "tournament": {
              "name": "The Big House 6"
            }
          }
        },
        {
          "placement": 33,
          "container": {
            "id": 10949,
            "name": "Melee Singles",
            "tournament": {
              "name": "WTFox 2"
            }
          }
        }
      ]

describe('startgg User (has some pending)', () => {
	before(async function() {
		this.timeout(15000)
		Initializer(process.env.API_TOKEN!)
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
	it('should get the correct player gamer tag 1', function() {
		this.timeout(5000)
		expect(user1.getPlayerGamertag()).to.be.equal('David Monster')
	})
	it('should get the correct player gamer tag 2', function() {
		this.timeout(5000)
		expect(user2.getPlayerGamertag()).to.be.equal('Mike G')
	})
	it('should get the correct player gamer tag 3', function() {
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

	// rankings (Deprecated)
	it('should get the most recent standings back 1', async function() {
		this.timeout(5000)
		expect(await user1.getRecentStandings()).to.have.deep.members(DAVID_MONSTER_PLACEMENTS)
		return true
	})
	it('should get the most recent standings back 2', async function() {
		this.timeout(5000)
		expect(await user2.getRecentStandings()).to.have.deep.members(MIKE_G_PLACEMENTS)
		return true
	})
	it('should get the most recent standings back 3', async function() {
		this.timeout(5000)
		expect(await user3.getRecentStandings()).to.have.deep.members(J00T_PLACEMENTS)
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
