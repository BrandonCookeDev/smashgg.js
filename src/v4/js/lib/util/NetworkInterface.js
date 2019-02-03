"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_1 = __importDefault(require("request-promise"));
var graphql_request_1 = require("graphql-request");
var Common = __importStar(require("./Common"));
var StaggeredRequestQueue_1 = __importDefault(require("./StaggeredRequestQueue"));
var TokenHandler_1 = __importDefault(require("./TokenHandler"));
//import {ITournament, IEvent, IPhase, IPhaseGroup, IPlayer, IGGSet} from '../internal'
var API_URL = process.env.ApiUrl || 'https://api.smash.gg/gql/alpha';
var RATE_LIMIT_MS_TIME = process.env.RateLimitMsTime || 1000;
var NetworkInterface = /** @class */ (function () {
    function NetworkInterface() {
    }
    NetworkInterface.init = function () {
        NetworkInterface.client = new graphql_request_1.GraphQLClient(API_URL, NetworkInterface.getHeaders());
        NetworkInterface.initialized = true;
    };
    NetworkInterface.getHeaders = function () {
        var token = TokenHandler_1.default.getToken();
        if (!token)
            throw new Error('Cannot initialize without a token for smash.gg');
        return {
            headers: {
                'X-Source': 'smashgg.js',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        };
    };
    /**
     * query
     *
     * takes a graphql query string and corresponding variable object
     * and puts the execution of this query into a queue which is staggered
     * by the standard rate limit imposed by smashgg.
     *
     * Useful for when many queries need to be run consecutively
     *
     * @param  {string} query
     * @param  {object} variables
     * @returns {promise} resolving the results of the query after being staggered in the request queue
     */
    NetworkInterface.query = function (query, variables) {
        //console.log(query, variables)
        return new Promise(function (resolve, reject) {
            StaggeredRequestQueue_1.default.getInstance().add(function () {
                return NetworkInterface.client.request(query, variables)
                    .then(resolve)
                    .catch(reject);
            });
        });
    };
    NetworkInterface.singleQuery = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Common.sleep(+RATE_LIMIT_MS_TIME)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, NetworkInterface.client.request(query, variables)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NetworkInterface.query3 = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'POST',
                            headers: NetworkInterface.getHeaders().headers,
                            uri: API_URL,
                            body: {
                                query: query,
                                variables: variables
                            },
                            json: true
                        };
                        return [4 /*yield*/, Common.sleep(+RATE_LIMIT_MS_TIME)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, request_promise_1.default(options)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NetworkInterface.initialized = false;
    return NetworkInterface;
}());
exports.default = NetworkInterface;
module.exports = NetworkInterface;
