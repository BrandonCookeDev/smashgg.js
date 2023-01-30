
export interface IStreams{
	/*
	id: number,
    enabled: boolean | null,
    followerCount: number | null,
    isOnline: boolean | null,
    numSetups: number | null,
    parentStreamId: number | null,
    streamGame: string | null,
    streamId: string | null,
    streamLogo: string | null
    streamName: string,
    streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
    streamStatus: string | null,
    streamType: number | null,
    streamTypeId: number | null,
	*/

	getId(): number,
	getEnabled(): boolean | null,
	getFollowerCount(): number | null,
	getIsOnline(): boolean | null,
	getNumSetups(): number | null,
	getParentStreamId(): number | null,
	getStreamGame(): string | null,
	getStreamId(): string | null,
	getStreamLogo(): string | null
	getStreamName(): string,
	getStreamSource(): 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
	getStreamStatus(): string | null,
	getStreamType(): number | null,
	getStreamTypeId(): number | null
}

export interface IStreamsDataFull{
	stream: IStreamsData
}

export interface IStreamsData{
	id: number,
    enabled: boolean | null,
    followerCount: number | null,
    isOnline: boolean | null,
    numSetups: number | null,
    parentStreamId: number | null,
    streamGame: string | null,
    streamId: string | null,
    streamLogo: string | null
    streamName: string,
    streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
    streamStatus: string | null,
    streamType: number | null,
    streamTypeId: number | null
}
