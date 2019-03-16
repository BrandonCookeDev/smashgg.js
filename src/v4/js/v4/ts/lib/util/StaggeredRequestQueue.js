'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var Common = __importStar(require("./Common"));
var events_1 = require("events");
var RATE_LIMIT_MS_TIME = process.env.SRQRateLimitMsTime || 1100;
var RETRY_RATE = process.env.SRQRetryRate || 3;
var StaggeredRequestQueue = /** @class */ (function (_super) {
    __extends(StaggeredRequestQueue, _super);
    function StaggeredRequestQueue() {
        var _this = _super.call(this) || this;
        _this.queue = [];
        _this.queue = [];
        return _this;
    }
    StaggeredRequestQueue.init = function () {
        if (!StaggeredRequestQueue.initialized) {
            StaggeredRequestQueue.instance = new StaggeredRequestQueue();
            StaggeredRequestQueue.processing = false;
            StaggeredRequestQueue.instance.on('add', function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!StaggeredRequestQueue.processing)
                            StaggeredRequestQueue.getInstance().processQueue();
                        return [2 /*return*/];
                    });
                });
            });
            StaggeredRequestQueue.initialized = true;
        }
    };
    /**
     * getInstance
     *
     * returns the singleton instance of StaggeredRequestQueue
     */
    StaggeredRequestQueue.getInstance = function () {
        if (!StaggeredRequestQueue.initialized)
            throw new Error('StaggeredRequestQueue not initialized!');
        return StaggeredRequestQueue.instance;
    };
    /**
     * processQueue
     *
     * kicks off a while loop that executes until the queue is empty.
     * continuously runs function elements staggered by a standard milisecond
     * rate limit set by smashgg.
     */
    StaggeredRequestQueue.prototype.processQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var retryCount, requestFcn, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!StaggeredRequestQueue.processing) return [3 /*break*/, 10];
                        StaggeredRequestQueue.processing = true;
                        _a.label = 1;
                    case 1:
                        if (!(StaggeredRequestQueue.getInstance().getLength() > 0)) return [3 /*break*/, 9];
                        retryCount = 0;
                        requestFcn = StaggeredRequestQueue.getInstance().pop();
                        _a.label = 2;
                    case 2:
                        if (!(retryCount < RETRY_RATE)) return [3 /*break*/, 8];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, Common.sleep(+RATE_LIMIT_MS_TIME)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, requestFcn()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        e_1 = _a.sent();
                        console.error('SRQ error: ' + e_1.message.red);
                        retryCount++;
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 1];
                    case 9:
                        StaggeredRequestQueue.processing = false;
                        this.emitEmptyEvent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    // TODO enforce strict type on element being added
    StaggeredRequestQueue.prototype.add = function (element) {
        if (element.constructor.name != 'Function')
            throw new Error('SRQ Error: Elements added must be a function wrapping around a promise');
        this.queue.push(element);
        this.emitAddEvent();
    };
    StaggeredRequestQueue.prototype.pop = function () {
        if (this.queue.length > 0)
            return this.queue.shift();
        else
            throw new Error('Cannot pop an empty Queue');
    };
    StaggeredRequestQueue.prototype.getLength = function () {
        return this.queue.length;
    };
    StaggeredRequestQueue.prototype.emitAddEvent = function (element) {
        this.emit('add', element);
    };
    StaggeredRequestQueue.prototype.emitEmptyEvent = function () {
        this.emit('empty');
    };
    StaggeredRequestQueue.initialized = false;
    StaggeredRequestQueue.processing = false;
    return StaggeredRequestQueue;
}(events_1.EventEmitter));
exports.default = StaggeredRequestQueue;
module.exports = StaggeredRequestQueue;
