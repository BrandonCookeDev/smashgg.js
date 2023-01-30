import {IStreamsData, IStreamsDataFull} from '../../lib/interfaces/IStreams'

export const stream1: IStreamsData = {
	id: 10493,
	enabled: true,
	followerCount: 9609,
	isOnline: true,
	numSetups: null,
	parentStreamId: null,
	streamGame: 'Super Smash Bros. Melee',
	streamId: '123425775',
	streamLogo:
		'https://static-cdn.jtvnw.net/jtv_user_pictures/recursiongg-profile_image-30c27f4bc6a59cc8-300x300.png',
	streamName: 'recursiongg',
	streamSource: 'TWITCH',
	streamStatus: 'Tipped Off 12 Top 8 ft M2K, Hax$, n0ne, Swedish, Cal, Colbol, Dizzkid, iBDW',
	streamType: 1,
	streamTypeId: null
}

export const stream2: IStreamsData = {
	id: 574,
	enabled: true,
	followerCount: null,
	isOnline: null,
	numSetups: null,
	parentStreamId: null,
	streamGame: null,
	streamId: '9846758',
	streamLogo: null,
	streamName: 'vgbootcamp',
	streamSource: 'TWITCH',
	streamStatus: null,
	streamType: 1,
	streamTypeId: null
}

export const stream3: IStreamsData = {
	id: 40210,
	enabled: true,
	followerCount: 294404,
	isOnline: false,
	numSetups: null,
	parentStreamId: null,
	streamGame: 'Street Fighter V',
	streamId: '36616300',
	streamLogo:
		'https://static-cdn.jtvnw.net/jtv_user_pictures/daebf3b9-203e-4c1c-9ac5-0e8bf445be86-profile_image-300x300.png',
	streamName: 'capcomfighters',
	streamSource: 'TWITCH',
	streamStatus: 'EVO 2018 - Day 2',
	streamType: 1,
	streamTypeId: null
}

export const streamData1: IStreamsDataFull = {
	stream: stream1
}

export const streamData2: IStreamsDataFull = {
	stream: stream2
}

export const streamData3: IStreamsDataFull = {
	stream: stream3
}
