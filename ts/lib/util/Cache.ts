'use strict';

import * as log from 'winston'
import NodeCache from 'node-cache'
import { reject } from 'bluebird';

export default class Cache{

    static instance : NodeCache;

	static getInstance() : NodeCache{
		if(!Cache.instance) {
			Cache.instance = new NodeCache({
				stdTTL: 600,
				checkperiod: 60
			});
		}
		return Cache.instance;
	}

	static get(key: string) : Promise<any>{
		return new Promise(function(resolve){
			log.debug('Fetching (%s) from cache', key);
			Cache.getInstance().get(key, function(err, value){
				if(err) return reject(err);
				else return resolve(value);
			});
		});
	}

	static set(key: string, val: any) : Promise<boolean> {
		return new Promise(function(resolve, reject){
			log.debug('Setting (%s) to value [%s]', key, val);
			Cache.getInstance().set(key, val, function(err, success){
				if(success) return resolve(success);
				else return reject(new Error('Error setting cache value'));
			});
		});
	}

	static keys() : Promise<Array<string>> {
		return new Promise(function(resolve, reject){
			log.debug('returning keys');
			Cache.getInstance().keys(function(err,keys){
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
		Cache.getInstance().flushAll();
	}
}