import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
import * as log from '../lib/util/Logger'

import _ from 'lodash'
import moment from 'moment'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import Initializer from '../lib/util/Initializer'
import {StreamQueue} from '../lib/StreamQueue'
import {Stream} from '../lib/Stream'
import {GGSet} from '../lib/GGSet'
import * as testData from './data/streamQueue.testData'

let streamQueue1: StreamQueue[];

const STREAM_QUEUE_TOURNAMENT_ID_1 = 6620

describe('smashgg Stream Queue', function(){

	before(async function(){
		await Initializer(process.env.API_TOKEN!);
		streamQueue1 = await StreamQueue.get(STREAM_QUEUE_TOURNAMENT_ID_1);
		return true;
	})
	
	it('should get the correct Stream 1', function(){
		expect(streamQueue1[0].getStream()).to.deep.equal(Stream.parse(testData.streamQueue1[0].stream));
	})

	it('should get the correct Sets 1', function(){
		expect(streamQueue1[0].getSets()).to.have.deep.members(testData.streamQueue1[0].sets.map(set => GGSet.parse(set)));
	})
})