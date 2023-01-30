import {IGGSet, IGGSetData} from './IGGSet'
import {IStreams, IStreamsData} from './IStreams'

export interface IStreamQueue{
	/*
	stream: IStream,
	sets: IGGSet[]
	*/
	
	getStream(): IStreams,
	getSets(): IGGSet[]
}

export interface IStreamQueueDataFull{
	streamQueue: IStreamQueueData[]
}

export interface IStreamQueueData{
	stream: IStreamsData,
	sets: IGGSetData[]
}
