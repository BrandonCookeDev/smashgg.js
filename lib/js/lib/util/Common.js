"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Encoder_1 = __importDefault(require("./Encoder"));
var DEFAULT_CONCURRENCY = 4;
function parseOptions(options) {
    return {
        isCached: options.isCached != undefined ? options.isCached === true : true,
        concurrency: options.concurrency || DEFAULT_CONCURRENCY,
        rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
    };
}
exports.parseOptions = parseOptions;
function createExpandsString(expands) {
    var expandsString = '';
    for (var property in expands) {
        if (expands.hasOwnProperty(property))
            expandsString += util_1.format('expand[]=%s&', property);
    }
    return expandsString;
}
exports.createExpandsString = createExpandsString;
var ICommon;
(function (ICommon) {
    function parseOptions(options) {
        return {
            isCached: options.isCached != undefined ? options.isCached === true : true,
            concurrency: options.concurrency || 4,
            rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
        };
    }
    ICommon.parseOptions = parseOptions;
})(ICommon = exports.ICommon || (exports.ICommon = {}));
