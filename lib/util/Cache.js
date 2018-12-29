'use strict';
Promise = require('bluebird');
let log = require('winston');
let NodeCache = require('node-cache');

class Cache{

	static init(){
		if(!Cache.initialized){
			Cache.instance = Promise.promisifyAll(
				new NodeCache({
					stdTTL: process.env.CacheTTL || 600,
					checkperiod: process.env.CacheCheckPeriod || 60
				})
			);
			Cache.initialized = true;
		}
	}

	static getInstance(){
		if(!Cache.initialized)
			throw new Error('Cache not initialized!');
		
		return Cache.instance;
	}

	static async get(key){
		log.debug('Fetching (%s) from cache', key);
		return await Cache.getInstance().getAsync(key);
	}

	static async set(key, val){
		log.debug('Setting (%s) to value [%s]', key, val);
		return await Cache.getInstance().setAsync(key, val);
	}

	static async keys(){
		log.debug('returning keys');
		return await Cache.getInstance().keysAsync();
	}

	static flush(){
		log.debug('flushing cache');
		Cache.cache.flushAll();
	}
}

module.exports = Cache;