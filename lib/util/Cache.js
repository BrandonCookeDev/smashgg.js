'use strict';
let NodeCache = require('node-cache');

class Cache{

    static getInstance(){
        if(!Cache.cache) {
            Cache.cache = new NodeCache({
                stdTTL: 600,
                checkperiod: 60
            });
        }
        return Cache.cache;
    }

    static get(key){
        return new Promise(function(resolve, reject){
            Cache.cache.get(key, function(value){
                return resolve(value);
            })
        })
    }

    static set(key, val){
        return new Promise(function(resolve, reject){
            Cache.cache.set(key, val, function(success){
                if(success) return resolve(success);
                else return reject(new Error("Error setting cache value"))
            })
        })
    }

    static flush(){
        Cache.cache.flushAll();
    }
}

module.exports = Cache;