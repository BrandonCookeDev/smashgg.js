
export interface IStream{
	/*
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
	*/

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

export interface IStreamDataFull{
	stream: IStreamData
}

export interface IStreamData{
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
