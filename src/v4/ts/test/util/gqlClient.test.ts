'use strict'

import {expect, assert} from 'chai'
import GQLClient from '../../lib/util/GQLClient'
import TokenHandler from '../../lib/util/TokenHandler'
 
const API_URL = 'https://api.smash.gg/gql/alpha'
const API_TOKEN = '52292a2848052df2834aad11156f66ee6'

const HEADERS = {
	headers: {
		'X-Source': 'smashgg.js',
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${API_TOKEN}`
	}
}

describe('smashgg GQL Client', function(){

	before(() => {
		TokenHandler.setToken(API_TOKEN);
	})

	it('should return the correct API url', function(){
		expect(GQLClient.getApiUrl()).to.be.equal(API_URL)
	})

	it('should generate the correct headers w/ API Token', function(){
		expect(GQLClient.getHeaders()).to.deep.equal(HEADERS)
	})


})