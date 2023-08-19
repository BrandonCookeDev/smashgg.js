import log from './Logger'
import NodeCache from 'node-cache'
//import { promisifyAll } from 'bluebird'

const TTL = process.env.CacheTTL ?? 600
const CHECK_PERIOD = process.env.CacheCheckPeriod ?? 60

export default class Cache{

	public static instance: NodeCache
	public static initialized: boolean = false
    public static enableLegacyCallbacks: boolean = true

	public static init(){
		if(!Cache.initialized){
//			Cache.instance = promisifyAll(
				Cache.instance = new NodeCache({
					stdTTL: +TTL,
					checkperiod: +CHECK_PERIOD
				})
//			)
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
            try{
                const result = Cache.getInstance().get(key)
                resolve(result)
            }
            catch(err){
                log.debug('Error found: [%s]', err.message)
                reject(err)
            }
		})
	}

	public static set(key: string, val: any): Promise<boolean> {
		return new Promise((resolve, reject) => {
			log.debug('Setting (%s) to value [%s]', key, val)
			try{
                const result = Cache.getInstance().set(key, val)
                resolve(result)
            }
            catch(err){
                log.debug('Error found: [%s]', err.message)
                reject(err)
            }
		})
	}

	public static keys(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			log.debug('returning keys')
            try{
                const result = Cache.getInstance().keys()
                resolve(result)
            }
            catch(err){
                log.debug('Error found: [%s]', err.message)
                reject(err)
            }
	   })
    }

	public static flush(): void{
		log.debug('flushing cache')
		Cache.getInstance().flushAll()
	}
}
