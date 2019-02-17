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
var events_1 = require("events");
var RETRY_RATE = 3;
var DELINQUENCY_RATE = 79;
var DELINQUENCY_TIMER = 60000; // 1 min
var QueryQueue = /** @class */ (function (_super) {
    __extends(QueryQueue, _super);
    function QueryQueue() {
        var _this = _super.call(this) || this;
        _this.queue = [];
        _this.availableSlots = DELINQUENCY_RATE;
        _this.delinquencyQueue = [];
        _this.queue = [];
        _this.availableSlots = DELINQUENCY_RATE;
        _this.delinquencyQueue = [];
        return _this;
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
            QueryQueue.instance.processDelinquencyQueueElements();
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
    /**
     * processQueue
     *
     * kicks off a while loop that executes until the queue is empty.
     * continuously runs function elements
     */
    QueryQueue.prototype.processQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var retryCount, requestFcn, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!QueryQueue.processing) return [3 /*break*/, 9];
                        QueryQueue.processing = true;
                        Logger_1.default.debug('loop begun'.green);
                        Logger_1.default.debug('Queue Size: %s', String(this.queue.length).green);
                        Logger_1.default.debug('Available Slots: %s', String(this.availableSlots).magenta);
                        Logger_1.default.debug('Delinquency Length: %s', String(this.delinquencyQueue.length).red);
                        _a.label = 1;
                    case 1:
                        if (!(this.queue.length > 0 || this.delinquencyQueue.length > 0)) return [3 /*break*/, 8];
                        retryCount = 0;
                        requestFcn = QueryQueue.getInstance().pop();
                        if (!requestFcn)
                            return [3 /*break*/, 8];
                        _a.label = 2;
                    case 2:
                        if (!(retryCount < RETRY_RATE)) return [3 /*break*/, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, requestFcn()];
                    case 4:
                        _a.sent();
                        Logger_1.default.debug('executed'.cyan);
                        return [3 /*break*/, 7];
                    case 5:
                        e_1 = _a.sent();
                        Logger_1.default.error('SRQ error: ' + e_1.message.red);
                        retryCount++;
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 1];
                    case 8:
                        QueryQueue.processing = false;
                        this.emitEmptyEvent();
                        Logger_1.default.debug('loop ended'.red);
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * processDelinquencyQueueElements
     *
     * Elements who were added after the rate limit were put in
     * the Delinquency queue. These are elements who must wait for a
     * slot to open in the main queue in order for them to be executed.
     */
    QueryQueue.prototype.processDelinquencyQueueElements = function () {
        var _this = this;
        setInterval(function () {
            // if delinquency queue has queries, add them to queue
            if (_this.delinquencyQueue.length > 0) {
                if (_this.availableSlots > 0) {
                    Logger_1.default.verbose('Adding delinquent queries to %s available slots', _this.availableSlots);
                    var additions = _this.delinquencyQueue.slice(0, _this.availableSlots);
                    _this.delinquencyQueue.splice(0, _this.availableSlots);
                    _this.availableSlots -= additions.length;
                    _this.queue = _this.queue.concat(additions);
                    _this.processQueue();
                }
            }
        }, 500);
    };
    QueryQueue.prototype.add = function (element) {
        var _this = this;
        if (element.constructor.name != 'Function')
            throw new Error('SRQ Error: Elements added must be a function wrapping around a promise');
        if (this.availableSlots > 0 && this.delinquencyQueue.length == 0) {
            this.queue.push(element);
            this.availableSlots--;
            this.emitAddEvent();
            setTimeout(function () { _this.availableSlots++; _this.processQueue(); Logger_1.default.debug(("available: " + _this.availableSlots).green); }, DELINQUENCY_TIMER);
        }
        else {
            Logger_1.default.warn('Query Queue at capacity [%s]. Queuing in delinquency queue', DELINQUENCY_RATE);
            this.delinquencyQueue.push(element);
            this.emitAddEvent();
        }
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
