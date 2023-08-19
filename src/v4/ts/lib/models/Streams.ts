
import log from '../util/Logger'
import NI from '../util/NetworkInterface'
import * as queries from '../scripts/streamQueries'

import {
	IStreams,
	IStreamsData,
	IStreamsDataFull
} from '../interfaces/IStreams'

type StreamSource = 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null

export class Streams implements IStreams{

	public static parseFull(data: IStreamsDataFull): Streams {
		return Streams.parse(data.stream)
	}

	public static async get(theId: number): Promise<IStreams> {
		log.info('Getting streams with Id %s', theId)
		const data: IStreamsDataFull = await NI.query(queries.stream, {id: theId})
		return Streams.parseFull(data)
	}

	public static parse(data: IStreamsData): Streams {
		return new Streams(
			data.id,
            data.enabled,
            data.followerCount,
            data.isOnline,
            data.numSetups,
            data.parentStreamId,
            data.streamGame,
            data.streamId,
            data.streamLogo,
            data.streamName,
            data.streamSource,
            data.streamStatus,
            data.streamType,
            data.streamTypeId
		)
	}

	private id: number
    private enabled: boolean | null
    private followerCount: number | null
    private isOnline: boolean | null
    private numSetups: number | null
    private parentStreamId: number | null
    private streamGame: string | null
    private streamId: string | null
    private streamLogo: string | null
    private streamName: string
    private streamSource: StreamSource
    private streamStatus: string | null
    private streamType: number | null
    private streamTypeId: number | null

	// TODO: Need restructuring so we dont have as many parameters
	constructor(
		id: number,
        enabled: boolean | null,
        followerCount: number | null,
        isOnline: boolean | null,
        numSetups: number | null,
        parentStreamId: number | null,
        streamGame: string | null,
        streamId: string | null,
        streamLogo: string | null,
        streamName: string,
        streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
        streamStatus: string | null,
        streamType: number | null,
        streamTypeId: number | null,
	){
		this.id = id
		this.enabled = enabled
		this.followerCount = followerCount
		this.isOnline = isOnline
		this.numSetups = numSetups
		this.parentStreamId = parentStreamId
		this.streamGame = streamGame
		this.streamId = streamId
		this.streamLogo = streamLogo
		this.streamName = streamName
		this.streamSource = streamSource
		this.streamStatus = streamStatus
		this.streamType = streamType
		this.streamTypeId = streamTypeId
	}

	public getId(): number {
		return this.id
	}

	public getEnabled(): boolean | null{
		return this.enabled
	}

	public getFollowerCount(): number | null{
		return this.followerCount
	}

	public getIsOnline(): boolean | null{
		return this.isOnline
	}

	public getNumSetups(): number | null{
		return this.numSetups
	}

    public getParentStreamId(): number | null{
    	return this.parentStreamId
    }

	public getStreamGame(): string | null{
		return this.streamGame
	}

	public getStreamId(): string | null{
        return this.streamId
    }

	public getStreamLogo(): string | null {
		return this.streamLogo
	}

	public getStreamName(): string{
    	return this.streamName
    }

	public getStreamSource(): 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null{
		return this.streamSource
	}

	public getStreamStatus(): string | null{
		return this.streamStatus
	}

	public getStreamType(): number | null{
		return this.streamType
	}

	public getStreamTypeId(): number | null{
		return this.streamTypeId
	}
}
