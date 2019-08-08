
export default class QueueItem{

	public item: () => any
	public timestamp: Date | null
	public isExecuted: boolean

	constructor(item: () => any, timestamp: Date | null){
		this.item = item
		this.timestamp = timestamp
		this.isExecuted = false
	}

	public execute(){
		this.item()
		this.isExecuted = true
	}

}
