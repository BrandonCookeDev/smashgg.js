'use strict'

import 'colors'
import * as Common from './Common'
import {EventEmitter} from 'events'

const RATE_LIMIT_MS_TIME = process.env.SRQRateLimitMsTime || 1100
const RETRY_RATE = process.env.SRQRetryRate || 3

export default class StaggeredRequestQueue extends EventEmitter implements ISRQ.SRQ{

	queue: Array<Function> = []
	static initialized: boolean = false
	static processing: boolean = false
	static instance: StaggeredRequestQueue

	constructor(){
		super()
		this.queue = []
	}

	static init(){
		if(!StaggeredRequestQueue.initialized){
			StaggeredRequestQueue.instance = new StaggeredRequestQueue()
			StaggeredRequestQueue.processing = false

			StaggeredRequestQueue.instance.on('add', async function(){
				if(!StaggeredRequestQueue.processing)
					StaggeredRequestQueue.getInstance().processQueue()
			})

			StaggeredRequestQueue.initialized = true
		}
	}

	/**
	 * getInstance
	 * 
	 * returns the singleton instance of StaggeredRequestQueue
	 */
	static getInstance(){
		if(!StaggeredRequestQueue.initialized)
			throw new Error('StaggeredRequestQueue not initialized!')

		return StaggeredRequestQueue.instance
	}

	/**
	 * processQueue
	 * 
	 * kicks off a while loop that executes until the queue is empty.
	 * continuously runs function elements staggered by a standard milisecond
	 * rate limit set by smashgg.
	 */
	async processQueue(){
		if(!StaggeredRequestQueue.processing){
			StaggeredRequestQueue.processing = true

			while(StaggeredRequestQueue.getInstance().getLength() > 0){
				let retryCount = 0
				let requestFcn: Function = StaggeredRequestQueue.getInstance().pop()

				// retry attempts
				while(retryCount < RETRY_RATE){
					try{
						await Common.sleep(+RATE_LIMIT_MS_TIME)
						await requestFcn()
						break
					} catch(e){
						console.error('SRQ error: ' + e.message.red)
						retryCount++
					}
				}
			}
			
			StaggeredRequestQueue.processing = false
			this.emitEmptyEvent()
		}
	}

	// TODO enforce strict type on element being added
	add(element: Function) : void{
		if(element.constructor.name != 'Function')
			throw new Error('SRQ Error: Elements added must be a function wrapping around a promise')

		this.queue.push(element)
		this.emitAddEvent()
	}

	pop() : Function {
		if(this.queue.length > 0)
			return this.queue.shift() as Function
		else 
			throw new Error('Cannot pop an empty Queue')
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

module.exports = StaggeredRequestQueue