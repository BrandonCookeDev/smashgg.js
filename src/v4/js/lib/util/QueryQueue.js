'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var Logger_1 = __importDefault(require("./Logger"));
var moment_1 = __importDefault(require("moment"));
var events_1 = require("events");
var RETRY_RATE = 3;
var DELINQUENCY_RATE = 79;
var DELINQUENCY_TIMER = 60000; // 1 min
var UPDATE_INTERVAL = 250;
var QueueItem = /** @class */ (function () {
    function QueueItem(item, timestamp) {
        this.item = item;
        this.timestamp = timestamp;
        this.isExecuted = false;
    }
    QueueItem.prototype.execute = function () {
        this.item();
        this.isExecuted = true;
    };
    return QueueItem;
}());
var QueryQueue = /** @class */ (function (_super) {
    __extends(QueryQueue, _super);
    function QueryQueue() {
        var _this_1 = _super.call(this) || this;
        _this_1.queue = [];
        _this_1.availableSlots = DELINQUENCY_RATE;
        _this_1.queue = [];
        _this_1.availableSlots = DELINQUENCY_RATE;
        return _this_1;
    }
    QueryQueue.init = function () {
        if (!QueryQueue.initialized) {
            QueryQueue.instance = new QueryQueue();
            QueryQueue.processing = false;
            QueryQueue.instance.on('add', function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!QueryQueue.processing)
                            QueryQueue.instance.processQueue();
                        return [2 /*return*/, true];
                    });
                });
            });
            QueryQueue.instance.on('empty', function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        QueryQueue.processing = false;
                        clearInterval(QueryQueue.processInterval);
                        return [2 /*return*/];
                    });
                });
            });
            QueryQueue.instance.processQueue();
            QueryQueue.notificationInterval;
            QueryQueue.processInterval;
            QueryQueue.initialized = true;
        }
    };
    /**
     * getInstance
     *
     * returns the singleton instance of QueryQueue
     */
    QueryQueue.getInstance = function () {
        if (!QueryQueue.initialized)
            throw new Error('QueryQueue not initialized!');
        return QueryQueue.instance;
    };
    QueryQueue.prototype.getQueue = function () {
        return this.queue.slice(0, DELINQUENCY_RATE);
    };
    QueryQueue.prototype.getDelinquencyQueue = function () {
        return this.queue.slice(0, DELINQUENCY_RATE);
    };
    QueryQueue.prototype.processQueue = function () {
        var _this = this;
        QueryQueue.processing = true;
        // mange removing elements from the queue
        QueryQueue.processInterval = setInterval(function () {
            if (_this.queue.length > 0) {
                var beginMoment = moment_1.default(_this.queue[0].timestamp);
                var minuteAfter = moment_1.default(_this.queue[0].timestamp).add(1, 'minute');
                var shouldBePopped = moment_1.default().isSameOrAfter(minuteAfter);
                // pop element if needed and then set the DELINQUENCY_RATE'th element
                // timestamp to right now
                if (shouldBePopped) {
                    _this.pop();
                    Logger_1.default.info("Slot opened. Queue size: %s", _this.queue.length);
                    if (_this.queue.length >= DELINQUENCY_RATE)
                        _this.queue[DELINQUENCY_RATE - 1].timestamp = moment_1.default().toDate();
                }
            }
            // notify users of when the next query will fire if client is delinquent
            if (_this.queue.length >= DELINQUENCY_RATE && !QueryQueue.notificationInterval) {
                QueryQueue.notificationInterval = setInterval(function () {
                    var minuteAfter = moment_1.default(_this.queue[0].timestamp).add(1, 'minute');
                    var timeToNext = moment_1.default.duration(minuteAfter.diff(moment_1.default()));
                    Logger_1.default.debug('element 0 timestamp: %s', moment_1.default(_this.queue[0].timestamp).format());
                    Logger_1.default.debug('minuteAfter: %s', minuteAfter.format());
                    Logger_1.default.info('next query firing in %s seconds', timeToNext.seconds());
                }, 5000);
            }
            else if (_this.queue.length < DELINQUENCY_RATE && QueryQueue.notificationInterval) {
                clearInterval(QueryQueue.notificationInterval);
                QueryQueue.notificationInterval = null;
            }
            // handle function executions
            // functions at or near the delinquency limit should be fired first
            if (_this.queue.length > 0) {
                var limit = _this.queue.length >= DELINQUENCY_RATE ? DELINQUENCY_RATE : _this.queue.length;
                for (var i = limit; i > 0; i--) {
                    if (!_this.queue[i - 1].isExecuted)
                        _this.queue[i - 1].execute();
                }
            }
            // fire event if the queue is empty
            if (_this.queue.length == 0)
                _this.emitEmptyEvent();
        }, UPDATE_INTERVAL);
    };
    QueryQueue.prototype.add = function (element) {
        if (element.constructor.name != 'Function')
            throw new Error('SRQ Error: Elements added must be a function wrapping around a promise');
        var item;
        if (this.queue.length < DELINQUENCY_RATE) {
            Logger_1.default.verbose('Queue Size: %s. Adding to queue', this.queue.length);
            item = new QueueItem(element, moment_1.default().toDate());
        }
        else {
            this.emitFullEvent();
            Logger_1.default.warn('Queue Size: %s. Queueing in delinquency', this.queue.length);
            item = new QueueItem(element, null);
        }
        this.queue.push(item);
    };
    QueryQueue.prototype.pop = function () {
        if (this.queue.length > 0)
            return this.queue.shift();
        else
            return null;
    };
    QueryQueue.prototype.getLength = function () {
        return this.queue.length;
    };
    QueryQueue.prototype.emitAddEvent = function (element) {
        this.emit('add', element);
    };
    QueryQueue.prototype.emitEmptyEvent = function () {
        this.emit('empty');
    };
    QueryQueue.prototype.emitFullEvent = function () {
        this.emit('full');
    };
    QueryQueue.initialized = false;
    QueryQueue.processing = false;
    return QueryQueue;
}(events_1.EventEmitter));
exports.default = QueryQueue;
module.exports = QueryQueue;
