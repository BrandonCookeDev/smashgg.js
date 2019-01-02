'use strict'

require('colors')
let Common = require('./Common')
let EventEmitter = require('events')

const RATE_LIMIT_MS_TIME = process.env.SRQRateLimitMsTime || 1100
const RETRY_RATE = process.env.SRQRetryRate || 3

class StaggeredRequestQueue extends EventEmitter{

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
				let requestFcn = StaggeredRequestQueue.getInstance().pop()

				// retry attempts
				while(retryCount < RETRY_RATE){
					try{
						await Common.sleep(RATE_LIMIT_MS_TIME)
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
	add(element){
		if(element.constructor.name != 'Function')
			throw new Error('SRQ Error: Elements added must be a function wrapping around a promise')

		this.queue.push(element)
		this.emitAddEvent()
	}

	pop(){
		return this.queue.shift()
	}

	getLength(){
		return this.queue.length
	}

	emitAddEvent(element){
		this.emit('add', element)
	}

	emitEmptyEvent(){
		this.emit('empty')
	}

}

module.exports = StaggeredRequestQueue