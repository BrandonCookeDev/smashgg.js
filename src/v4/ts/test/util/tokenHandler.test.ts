import {expect, assert} from 'chai'
import TokenHandler from '../../lib/util/TokenHandler'

const BAD_TOKEN_1 = 'THISISAVERYBADTOKEN'
const BAD_TOKEN_2 = '68x91e2848052ed278a3d88656f66ff6'
const BAD_TOKEN_3 = '68x91e2848052ed278a3d88656f66ff6THISTOKENISTOOLONG'
const GOOD_TOKEN = '52292a2848052df2834aad11156f66ee6'

describe('startgg Token Handler', () => {

	it('should deny a key shorter than 32 characters', () => {
		assert.throws(() => TokenHandler.setToken(BAD_TOKEN_1))
	})

	it('should deny a key that\'s too long', () => {
		assert.throws(() => TokenHandler.setToken(BAD_TOKEN_2))
	})

	it('should deny a key that is not hexidecimal', () => {
		assert.throws(() => TokenHandler.setToken(BAD_TOKEN_3))
	})

	it('should accept a legitimate 32 character hexidecimal token', () => {
		TokenHandler.setToken(GOOD_TOKEN)
		expect(TokenHandler.getToken()).to.equal(GOOD_TOKEN)
	})
})
