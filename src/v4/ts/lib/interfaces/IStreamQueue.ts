import {IGGSet, IGGSetData} from './IGGSet'
import {IStream, IStreamData} from './IStream'

export interface IStreamQueue{
	/*
	stream: IStream,
	sets: IGGSet[]
	*/
	
	getStream(): IStream,
	getSets(): IGGSet[]
}

export interface IStreamQueueDataFull{
	streamQueue: IStreamQueueData[]
}

export interface IStreamQueueData{
	stream: IStreamData,
	sets: IGGSetData[]
}
