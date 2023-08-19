import {IStreamQueueData, IStreamQueueDataFull} from '../../lib/interfaces/IStreamQueue'
import {IStreamsData} from '../../lib/interfaces/IStreams'
import {IGGSetData} from '../../lib/interfaces/IGGSet'

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

export const sets1: IGGSetData[] = [
	{
		id: 11186473,
		completedAt: null,
		displayScore: null,
		event: {
		    id: 23596,
		},
		fullRoundText: 'Grand Final Reset',
		identifier: "E",
		phaseGroup: {
		    id: 453051,
		},
		round: 3,
		startedAt: null,
		state: 5,
		totalGames: 5,
		slots: [
			{
				id: '11186473-0',
				entrant: null
			},
			{
				id: '11186473-1',
				entrant: null
			}
		],
		winnerId: null
	}
]

export const streamQueue1: IStreamQueueData[] = [{
    id: "6620",
	stream: stream1,
	sets: sets1
}]

export const streamQueueData1: IStreamQueueDataFull = {
	streamQueue: streamQueue1
}
