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
import {Stream} from '../lib/Stream'
import * as testData from './data/stream.testData'

let stream1: Stream, stream2: Stream, stream3: Stream

const STREAM_ID_1 = 10493
const STREAM_ID_3 = 574
const STREAM_ID_2 = 40210

describe('smashgg Stream', function(){

	before(async function(){
		await Initializer(process.env.API_TOKEN!)

		stream1 = await Stream.get(STREAM_ID_1)
		stream2 = await Stream.get(STREAM_ID_2)
		stream3 = await Stream.get(STREAM_ID_3)

		return true
	})

	// id
	it('should get the correct stream id 1', function(){
		expect(stream1.getId()).to.be.equal(testData.stream1.id)
	})
	it('should get the correct stream id 2', function(){
		expect(stream2.getId()).to.be.equal(testData.stream2.id)
	})
	it('should get the correct stream id 3', function(){
		expect(stream3.getId()).to.be.equal(testData.stream3.id)
	})

	// event id
	


	/*
	id: number,
	eventId: number,
	tournamentId: number,
	streamName: string,
	numSetups: number | null,
	streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
	streamType: number | null,
	streamTypeId: number | null,
	isOnline: boolean,
	enabled: boolean,
	followerCount: number | null,
	removesTask: boolean,
	streamStatus: string | null,
	streamGame: string | null,
	streamLogo: string | null
	*/

})