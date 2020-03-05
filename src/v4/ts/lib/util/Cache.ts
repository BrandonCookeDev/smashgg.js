import log from './Logger'
import NodeCache from 'node-cache'
import { promisifyAll } from 'bluebird'

const TTL = process.env.CacheTTL || 600
const CHECK_PERIOD = process.env.CacheCheckPeriod || 60

export default class Cache{

	public static instance: NodeCache
	public static initialized: boolean = false

	public static init(){
		if(!Cache.initialized){
			Cache.instance = promisifyAll(
				new NodeCache({
					stdTTL: +TTL,
					checkperiod: +CHECK_PERIOD 
				})
			)
			Cache.initialized = true
		}
	}
	

	public static getInstance(): NodeCache{
		if(!Cache.instance) {
			Cache.instance = new NodeCache({
				stdTTL: 600,
				checkperiod: 60
			})
		}
		return Cache.instance
	}

	public static get(key: string): Promise<any>{
		return new Promise((resolve, reject) => {
			log.debug('Fetching (%s) from cache', key)
			Cache.getInstance().get(key, (err, value) => {
				if(err) return reject(err)
				else return resolve(value)
			})
		})
	}

	public static set(key: string, val: any): Promise<boolean> {
		return new Promise((resolve, reject) => {
			log.debug('Setting (%s) to value [%s]', key, val)
			Cache.getInstance().set(key, val, (err, success) => {
				if(success) return resolve(success)
				else return reject(new Error('Error setting cache value'))
			})
		})
	}

	public static keys(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			log.debug('returning keys')
			Cache.getInstance().keys((err,keys) => {
				if(err) {
					log.error('Console.keys: ' + err)
					return reject(err)
				}
				else resolve(keys)
			})
		})
	}

	public static flush(): void{
		log.debug('flushing cache')
		Cache.getInstance().flushAll()
	}
}
