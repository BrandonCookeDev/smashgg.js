'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __importDefault(require("./Logger"));
var node_cache_1 = __importDefault(require("node-cache"));
var bluebird_1 = require("bluebird");
var Cache = /** @class */ (function () {
    function Cache() {
    }
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
        return new Promise(function (resolve) {
            Logger_1.default.debug('Fetching (%s) from cache', key);
            Cache.getInstance().get(key, function (err, value) {
                if (err)
                    return bluebird_1.reject(err);
                else
                    return resolve(value);
            });
        });
    };
    Cache.set = function (key, val) {
        return new Promise(function (resolve, reject) {
            Logger_1.default.debug('Setting (%s) to value [%s]', key, val);
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
            Logger_1.default.debug('returning keys');
            Cache.getInstance().keys(function (err, keys) {
                if (err) {
                    Logger_1.default.error('Console.keys: ' + err);
                    return reject(err);
                }
                else
                    resolve(keys);
            });
        });
    };
    Cache.flush = function () {
        Logger_1.default.debug('flushing cache');
        Cache.getInstance().flushAll();
    };
    return Cache;
}());
exports.default = Cache;
