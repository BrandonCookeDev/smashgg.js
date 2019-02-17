import {EventEmitter} from 'events'
import log from './Logger'
import GQLClient from './GQLClient'

const DELINQUENCY_TIMER = 60000
const DELINQUENCY_RATE = 60
const SEMAPHORE_TIMER = 500

export default class DelinquencyQueue extends EventEmitter{

	count: number = 0
	delinquencyQueue: any[] = []

	static instance: DelinquencyQueue
	static isFull: boolean = false;
	static inspector: any
	static groomRate: number = 1000
	static semaphore: any

	constructor(count: number, delinquencyQueue: any[]){
		super()
		this.count = count
		this.delinquencyQueue = delinquencyQueue
	}

	static getInstance(){
		if(!DelinquencyQueue.instance){
			DelinquencyQueue.instance = new DelinquencyQueue(0, [])
			DelinquencyQueue.semaphore = null
			DelinquencyQueue.inspector = null

			// listen and fire if an addition puts the queue at capacity
			DelinquencyQueue.instance.on('add', function(){
				if(DelinquencyQueue.instance.count >= DELINQUENCY_RATE){
					DelinquencyQueue.instance.queueIsFull()
				}

				DelinquencyQueue.instance.startInspector()
			})

			DelinquencyQueue.instance.startLogTimer() //debug
		}
		return DelinquencyQueue.instance
	}

	static getSemaphore(){
		return new Promise(function(resolve, reject){
			if(!DelinquencyQueue.semaphore){
				DelinquencyQueue.semaphore = {}
				log.verbose('obtaining semaphore')
				return resolve(DelinquencyQueue.semaphore)
			}
			else return null;	
		})
	}

	static releaseSemaphore(){
		log.verbose('releasing semaphore')
		if(DelinquencyQueue.semaphore)
			DelinquencyQueue.semaphore = null
	}

	executeQuery(query: string, variables: any){
		let _this = this
		return new Promise(function(resolve, reject){
			// fire event and increment counter
			_this.addedToQueue()

			// set a timer to remove count after delinquency timer
			setTimeout(() => {
				_this.removedFromQueue()
			}, DELINQUENCY_TIMER)

			// obtain the global semaphore
			let semaphoreInterval = setInterval(() => {
				DelinquencyQueue.getSemaphore()
					.then(semaphore => {
						// if the semaphore was obtained, 
						// let the execution proceed!
						if(semaphore){
							// execute and return the query results
							GQLClient.getInstance().request(query, variables)
								.then(data => {
									clearInterval(semaphoreInterval)
									DelinquencyQueue.releaseSemaphore()
									return data
								})
								.then(resolve)
								.catch(reject)
						}
					})
			}, SEMAPHORE_TIMER)
		})
	}
 
	startLogTimer(){
		let logTimeInterval : any;
		let time = 0;
		logTimeInterval = setInterval(() => {
			setTimeout(() => log.verbose('Time: %s seconds', time++), 1000);
		}, 1000);
	}

	isEmpty(){
		return this.count === 0
	}

	startInspector(){
		if(!DelinquencyQueue.inspector){
			log.verbose('Beginning Query Queue Inspector')
			DelinquencyQueue.inspector = setInterval(() => {
				if(this.count == 0){
					this.stopInspector()
					this.queueIsEmpty()
				}
			}, DelinquencyQueue.groomRate)
		}
	}

	stopInspector(){
		if(DelinquencyQueue.inspector)
			clearInterval(DelinquencyQueue.inspector)
	}

	add(query: any, variables: any){
		let _this = this
		return new Promise(function(resolve, reject){
			if(!DelinquencyQueue.isFull){
				_this.executeQuery(query, variables)
					.then(resolve)
					.catch(reject)
			}
			else {
				log.warn('Query waiting on delinquency queue to free up')
				
				// when element from main queue is removed, execute delinquent query
				_this.on('remove', () => {
					_this.executeQuery(query, variables)
						.then(resolve)
						.catch(reject)
				})
			}

		})
	}


	addedToQueue(){
		this.count++
		this.emit('add')
		log.verbose('Adding query to queue. Count: %s', this.count)
	}

	removedFromQueue(){
		this.count--
		this.emit('remove')
		DelinquencyQueue.isFull = false;
		log.verbose('element removed from queue. Count: %s', this.count)
	}

	queueIsEmpty(){
		this.emit('empty')
		log.verbose('query queue is now empty')
	}

	queueIsFull(){
		this.emit('full')
		DelinquencyQueue.isFull = true
		log.warn('Query Queue capacity of %s hit. Further queries are being queued for execution', DELINQUENCY_RATE)
	}
}