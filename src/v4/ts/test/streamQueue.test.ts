import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
import * as log from '../lib/util/Logger'

import _ from 'lodash'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {IStreamQueue} from '../lib/interfaces/IStreamQueue'

import Initializer from '../lib/util/Initializer'
import {StreamQueue} from '../lib/models/StreamQueue'
import {Streams} from '../lib/models/Streams'
import {GGSet} from '../lib/models/GGSet'
import * as testData from './data/streamQueue.testData'

let streamQueue1: IStreamQueue[] | null

const STREAM_QUEUE_TOURNAMENT_ID_1 = 6620

describe('startgg StreamQueue', () => {

	before(async () => {
		await Initializer(process.env.API_TOKEN!)
		streamQueue1 = await StreamQueue.get(STREAM_QUEUE_TOURNAMENT_ID_1)
		expect(streamQueue1).to.not.be.null
		return true
	})
	
	it('should get the correct Stream 1', () => {
		expect(streamQueue1![0].getStream()).to.deep.equal(Streams.parse(testData.streamQueue1[0].stream))
	})

	it('should get the correct Sets 1', () => {
		expect(streamQueue1![0].getSets()).to.have.deep.members(testData.streamQueue1[0].sets.map(set => GGSet.parse(set)))
	})
})
