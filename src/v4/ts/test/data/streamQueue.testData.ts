import {IStreamQueue} from '../../lib/StreamQueue'
import {IStream} from '../../lib/Stream'
import {IGGSet} from '../../lib/GGSet'


export const stream1: IStream.StreamData = {
	"id": 10493,
	"eventId": null,
	"tournamentId": 6620,
	"streamName": "recursiongg",
	"numSetups": null,
	"streamSource": "TWITCH",
	"streamType": 1,
	"streamTypeId": null,
	"isOnline": true,
	"enabled": true,
	"followerCount": 9609,
	"removesTasks": true,
	"streamStatus": "Tipped Off 12 Top 8 ft M2K, Hax$, n0ne, Swedish, Cal, Colbol, Dizzkid, iBDW",
	"streamGame": "Super Smash Bros. Melee",
	"streamLogo": "https://static-cdn.jtvnw.net/jtv_user_pictures/recursiongg-profile_image-30c27f4bc6a59cc8-300x300.png"
}

export const sets1: IGGSet.SetData[] = [
	{
		"id": "11186473",
		"eventId": 23596,
		"phaseGroupId": 453051,
		"displayScore": null,
		"fullRoundText": "Grand Final Reset",
		"round": 3,
		"startedAt": null,
		"completedAt": null,
		"winnerId": null,
		"totalGames": 5,
		"state": 5,
		"slots": [
			{
				"id": "11186473-0",
				"entrant": null
			},
			{
				"id": "11186473-1",
				"entrant": null
			}
		]
	}
]

export const streamQueue1: IStreamQueue.StreamQueueData[] = [{
	stream: stream1,
	sets: sets1
}]


export const streamQueue2 = {

}

export const streamQueue3 = {

}

export const streamQueueData1: IStreamQueue.Data = {
	streamQueue: streamQueue1
}

export const streamQueueData2 = {
	streamQueue: streamQueue2
}

export const streamQueueData3 = {
	streamQueue: streamQueue3
}