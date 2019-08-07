
import log from './util/Logger'
import NI from './util/NetworkInterface'
import * as queries from './scripts/streamQueries'

import {
	IStream,
	IStreamData,
	IStreamDataFull
} from './interfaces/IStream'

export class Stream implements IStream{

	public static parseFull(data: IStreamDataFull): IStream {
		return Stream.parse(data.stream)
	}

	public static async get(theId: number): Promise<IStream> {
		log.info('Getting Stream with Id %s', theId)
		const data: IStreamDataFull = await NI.query(queries.stream, {id: theId})
		return Stream.parseFull(data)
	}

	public static parse(data: IStreamData): IStream {
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

	private id: number
	private eventId: number | null
	private tournamentId: number | null
	private streamName: string
	private numSetups: number | null
	private streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null
	private streamType: number | null
	private streamTypeId: number | null
	private isOnline: boolean | null
	private enabled: boolean | null
	private followerCount: number | null
	private removesTasks: boolean | null
	private streamStatus: string | null
	private streamGame: string | null
	private streamLogo: string | null

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

	public getId(): number {
		return this.id
	}
	
	public getEventId(): number | null{
		return this.eventId
	}

	public getTournamentId(): number | null{
		return this.tournamentId
	}

	public getStreamName(): string{
		return this.streamName
	}

	public getNumSetups(): number | null{
		return this.numSetups
	}

	public getStreamSource(): 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null{
		return this.streamSource
	}

	public getStreamType(): number | null{
		return this.streamType
	}

	public getStreamTypeId(): number | null{
		return this.streamTypeId
	}

	public getIsOnline(): boolean | null{
		return this.isOnline
	}

	public getEnabled(): boolean | null{
		return this.enabled
	}

	public getFollowerCount(): number | null{
		return this.followerCount
	}

	public getRemovesTasks(): boolean | null{
		return this.removesTasks
	}

	public getStreamStatus(): string | null{
		return this.streamStatus
	}

	public getStreamGame(): string | null{
		return this.streamGame
	}

	public getStreamLogo(): string | null {
		return this.streamLogo
	}
}
