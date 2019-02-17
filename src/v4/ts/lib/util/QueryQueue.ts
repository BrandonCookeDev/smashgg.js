'use strict'

import 'colors'
import * as Common from './Common'
import log from './Logger'
import {EventEmitter} from 'events'

const RETRY_RATE = 3
const DELINQUENCY_RATE = 80
const DELINQUENCY_TIMER = 60000 // 1 min

export default class QueryQueue extends EventEmitter{

	queue: Array<Function> = []
	availableSlots: number = DELINQUENCY_RATE
	delinquencyQueue: Array<Function> = []

	static initialized: boolean = false
	static processing: boolean = false
	static instance: QueryQueue

	constructor(){
		super()
		this.queue = []
		this.availableSlots = DELINQUENCY_RATE
		this.delinquencyQueue = []
	}

	static init(){
		if(!QueryQueue.initialized){
			QueryQueue.instance = new QueryQueue()
			QueryQueue.processing = false

			QueryQueue.instance.on('add', async function(){
				if(!QueryQueue.processing)
					QueryQueue.instance.processQueue()
				return true
			})

			QueryQueue.instance.processDelinquencyQueueElements()
			QueryQueue.initialized = true
		}
	}

	/**
	 * getInstance
	 * 
	 * returns the singleton instance of StaggeredRequestQueue
	 */
	static getInstance(){
		if(!QueryQueue.initialized)
			throw new Error('StaggeredRequestQueue not initialized!')

		return QueryQueue.instance
	}

	/**
	 * processQueue
	 * 
	 * kicks off a while loop that executes until the queue is empty.
	 * continuously runs function elements staggered by a standard milisecond
	 * rate limit set by smashgg.
	 */
	async processQueue(){
		if(!QueryQueue.processing){
			QueryQueue.processing = true

			log.debug('loop begun'.green)
			log.debug('Queue Size: %s', String(this.queue.length).green)
			log.debug('Available Slots: %s', String(this.availableSlots).magenta)
			log.debug('Delinquency Length: %s', String(this.delinquencyQueue.length).red)

			while(this.queue.length > 0 || this.delinquencyQueue.length > 0){
				let retryCount = 0
				let requestFcn: Function | null = QueryQueue.getInstance().pop()

				if(!requestFcn) break

				// retry attempts
				while(retryCount < RETRY_RATE){
					try{
						await requestFcn()
						log.debug('executed'.cyan)
						break
					} catch(e){
						log.error('SRQ error: ' + e.message.red)
						retryCount++
					}
				}
			}
			
			QueryQueue.processing = false
			this.emitEmptyEvent()
			log.debug('loop ended'.red)
		}
	}

	processDelinquencyQueueElements(){
		setInterval(() => {
			// if delinquency queue has queries, add them to queue
			if(this.delinquencyQueue.length > 0){
				if(this.availableSlots > 0){
					log.verbose('Adding delinquent queries to %s available slots', this.availableSlots)
					let additions = this.delinquencyQueue.slice(0, this.availableSlots)
					this.delinquencyQueue.splice(0, this.availableSlots)
					this.availableSlots -= additions.length
					this.queue = this.queue.concat(additions)
					this.processQueue()

				}
			}
		}, 500)
	}

	// TODO enforce strict type on element being added
	add(element: Function) : void{
		if(element.constructor.name != 'Function')
			throw new Error('SRQ Error: Elements added must be a function wrapping around a promise')

		if(this.availableSlots > 0 && this.delinquencyQueue.length == 0){
			this.queue.push(element)
			this.availableSlots--
			this.emitAddEvent()
			setTimeout(() => {this.availableSlots++; this.processQueue(); log.debug(`available: ${this.availableSlots}`.green)}, DELINQUENCY_TIMER)
		}
		else{
			log.warn('Query Queue at capacity [%s]. Queuing in delinquency queue', DELINQUENCY_RATE)
			this.delinquencyQueue.push(element)
			this.emitAddEvent()
		}
	}

	pop() : Function | null {
		if(this.queue.length > 0)
			return this.queue.shift() as Function
		else return null
	}

	getLength() : number{
		return this.queue.length
	}

	emitAddEvent(element?: Function) : void{
		this.emit('add', element)
	}

	emitEmptyEvent() : void{
		this.emit('empty')
	}

	emitFullEvent() : void{
		this.emit('full')
	}

}

namespace ISRQ{
	export interface SRQ{
		add(element: Function) : void
		pop() : Function 
		getLength() : number
		emitAddEvent(element?: Function) : void
		emitEmptyEvent() : void
	}
}

module.exports = QueryQueue