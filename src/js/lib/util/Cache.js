'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log = __importStar(require("winston"));
var node_cache_1 = __importDefault(require("node-cache"));
var bluebird_1 = require("bluebird");
var TTL = process.env.CacheTTL || 600;
var CHECK_PERIOD = process.env.CacheCheckPeriod || 60;
var Cache = /** @class */ (function () {
    function Cache() {
    }
    Cache.init = function () {
        if (!Cache.initialized) {
            Cache.instance = bluebird_1.promisifyAll(new node_cache_1.default({
                stdTTL: +TTL,
                checkperiod: +CHECK_PERIOD
            }));
            Cache.initialized = true;
        }
    };
    Cache.getInstance = function () {
        if (!Cache.instance) {
            Cache.instance = new node_cache_1.default({
                stdTTL: 600,
                checkperiod: 60
            });
        }
        return Cache.instance;
    };
    Cache.get = function (key) {
        return new Promise(function (resolve, reject) {
            log.debug('Fetching (%s) from cache', key);
            Cache.getInstance().get(key, function (err, value) {
                if (err)
                    return reject(err);
                else
                    return resolve(value);
            });
        });
    };
    Cache.set = function (key, val) {
        return new Promise(function (resolve, reject) {
            log.debug('Setting (%s) to value [%s]', key, val);
            Cache.getInstance().set(key, val, function (err, success) {
                if (success)
                    return resolve(success);
                else
                    return reject(new Error('Error setting cache value'));
            });
        });
    };
    Cache.keys = function () {
        return new Promise(function (resolve, reject) {
            log.debug('returning keys');
            Cache.getInstance().keys(function (err, keys) {
                if (err) {
                    log.error('Console.keys: ' + err);
                    return reject(err);
                }
                else
                    resolve(keys);
            });
        });
    };
    Cache.flush = function () {
        log.debug('flushing cache');
        Cache.getInstance().flushAll();
    };
    Cache.initialized = false;
    return Cache;
}());
exports.default = Cache;
