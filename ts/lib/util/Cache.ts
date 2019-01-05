'use strict';

import * as log from '../util/Logger'
import * as NodeCache from 'node-cache'

class Cache{

    static cache : NodeCache;

	static getInstance() : Cache{
		if(!Cache.cache) {
			Cache.cache = new NodeCache({
				stdTTL: 600,
				checkperiod: 60
			});
		}
		return Cache;
	}

	static get(key: string) : Promise<object>{
		return new Promise(function(resolve){
			log.debug('Fetching (%s) from cache', key);
			Cache.cache.get(key, function(err, value){
				return resolve(value);
			});
		});
	}

	static set(key: string, val: object) : Promise<boolean> {
		return new Promise(function(resolve, reject){
			log.debug('Setting (%s) to value [%s]', key, val);
			Cache.cache.set(key, val, function(err, success){
				if(success) return resolve(success);
				else return reject(new Error('Error setting cache value'));
			});
		});
	}

	static keys() : Promise<Array<string>> {
		return new Promise(function(resolve, reject){
			log.debug('returning keys');
			Cache.cache.keys(function(err,keys){
				if(err) {
					log.error('Console.keys: ' + err);
					return reject(err);
				}
				else resolve(keys);
			});
		});
	}

	static flush() : void{
		log.debug('flushing cache');
		Cache.cache.flushAll();
	}
}

module.exports = Cache;