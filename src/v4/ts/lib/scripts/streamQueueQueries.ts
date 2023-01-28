import * as Schema from './schema'

export const streamQueue = `query StreamQueueQuery($tournamentId: ID!, $includePlayerStreams: Boolean){
	streamQueue(tournamentId:$tournamentId, includePlayerStreams:$includePlayerStreams){
		stream{
			${Schema.streams}
		}
		sets{
			${Schema.set}
		}
	}
}`
