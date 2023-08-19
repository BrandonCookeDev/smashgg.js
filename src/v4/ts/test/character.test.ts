import chai from 'chai'
const util = require('util')
const {expect} = chai

import {Character} from '../lib/models/Character'
import Cache from '../lib/util/Cache'

const MELEE_CHAR_COUNT = 28
const PM_CHAR_COUNT = 43
const BOWSER_ID = 1
const MELEE_ID = 1
const WOLF_ID = 116
const PM_ID = 2

describe('startgg Character', () => {

	beforeEach(async () => {
		Cache.getInstance().flushAll()
	})

	it('should get all characters', async function() {
		this.timeout(10000)

		const characters = await Character.getAll()
		expect(characters.length > 0).to.be.equal(true)

		characters.forEach(character => {
			expect(character).to.be.instanceof(Character)
		})

		return true
	})

	it('should get a character by id number', async function() {
		this.timeout(10000)

		const bowser: Character = await Character.getById(BOWSER_ID) as Character
		const wolf: Character = await Character.getById(WOLF_ID) as Character

		expect(bowser).to.be.instanceof(Character)
		expect(wolf).to.be.instanceof(Character)

		expect(bowser.getName()).to.be.equal('Bowser')
		expect(wolf.getName()).to.be.equal('Wolf')

		return true
	})

	it('should get all characters for a game by game id', async function() {
		this.timeout(10000)

		const meleeCharacters = await Character.getByGameId(MELEE_ID)
		//console.log(util.inspect(meleeCharacters, {showHidden: false, depth: null, colors: true}))
		const pmCharacters = await Character.getByGameId(PM_ID)

		expect(meleeCharacters.length).to.be.equal(MELEE_CHAR_COUNT)
		expect(pmCharacters.length).to.be.equal(PM_CHAR_COUNT)

		meleeCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character)
		})

		pmCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character)
		})

		return true
	})

	it('should get all characters for a game by game name', async function() {
		this.timeout(10000)

		const meleeCharacters = await Character.getByGameName('melee')
		const pmCharacters = await Character.getByGameName('pm')

		expect(meleeCharacters.length).to.be.equal(MELEE_CHAR_COUNT)
		expect(pmCharacters.length).to.be.equal(PM_CHAR_COUNT)

		meleeCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character)
		})

		pmCharacters.forEach(character => {
			expect(character).to.be.instanceof(Character)
		})

		return true
	})

	it('should get characters by their name', async function() {
		this.timeout(10000)

		const bowser = await Character.getByName('bowser')
		const wolf = await Character.getByName('wolf')

		expect(bowser.length).to.be.equal(8)
		expect(wolf.length).to.be.equal(4)

		bowser.forEach(character => {
			expect(character).to.be.instanceof(Character)
		})
		wolf.forEach(character => {
			expect(character).to.be.instanceof(Character)
		})

		expect(bowser[0].getId()).to.be.equal(BOWSER_ID)
		expect(bowser[0].getVideoGameId()).to.be.equal(MELEE_ID)

		expect(wolf[0].getId()).to.be.equal(WOLF_ID)
		expect(wolf[0].getVideoGameId()).to.be.equal(PM_ID)

		return true
	})

	it('should get characters by their name and their game name', async function() {
		this.timeout(10000)

		const bowser: Character = await Character.getByNameAndGame('bowser', 'melee') as Character
		const wolf: Character = await Character.getByNameAndGame('wolf', 'pm') as Character

		expect(bowser).to.be.instanceof(Character)
		expect(wolf).to.be.instanceof(Character)

		expect(bowser.getId()).to.be.equal(BOWSER_ID)
		expect(bowser.getVideoGameId()).to.be.equal(MELEE_ID)

		expect(wolf.getId()).to.be.equal(WOLF_ID)
		expect(wolf.getVideoGameId()).to.be.equal(PM_ID)

		return true
	})

	it('should get characters by their name and their game id', async function() {
		this.timeout(10000)

		const bowser: Character = await Character.getByNameAndGameId('bowser', MELEE_ID) as Character
		const wolf: Character = await Character.getByNameAndGameId('wolf', PM_ID) as Character

		expect(bowser).to.be.instanceof(Character)
		expect(wolf).to.be.instanceof(Character)

		expect(bowser.getId()).to.be.equal(BOWSER_ID)
		expect(bowser.getVideoGameId()).to.be.equal(MELEE_ID)

		expect(wolf.getId()).to.be.equal(WOLF_ID)
		expect(wolf.getVideoGameId()).to.be.equal(PM_ID)

		return true
	})
})
