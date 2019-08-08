import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
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

import {IStream} from '../lib/interfaces/IStream'

import Initializer from '../lib/util/Initializer'
import {Stream} from '../lib/models/Stream'
import * as testData from './data/stream.testData'

let stream1: IStream, stream2: IStream, stream3: IStream

const STREAM_ID_1 = 10493
const STREAM_ID_2 = 574
const STREAM_ID_3 = 40210

describe('smashgg Stream', function() {
	this.timeout(10000)
	
	before(async () => {
		await Initializer(process.env.API_TOKEN!)

		stream1 = await Stream.get(STREAM_ID_1)
		stream2 = await Stream.get(STREAM_ID_2)
		stream3 = await Stream.get(STREAM_ID_3)

		return true
	})

	// id
	it('should get the correct stream id 1', () => {
		expect(stream1.getId()).to.be.equal(testData.stream1.id)
	})
	it('should get the correct stream id 2', () => {
		expect(stream2.getId()).to.be.equal(testData.stream2.id)
	})
	it('should get the correct stream id 3', () => {
		expect(stream3.getId()).to.be.equal(testData.stream3.id)
	})

	// event id
	it('should get the correct stream event id 1', () => {
		expect(stream1.getEventId()).to.be.equal(testData.stream1.eventId)
	})
	it('should get the correct stream event id 2', () => {
		expect(stream2.getEventId()).to.be.equal(testData.stream2.eventId)
	})
	it('should get the correct stream event id 3', () => {
		expect(stream3.getEventId()).to.be.equal(testData.stream3.eventId)
	})

	// tournament id
	it('should get the correct stream tournament id 1', () => {
		expect(stream1.getTournamentId()).to.be.equal(testData.stream1.tournamentId)
	})
	it('should get the correct stream tournament id 2', () => {
		expect(stream2.getTournamentId()).to.be.equal(testData.stream2.tournamentId)
	})
	it('should get the correct stream tournament id 3', () => {
		expect(stream3.getTournamentId()).to.be.equal(testData.stream3.tournamentId)
	})

	// stream name
	it('should get the correct stream name id 1', () => {
		expect(stream1.getStreamName()).to.be.equal(testData.stream1.streamName)
	})
	it('should get the correct stream name id 2', () => {
		expect(stream2.getStreamName()).to.be.equal(testData.stream2.streamName)
	})
	it('should get the correct stream name id 3', () => {
		expect(stream3.getStreamName()).to.be.equal(testData.stream3.streamName)
	})

	// num setups
	it('should get the correct num setups id 1', () => {
		expect(stream1.getNumSetups()).to.be.equal(testData.stream1.numSetups)
	})
	it('should get the correct num setups id 2', () => {
		expect(stream2.getNumSetups()).to.be.equal(testData.stream2.numSetups)
	})
	it('should get the correct num setups id 3', () => {
		expect(stream3.getNumSetups()).to.be.equal(testData.stream3.numSetups)
	})

	// stream source
	it('should get the correct stream source id 1', () => {
		expect(stream1.getStreamSource()).to.be.equal(testData.stream1.streamSource)
	})
	it('should get the correct stream source id 2', () => {
		expect(stream2.getStreamSource()).to.be.equal(testData.stream2.streamSource)
	})
	it('should get the correct stream source id 3', () => {
		expect(stream3.getStreamSource()).to.be.equal(testData.stream3.streamSource)
	})

	// stream type
	it('should get the correct stream type id 1', () => {
		expect(stream1.getStreamType()).to.be.equal(testData.stream1.streamType)
	})
	it('should get the correct stream type id 2', () => {
		expect(stream2.getStreamType()).to.be.equal(testData.stream2.streamType)
	})
	it('should get the correct stream type id 3', () => {
		expect(stream3.getStreamType()).to.be.equal(testData.stream3.streamType)
	})

	// stream type id
	it('should get the correct stream type id id 1', () => {
		expect(stream1.getStreamTypeId()).to.be.equal(testData.stream1.streamTypeId)
	})
	it('should get the correct stream type id id 2', () => {
		expect(stream2.getStreamTypeId()).to.be.equal(testData.stream2.streamTypeId)
	})
	it('should get the correct stream type id id 3', () => {
		expect(stream3.getStreamTypeId()).to.be.equal(testData.stream3.streamTypeId)
	})

	// is online
	it('should get the correct stream is online status id 1', () => {
		expect(stream1.getIsOnline()).to.be.equal(testData.stream1.isOnline)
	})
	it('should get the correct stream is online status id 2', () => {
		expect(stream2.getIsOnline()).to.be.equal(testData.stream2.isOnline)
	})
	it('should get the correct stream is online status id 3', () => {
		expect(stream3.getIsOnline()).to.be.equal(testData.stream3.isOnline)
	})

	// enabled
	it('should get the correct stream enabled id 1', () => {
		expect(stream1.getEnabled()).to.be.equal(testData.stream1.enabled)
	})
	it('should get the correct stream enabled id 2', () => {
		expect(stream2.getEnabled()).to.be.equal(testData.stream2.enabled)
	})
	it('should get the correct stream enabled id 3', () => {
		expect(stream3.getEnabled()).to.be.equal(testData.stream3.enabled)
	})

	// follower count
	it('should get the correct stream follower count id 1', () => {
		expect(stream1.getFollowerCount()).to.be.equal(testData.stream1.followerCount)
	})
	it('should get the correct stream follower count id 2', () => {
		expect(stream2.getFollowerCount()).to.be.equal(testData.stream2.followerCount)
	})
	it('should get the correct stream follower count id 3', () => {
		expect(stream3.getFollowerCount()).to.be.equal(testData.stream3.followerCount)
	})

	// removesTasks
	it('should get the correct stream removes tasks id 1', () => {
		expect(stream1.getRemovesTasks()).to.be.equal(testData.stream1.removesTasks)
	})
	it('should get the correct stream removes tasks id 2', () => {
		expect(stream2.getRemovesTasks()).to.be.equal(testData.stream2.removesTasks)
	})
	it('should get the correct stream removes tasks id 3', () => {
		expect(stream3.getRemovesTasks()).to.be.equal(testData.stream3.removesTasks)
	})

	// stream status
	it('should get the correct stream status id 1', () => {
		expect(stream1.getStreamStatus()).to.be.equal(testData.stream1.streamStatus)
	})
	it('should get the correct stream status id 2', () => {
		expect(stream2.getStreamStatus()).to.be.equal(testData.stream2.streamStatus)
	})
	it('should get the correct stream status id 3', () => {
		expect(stream3.getStreamStatus()).to.be.equal(testData.stream3.streamStatus)
	})

	// stream game
	it('should get the correct stream game id 1', () => {
		expect(stream1.getStreamGame()).to.be.equal(testData.stream1.streamGame)
	})
	it('should get the correct stream game id 2', () => {
		expect(stream2.getStreamGame()).to.be.equal(testData.stream2.streamGame)
	})
	it('should get the correct stream game id 3', () => {
		expect(stream3.getStreamGame()).to.be.equal(testData.stream3.streamGame)
	})

	// stream logo
	it('should get the correct stream logo id 1', () => {
		expect(stream1.getStreamLogo()).to.be.equal(testData.stream1.streamLogo)
	})
	it('should get the correct stream logo id 2', () => {
		expect(stream2.getStreamLogo()).to.be.equal(testData.stream2.streamLogo)
	})
	it('should get the correct stream logo id 3', () => {
		expect(stream3.getStreamLogo()).to.be.equal(testData.stream3.streamLogo)
	})
})
