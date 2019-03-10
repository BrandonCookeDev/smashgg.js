import * as Schema from './schema'

export const streamQueue = `query StreamQueueQuery($tournamentId: Int!, $includePlayerStreams: Boolean){
	stream{
		${Schema.stream}
	}
	sets{
		${Schema.set}
	}
}`