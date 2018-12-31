'use strict';

let Common = require('./Common');
let EventEmitter = require('events');

const RATE_LIMIT_MS_TIME = process.env.RateLimitMsTime || 1000;

class StaggeredRequestQueue extends EventEmitter{

	constructor(){
		super();
		this.queue = [];
	}

	static init(){
		if(!StaggeredRequestQueue.initialized){
			StaggeredRequestQueue.instance = new StaggeredRequestQueue();
			StaggeredRequestQueue.processing = false;

			StaggeredRequestQueue.instance.on('add', async function(){
				if(!StaggeredRequestQueue.processing)
					StaggeredRequestQueue.getInstance().processQueue();
			});

			StaggeredRequestQueue.initialized = true;
		}
	}

	/**
	 * getInstance
	 * 
	 * returns the singleton instance of StaggeredRequestQueue
	 */
	static getInstance(){
		if(!StaggeredRequestQueue.initialized)
			throw new Error('StaggeredRequestQueue not initialized!');

		return StaggeredRequestQueue.instance;
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
			StaggeredRequestQueue.processing = true;

			while(StaggeredRequestQueue.getInstance().getLength() > 0){
				await Common.sleep(RATE_LIMIT_MS_TIME);
				let requestFcn = StaggeredRequestQueue.getInstance().pop();
				await requestFcn();
			}
			
			StaggeredRequestQueue.processing = false;
			this.emitEmptyEvent();
		}
	}

	// TODO enforce strict type on element being added
	add(element){
		this.queue.push(element);
		this.emitAddEvent();
	}

	pop(){
		return this.queue.shift();
	}

	getLength(){
		return this.queue.length;
	}

	emitAddEvent(element){
		this.emit('add', element);
	}

	emitEmptyEvent(){
		this.emit('empty');
	}

}

module.exports = StaggeredRequestQueue;