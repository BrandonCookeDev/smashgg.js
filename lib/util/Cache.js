'use strict';

let log = require('winston');
let NodeCache = require('node-cache');

class Cache{

    static getInstance(){
        if(!Cache.cache) {
            Cache.cache = new NodeCache({
                stdTTL: 600,
                checkperiod: 60
            });
        }
        return Cache;
    }

    static get(key){
        return new Promise(function(resolve, reject){
            log.debug('Fetching (%s) from cache', key);
            Cache.cache.get(key, function(err, value){
                return resolve(value);
            })
        })
    }

    static set(key, val){
        return new Promise(function(resolve, reject){
            log.debug('Setting (%s) to value [%s]', key, val);
            Cache.cache.set(key, val, function(err, success){
                if(success) return resolve(success);
                else return reject(new Error("Error setting cache value"))
            })
        })
    }

    static keys(){
        return new Promise(function(resolve, reject){
            log.debug('returning keys');
            Cache.cache.keys(function(err,keys){
                if(err) {
                    log.error('Console.keys: ' + err);
                    return reject(err);
                }
                else resolve(keys);
            });
        })

    }

    static flush(){
        log.debug('flushing cache');
        Cache.cache.flushAll();
    }
}

module.exports = Cache;