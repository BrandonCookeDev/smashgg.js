
import log from './util/Logger'
import NI from './util/NetworkInterface'
import * as queries from './scripts/streamQueries'

export class Stream implements IStream.Stream{

	id: number
	eventId: number | null
	tournamentId: number | null
	streamName: string
	numSetups: number | null
	streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null
	streamType: number | null
	streamTypeId: number | null
	isOnline: boolean | null
	enabled: boolean | null
	followerCount: number | null
	removesTasks: boolean | null
	streamStatus: string | null
	streamGame: string | null
	streamLogo: string | null

	constructor(
		id: number,
		eventId: number | null,
		tournamentId: number | null,
		streamName: string,
		numSetups: number | null,
		streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
		streamType: number | null,
		streamTypeId: number | null,
		isOnline: boolean | null,
		enabled: boolean | null,
		followerCount: number | null,
		removesTasks: boolean | null,
		streamStatus: string | null,
		streamGame: string | null,
		streamLogo: string | null
	){
		this.id = id
		this.eventId = eventId
		this.tournamentId = tournamentId
		this.streamName = streamName
		this.numSetups = numSetups
		this.streamSource = streamSource
		this.streamType = streamType
		this.streamTypeId = streamTypeId
		this.isOnline = isOnline
		this.enabled = enabled
		this.followerCount = followerCount
		this.removesTasks = removesTasks
		this.streamStatus = streamStatus
		this.streamGame = streamGame
		this.streamLogo = streamLogo
	}

	static parse(data: IStream.StreamData) : Stream {
		return new Stream(
			data.id,
			data.eventId,
			data.tournamentId,
			data.streamName,
			data.numSetups,
			data.streamSource,
			data.streamType,
			data.streamTypeId,
			data.isOnline,
			data.enabled,
			data.followerCount,
			data.removesTasks,
			data.streamStatus,
			data.streamGame,
			data.streamLogo
		)
	}

	static parseFull(data: IStream.Data) : Stream {
		return Stream.parse(data.stream)
	}

	static async get(id: number) : Promise<Stream> {
		log.info('Getting Stream with Id %s', id);
		let data: IStream.Data = await NI.query(queries.stream, {id: id})
		return Stream.parseFull(data)
	}
	
	getId() : number {
		return this.id
	}
	
	getEventId(): number | null{
		return this.eventId
	}

	getTournamentId(): number | null{
		return this.tournamentId
	}

	getStreamName(): string{
		return this.streamName
	}

	getNumSetups(): number | null{
		return this.numSetups
	}

	getStreamSource(): 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null{
		return this.streamSource
	}

	getStreamType(): number | null{
		return this.streamType
	}

	getStreamTypeId(): number | null{
		return this.streamTypeId
	}

	getIsOnline(): boolean | null{
		return this.isOnline
	}

	getEnabled(): boolean | null{
		return this.enabled
	}

	getFollowerCount(): number | null{
		return this.followerCount
	}

	getRemovesTasks(): boolean | null{
		return this.removesTasks
	}

	getStreamStatus(): string | null{
		return this.streamStatus
	}

	getStreamGame(): string | null{
		return this.streamGame
	}

	getStreamLogo(): string | null {
		return this.streamLogo
	}
}

export namespace IStream{

	export interface Stream{
		id: number,
		eventId: number | null,
		tournamentId: number | null,
		streamName: string,
		numSetups: number | null,
		streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
		streamType: number | null,
		streamTypeId: number | null,
		isOnline: boolean | null,
		enabled: boolean | null,
		followerCount: number | null,
		removesTasks: boolean | null,
		streamStatus: string | null,
		streamGame: string | null,
		streamLogo: string | null

		getId(): number,
		getEventId(): number | null,
		getTournamentId(): number | null,
		getStreamName(): string,
		getNumSetups(): number | null,
		getStreamSource(): 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
		getStreamType(): number | null,
		getStreamTypeId(): number | null,
		getIsOnline(): boolean | null,
		getEnabled(): boolean | null,
		getFollowerCount(): number | null,
		getRemovesTasks(): boolean | null,
		getStreamStatus(): string | null,
		getStreamGame(): string | null,
		getStreamLogo(): string | null
	}

	export interface Data{
		stream: StreamData
	}

	export interface StreamData{
		id: number,
		eventId: number | null,
		tournamentId: number | null,
		streamName: string,
		numSetups: number | null,
		streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
		streamType: number | null,
		streamTypeId: number | null,
		isOnline: boolean | null,
		enabled: boolean | null,
		followerCount: number | null,
		removesTasks: boolean | null,
		streamStatus: string | null,
		streamGame: string | null,
		streamLogo: string | null
	}

}