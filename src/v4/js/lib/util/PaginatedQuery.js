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
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __importDefault(require("./Logger"));
var NetworkInterface_1 = __importDefault(require("./NetworkInterface"));
var Common_1 = require("./Common");
var TOTAL_PAGES_REGEX_JSON = new RegExp(/"pageInfo":[\s]?{[\n\s]*?"totalPages": ([0-9]*)/);
var TOTAL_PAGES_REGEX_STRING = new RegExp(/"pageInfo":{"totalPages":([0-9]*)}/);
var MAX_COMPLEXITY = 1000;
//{ b: 1,
//c: 2,
//d: { d: 3, s: 1, e: 1, f: { o: 0 } },
//g: { d: 3, g: 32, e: 1 } }
var PaginatedQuery = /** @class */ (function () {
    function PaginatedQuery() {
    }
    PaginatedQuery.query = function (operationName, queryString, params, options, additionalParams) {
        return __awaiter(this, void 0, void 0, function () {
            var page, perPage, filters, queryOptions, query, data, totalPagesExec, totalPages, complexity, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        Logger_1.default.info('%s: Calling Paginated Querys', operationName);
                        page = options != undefined && options.page ? options.page : 1;
                        perPage = options != undefined && options.perPage ? options.perPage : 1;
                        filters = options != undefined && options.filters ? options.filters : null;
                        queryOptions = {
                            page: page,
                            perPage: perPage,
                            filters: filters,
                            pageInfo: 'pageInfo{\ntotalPages\n}'
                        };
                        queryOptions = Object.assign(queryOptions, additionalParams);
                        query = Common_1.merge(queryString, queryOptions);
                        return [4 /*yield*/, NetworkInterface_1.default.query(query, params)];
                    case 1:
                        data = [_c.sent()];
                        totalPagesExec = TOTAL_PAGES_REGEX_STRING.exec(JSON.stringify(data));
                        if (!totalPagesExec)
                            throw new Error(operationName + ": Something wrong with paginated query. Did not match regex " + TOTAL_PAGES_REGEX_STRING.toString());
                        else if (data.length <= 0)
                            throw new Error(operationName + ": No data returned from query for operation");
                        totalPages = +totalPagesExec[1];
                        complexity = PaginatedQuery.determineComplexity(data[0]) //Object.keys(data[0]).length
                        ;
                        perPage =
                            options != undefined && options.perPage != undefined ?
                                options.perPage : PaginatedQuery.calculateOptimalPagecount(complexity);
                        i = page;
                        _c.label = 2;
                    case 2:
                        if (!(i <= totalPages)) return [3 /*break*/, 5];
                        Logger_1.default.info('%s: Collected %s/%s pages', operationName, i, totalPages);
                        queryOptions = Object.assign({
                            page: page + i,
                            perPage: perPage,
                            filters: filters,
                            pageInfo: ''
                        }, additionalParams);
                        query = Common_1.merge(queryString, queryOptions);
                        _b = (_a = data).push;
                        return [4 /*yield*/, NetworkInterface_1.default.query(query, params)];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, data];
                }
            });
        });
    };
    PaginatedQuery.calculateOptimalPagecount = function (objectComplexity) {
        return MAX_COMPLEXITY / objectComplexity;
    };
    PaginatedQuery.determineComplexity = function (objects) {
        var complexity = 0;
        var nextArgs = [];
        for (var i in objects) {
            // add 1 for each object passed into the function arg array
            complexity++;
            var cur = objects[i];
            for (var key in cur) {
                if (key === 'pageInfo')
                    continue;
                else if (typeof cur[key] === 'object' && cur[key] != null) {
                    // if array, calculate the first object then multiple by how many perPage
                    // otherwise add object to nextArgs and dig
                    if (Array.isArray(cur[key])) {
                        complexity *= cur[key].length;
                        nextArgs.push(cur[key][0]);
                    }
                    else {
                        nextArgs.push(cur[key]);
                    }
                }
            }
        }
        if (nextArgs.length === 0)
            return complexity;
        else
            return complexity + PaginatedQuery.determineComplexity(nextArgs);
    };
    return PaginatedQuery;
}());
exports.default = PaginatedQuery;
