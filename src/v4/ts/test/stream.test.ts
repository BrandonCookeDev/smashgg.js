import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env')
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'
//import * as log from '../lib/util/Logger'

import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {IStreams} from '../lib/interfaces/IStreams'

import Initializer from '../lib/util/Initializer'
import {Streams} from '../lib/models/Streams'
import * as testData from './data/stream.testData'

let stream1: IStreams, stream2: IStreams, stream3: IStreams

const STREAM_ID_1 = 10493
const STREAM_ID_2 = 574
const STREAM_ID_3 = 40210

describe('startgg Stream', function() {
	this.timeout(10000)
	
	before(async () => {
		Initializer(process.env.API_TOKEN!)

		stream1 = await Streams.get(STREAM_ID_1)
		stream2 = await Streams.get(STREAM_ID_2)
		stream3 = await Streams.get(STREAM_ID_3)

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

	// parent stream id
	it('should get the correct parent stream id 1', () => {
		expect(stream1.getParentStreamId()).to.be.equal(testData.stream1.parentStreamId)
	})
	it('should get the correct parent stream id 2', () => {
		expect(stream2.getParentStreamId()).to.be.equal(testData.stream2.parentStreamId)
	})
	it('should get the correct parent stream id 3', () => {
		expect(stream3.getParentStreamId()).to.be.equal(testData.stream3.parentStreamId)
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

	// stream id
	it('should get the correct stream id 1', () => {
		expect(stream1.getStreamId()).to.be.equal(testData.stream1.streamId)
	})
	it('should get the correct stream id 2', () => {
		expect(stream2.getStreamId()).to.be.equal(testData.stream2.streamId)
	})
	it('should get the correct stream id 3', () => {
		expect(stream3.getStreamId()).to.be.equal(testData.stream3.streamId)
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
})
