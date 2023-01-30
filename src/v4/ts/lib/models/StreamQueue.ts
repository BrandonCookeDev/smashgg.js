
import log from '../util/Logger'
import NI from '../util/NetworkInterface'
import * as queries from '../scripts/streamQueueQueries'

import {
	IStreamQueue, 
	IStreamQueueData,
	IStreamQueueDataFull
} from '../interfaces/IStreamQueue'
import {IGGSet} from '../interfaces/IGGSet'
import {IStreams} from '../interfaces/IStreams'

import {Streams} from './Streams'
import {GGSet} from './GGSet'

export class StreamQueue implements IStreamQueue{

	public static parse(data: IStreamQueueData): IStreamQueue{
		const stream: IStreams = Streams.parse(data.stream)
		const sets: IGGSet[] = data.sets.map(set => GGSet.parse(set))
		return new StreamQueue(stream, sets)
	}

	public static parseFull(data: IStreamQueueDataFull): IStreamQueue[]{
		return data.streamQueue.map(sq => StreamQueue.parse(sq))
	}

	public static async get(theTournamentId: number): Promise<IStreamQueue[] | null> {
		log.info('Getting Stream Queues for Tournament with Id %s', theTournamentId)
		const data: IStreamQueueDataFull = await NI.query(queries.streamQueue, {tournamentId: theTournamentId})

		if(data.streamQueue)
			return StreamQueue.parseFull(data)
		else{
			log.warn('Stream Queue for tournament %s is null', theTournamentId)
			return null
		}
	}

	private stream: IStreams
	private sets: IGGSet[]

	constructor(
		stream: IStreams,
		sets: IGGSet[]
	){
		this.stream = stream
		this.sets = sets
	}

	public getStream(): IStreams{
		return this.stream
	}

	public getSets(): IGGSet[]{
		return this.sets
	}
}
