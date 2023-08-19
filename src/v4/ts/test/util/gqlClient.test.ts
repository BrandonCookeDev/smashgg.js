'use strict'

import {expect} from 'chai'
import GQLClient from '../../lib/util/GQLClient'
import TokenHandler from '../../lib/util/TokenHandler'

const API_URL = 'https://api.smash.gg/gql/alpha'
const API_TOKEN = '52292a2848052df2834aad11156f66ee6'

const HEADERS = {
	headers: {
		'X-Source': 'startgg.js',
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${API_TOKEN}`
	}
}

describe('startgg GQL Client', () => {

	before(() => {
		TokenHandler.setToken(API_TOKEN)
	})

	it('should return the correct API url', () => {
		expect(GQLClient.getApiUrl()).to.be.equal(API_URL)
	})

	it('should generate the correct headers w/ API Token', () => {
		expect(GQLClient.getHeaders()).to.deep.equal(HEADERS)
	})

})
