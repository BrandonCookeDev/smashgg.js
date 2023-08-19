'use strict'

import 'colors'
import log from './Logger'
import moment from 'moment'
import {EventEmitter} from 'events'

import QueueItem from './QueryQueueItem'

const RETRY_RATE = 3
const DELINQUENCY_RATE = 79
const DELINQUENCY_TIMER = 60000 // 1 min
const UPDATE_INTERVAL = 250

export default class QueryQueue extends EventEmitter{

	public static initialized: boolean = false
	public static processing: boolean = false
	public static instance: QueryQueue
	public static notificationInterval: any
	public static processInterval: any

	public static init(){
		if(!QueryQueue.initialized){
			QueryQueue.instance = new QueryQueue()
			QueryQueue.processing = false

			QueryQueue.instance.on('add', () => {
				if(!QueryQueue.processing)
					QueryQueue.instance.processQueue()
				return true
			})

			QueryQueue.instance.on('empty', () => {
				QueryQueue.processing = false
				clearInterval(QueryQueue.processInterval)
			})

			QueryQueue.instance.processQueue()
			QueryQueue.notificationInterval = 0
			QueryQueue.processInterval = 0
			QueryQueue.initialized = true
		}
	}

	/**
	 * getInstance
	 * 
	 * returns the singleton instance of QueryQueue
	 */
	public static getInstance(){
		if(!QueryQueue.initialized)
			throw new Error('QueryQueue not initialized!')

		return QueryQueue.instance
	}

	public queue: QueueItem[] = []
	public availableSlots: number = DELINQUENCY_RATE
	
	constructor(){
		super()
		this.queue = []
		this.availableSlots = DELINQUENCY_RATE
	}

	public getQueue(){
		return this.queue.slice(0, DELINQUENCY_RATE)
	}

	public getDelinquencyQueue(){
		return this.queue.slice(0, DELINQUENCY_RATE)
	}

	public processQueue(){
		const thisQueue = this
		QueryQueue.processing = true

		// mange removing elements from the queue
		QueryQueue.processInterval = setInterval(() => {
			if(thisQueue.queue.length > 0){
				//const beginMoment = moment(thisQueue.queue[0].timestamp)
				const minuteAfter = moment(thisQueue.queue[0].timestamp).add(1, 'minute')
				const shouldBePopped = moment().isSameOrAfter(minuteAfter)

				// pop element if needed and then set the DELINQUENCY_RATE'th element
				// timestamp to right now
				if(shouldBePopped) { 
					thisQueue.pop()
					log.info('Slot opened. Queue size: %s', thisQueue.queue.length)
					if(thisQueue.queue.length >= DELINQUENCY_RATE)
						thisQueue.queue[DELINQUENCY_RATE-1].timestamp = moment().toDate()
				}
			}

			// notify users of when the next query will fire if client is delinquent
			if(thisQueue.queue.length >= DELINQUENCY_RATE && !QueryQueue.notificationInterval){
				QueryQueue.notificationInterval = setInterval(() => {
					const minuteAfter = moment(thisQueue.queue[0].timestamp).add(1, 'minute')
					const timeToNext = moment.duration(minuteAfter.diff(moment()))

					log.debug('element 0 timestamp: %s', moment(thisQueue.queue[0].timestamp).format())
					log.debug('minuteAfter: %s', minuteAfter.format())

					log.info('next query firing in %s seconds', timeToNext.seconds())
				}, 5000)
			}
			else if(thisQueue.queue.length < DELINQUENCY_RATE && QueryQueue.notificationInterval){
				clearInterval(QueryQueue.notificationInterval)
				QueryQueue.notificationInterval = null
			}

			// handle function executions
			// functions at or near the delinquency limit should be fired first
			if(thisQueue.queue.length > 0){
				const limit = thisQueue.queue.length >= DELINQUENCY_RATE ? DELINQUENCY_RATE : thisQueue.queue.length
				for(let i = limit; i > 0; i--){
					if(!thisQueue.queue[i-1].isExecuted)
						thisQueue.queue[i-1].execute()
				}
			}

			// fire event if the queue is empty
			if(thisQueue.queue.length === 0)
				thisQueue.emitEmptyEvent()
		}, UPDATE_INTERVAL)
	}

	public add(element: () => any): void{
		if(element.constructor.name !== 'Function')
			throw new Error('SRQ Error: Elements added must be a function wrapping around a promise')

		let item
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

	public pop(): QueueItem | null {
		if(this.queue.length > 0)
			return this.queue.shift() as QueueItem
		else return null
	}

	public getLength(): number{
		return this.queue.length
	}

	public emitAddEvent(element?: () => any): void{
		this.emit('add', element)
	}

	public emitEmptyEvent(): void{
		this.emit('empty')
	}

	public emitFullEvent(): void{
		this.emit('full')
	}

}
