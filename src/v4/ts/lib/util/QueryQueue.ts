'use strict'

import 'colors'
import * as Common from './Common'
import log from './Logger'
import moment from 'moment'
import {EventEmitter} from 'events'

const RETRY_RATE = 3
const DELINQUENCY_RATE = 79
const DELINQUENCY_TIMER = 60000 // 1 min
const UPDATE_INTERVAL = 250

class QueueItem{

	item: Function
	timestamp: Date | null
	isExecuted: boolean

	constructor(item: Function, timestamp: Date | null){
		this.item = item
		this.timestamp = timestamp
		this.isExecuted = false;
	}

	execute(){
		this.item();
		this.isExecuted = true;
	}


}

export default class QueryQueue extends EventEmitter{

	queue: Array<QueueItem> = []
	availableSlots: number = DELINQUENCY_RATE

	static initialized: boolean = false
	static processing: boolean = false
	static instance: QueryQueue
	static notificationInterval: any
	static processInterval: any

	constructor(){
		super()
		this.queue = []
		this.availableSlots = DELINQUENCY_RATE
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

			QueryQueue.instance.on('empty', async function(){
				QueryQueue.processing = false;
				clearInterval(QueryQueue.processInterval)
			})

			QueryQueue.instance.processQueue()
			QueryQueue.notificationInterval;
			QueryQueue.processInterval;
			QueryQueue.initialized = true
		}
	}

	/**
	 * getInstance
	 * 
	 * returns the singleton instance of QueryQueue
	 */
	static getInstance(){
		if(!QueryQueue.initialized)
			throw new Error('QueryQueue not initialized!')

		return QueryQueue.instance
	}

	getQueue(){
		return this.queue.slice(0, DELINQUENCY_RATE)
	}

	getDelinquencyQueue(){
		return this.queue.slice(0, DELINQUENCY_RATE)
	}

	processQueue(){
		let _this = this;
		QueryQueue.processing = true;

		// mange removing elements from the queue
		QueryQueue.processInterval = setInterval(() => {
			if(_this.queue.length > 0){
				let beginMoment = moment(_this.queue[0].timestamp!)
				let minuteAfter = moment(_this.queue[0].timestamp!).add(1, 'minute')
				let shouldBePopped = moment().isSameOrAfter(minuteAfter)

				// pop element if needed and then set the DELINQUENCY_RATE'th element
				// timestamp to right now
				if(shouldBePopped) { 
					_this.pop();
					log.info("Slot opened. Queue size: %s", _this.queue.length)
					if(_this.queue.length >= DELINQUENCY_RATE)
						_this.queue[DELINQUENCY_RATE-1].timestamp = moment().toDate()
				}
			}

			// notify users of when the next query will fire if client is delinquent
			if(_this.queue.length >= DELINQUENCY_RATE && !QueryQueue.notificationInterval){
				QueryQueue.notificationInterval = setInterval(() => {
					let minuteAfter = moment(_this.queue[0].timestamp!).add(1, 'minute')
					let timeToNext = moment.duration(minuteAfter.diff(moment()))

					log.debug('element 0 timestamp: %s', moment(_this.queue[0].timestamp!).format())
					log.debug('minuteAfter: %s', minuteAfter.format())

					log.info('next query firing in %s seconds', timeToNext.seconds())
				}, 5000)
			}
			else if(_this.queue.length < DELINQUENCY_RATE && QueryQueue.notificationInterval){
				clearInterval(QueryQueue.notificationInterval)
				QueryQueue.notificationInterval = null;
			}

			// handle function executions
			// functions at or near the delinquency limit should be fired first
			if(_this.queue.length > 0){
				let limit = _this.queue.length >= DELINQUENCY_RATE ? DELINQUENCY_RATE : _this.queue.length
				for(let i = limit; i > 0; i--){
					if(!_this.queue[i-1].isExecuted)
						_this.queue[i-1].execute()
				}
			}

			// fire event if the queue is empty
			if(_this.queue.length == 0)
				_this.emitEmptyEvent()
		}, UPDATE_INTERVAL)
	}

	add(element: Function) : void{
		if(element.constructor.name != 'Function')
			throw new Error('SRQ Error: Elements added must be a function wrapping around a promise')

		let item;
		if(this.queue.length < DELINQUENCY_RATE){
			log.verbose('Queue Size: %s. Adding to queue', this.queue.length)
			item = new QueueItem(element, moment().toDate())
		}
		else{
			this.emitFullEvent()
			log.warn('Queue Size: %s. Queueing in delinquency', this.queue.length)
			item = new QueueItem(element, null)
		}

		this.queue.push(item)
	}

	pop() : QueueItem | null {
		if(this.queue.length > 0)
			return this.queue.shift() as QueueItem
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