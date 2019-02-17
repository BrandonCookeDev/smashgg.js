import {EventEmitter} from 'events'
import log from './Logger'
import GQLClient from './GQLClient'
import { clear } from 'winston';

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
	static executionSemaphore: any
	static queuingSemaphore: any

	constructor(count: number, delinquencyQueue: any[]){
		super()
		this.count = count
		this.delinquencyQueue = delinquencyQueue
	}

	static getInstance(){
		if(!DelinquencyQueue.instance){
			DelinquencyQueue.instance = new DelinquencyQueue(0, [])
			DelinquencyQueue.queuingSemaphore = null
			DelinquencyQueue.executionSemaphore = null
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

	// semaphore management
	static getExecutionSemaphore(){
		return new Promise(function(resolve, reject){
			if(!DelinquencyQueue.executionSemaphore){
				DelinquencyQueue.executionSemaphore = {}
				log.verbose('obtaining execution semaphore')
				return resolve(DelinquencyQueue.executionSemaphore)
			}
			else return null;	
		})
	}

	static releaseExecutionSemaphore(){
		log.verbose('releasing execution semaphore')
		if(DelinquencyQueue.executionSemaphore)
			DelinquencyQueue.executionSemaphore = null
	}

	static getQueuingSemaphore(){
		return new Promise(function(resolve, reject){
			if(!DelinquencyQueue.queuingSemaphore){
				DelinquencyQueue.queuingSemaphore = {}
				log.verbose('obtaining queuing semaphore')
				return resolve(DelinquencyQueue.queuingSemaphore)
			}
			else return null;	
		})
	}

	static releaseQueuingSemaphore(){
		log.verbose('releasing queuing semaphore')
		if(DelinquencyQueue.queuingSemaphore)
			DelinquencyQueue.queuingSemaphore = null
	}

	// instance
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
				DelinquencyQueue.getExecutionSemaphore()
					.then(semaphore => {
						// if the semaphore was obtained, 
						// let the execution proceed!
						if(semaphore){
							// execute and return the query results
							GQLClient.getInstance().request(query, variables)
								.then(data => {
									clearInterval(semaphoreInterval)
									DelinquencyQueue.releaseExecutionSemaphore()
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
				let queuingInterval = setInterval(() => {
					DelinquencyQueue.getQueuingSemaphore()
						.then(semaphore => {
							if(semaphore){
								// release interval to alleviate the event loop 
								DelinquencyQueue.releaseQueuingSemaphore()

								// add the query into the main queue
								_this.executeQuery(query, variables)
									.then(data => {
										clearInterval(queuingInterval)
										return data
									})
									.then(resolve)
									.catch(reject)
							}
						})
				}, SEMAPHORE_TIMER)

					
			}
			else {
				log.warn('Query waiting on delinquency queue to free up')
				
				// when element from main queue is removed, execute delinquent query
				_this.on('remove', () => {
					let queuingInterval = setInterval(() => {
						DelinquencyQueue.getQueuingSemaphore()
							.then(semaphore => {
								if(semaphore){
									// release interval to alleviate the event loop 
									DelinquencyQueue.releaseQueuingSemaphore()

									// add the query into the main queue
									_this.executeQuery(query, variables)
										.then(data => {
											clearInterval(queuingInterval)
											return data
										})
										.then(resolve)
										.catch(reject)
								}
							})
					}, SEMAPHORE_TIMER)
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
		if(this.count <= DELINQUENCY_RATE){
			this.emit('remove')
			DelinquencyQueue.isFull = false;
			log.verbose('element removed from queue. Count: %s', this.count)
		}
		else throw new Error('Queue is above rate limit of ' + DELINQUENCY_RATE)
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