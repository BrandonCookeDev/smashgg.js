
import log from './util/Logger'
import NI from './util/NetworkInterface'
import * as queries from './scripts/streamQueueQueries'

import {Stream, IStream} from './Stream'
import {GGSet, IGGSet} from './GGSet'

export class StreamQueue implements IStreamQueue.StreamQueue{

	stream: Stream
	sets: GGSet[]

	constructor(
		stream: Stream,
		sets: GGSet[]
	){
		this.stream = stream
		this.sets = sets
	}

	static parse(data: IStreamQueue.StreamQueueData){
		let stream = Stream.parse(data.stream)
		let sets = data.sets.map(set => GGSet.parse(set))
		return new StreamQueue(stream, sets);
	}

	static parseFull(data: IStreamQueue.Data) : StreamQueue[]{
		return data.tournament.streamQueue.map(sq => StreamQueue.parse(sq))
	}

	static async get(tournamentId: number) : Promise<StreamQueue[]> {
		log.info('Getting Stream Queues for Tournament with Id %s', tournamentId)
		let data: IStreamQueue.Data = await NI.query(queries.streamQueue, {tournamentId: tournamentId})
		return StreamQueue.parseFull(data)
	}

	getStream() : Stream{
		return this.stream
	}

	getSets() : GGSet[]{
		return this.sets
	}
}

export namespace IStreamQueue{

	export interface StreamQueue{
		stream: Stream,
		sets: GGSet[]

		getStream(): Stream,
		getSets(): GGSet[]
	}

	export interface Data{
		tournament:{
			streamQueue: StreamQueueData[]
		}
	}

	export interface StreamQueueData{
		stream: IStream.StreamData,
		sets: IGGSet.SetData[]
	}

}