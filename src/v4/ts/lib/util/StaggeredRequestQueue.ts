'use strict'

import 'colors'
import * as Common from './Common'
import {EventEmitter} from 'events'

const RATE_LIMIT_MS_TIME = process.env.SRQRateLimitMsTime ?? 1100
const RETRY_RATE = process.env.SRQRetryRate ?? 3

export default class StaggeredRequestQueue extends EventEmitter {

	public static initialized: boolean = false
	public static processing: boolean = false
	public static instance: StaggeredRequestQueue

	public static init(){
		if(!StaggeredRequestQueue.initialized){
			StaggeredRequestQueue.instance = new StaggeredRequestQueue()
			StaggeredRequestQueue.processing = false

			StaggeredRequestQueue.instance.on('add', () => {
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
	public static getInstance(){
		if(!StaggeredRequestQueue.initialized)
			throw new Error('StaggeredRequestQueue not initialized!')

		return StaggeredRequestQueue.instance
	}

	public queue: Array<() => any> = []

	constructor(){
		super()
		this.queue = []
	}

	/**
	 * processQueue
	 * 
	 * kicks off a while loop that executes until the queue is empty.
	 * continuously runs function elements staggered by a standard milisecond
	 * rate limit set by startgg.
	 */
	public async processQueue(){
		if(!StaggeredRequestQueue.processing){
			StaggeredRequestQueue.processing = true

			while(StaggeredRequestQueue.getInstance().getLength() > 0){
				let retryCount = 0
				const requestFcn: () => any = StaggeredRequestQueue.getInstance().pop()

				// retry attempts
				while(retryCount < RETRY_RATE){
					try{
						await Common.sleep(+RATE_LIMIT_MS_TIME)
						await requestFcn()
						break
					} catch(e: any){
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
	public add(element: () => any): void{
		if(element.constructor.name !== 'Function')
			throw new Error('SRQ Error: Elements added must be a function wrapping around a promise')

		this.queue.push(element)
		this.emitAddEvent()
	}

	public pop(): () => any {
		if(this.queue.length > 0)
			return this.queue.shift() as () => any
		else 
			throw new Error('Cannot pop an empty Queue')
	}

	public getLength(): number{
		return this.queue.length
	}

	public emitAddEvent(element?: () => any): void {
		this.emit('add', element)
	}

	public emitEmptyEvent(): void{
		this.emit('empty')
	}

}
