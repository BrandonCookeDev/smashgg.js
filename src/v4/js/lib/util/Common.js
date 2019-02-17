"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Encoder_1 = __importDefault(require("./Encoder"));
var lodash_1 = __importDefault(require("lodash"));
var Logger_1 = __importDefault(require("./Logger"));
var DEFAULT_CONCURRENCY = 4;
var TOP_8_LABELS = [
    'Losers Quarter-Final', 'Losers Semi-Final',
    'Winners Semi-Final', 'Winners Final',
    'Grand Final', 'Grand Final Reset', 'Losers Final'
];
var TOP_8_LABELS_STANDALONE = [
    'Losers Quarter-Final', 'Losers Semi-Final',
    'Winners Semi-Final', 'Winners Final',
    'Grand Final', 'Grand Final Reset', 'Losers Final',
    'Losers Round 1'
];
var losersRoundRegex = new RegExp(/Losers Round ([0-9])/);
function merge(target, obj) {
    var ret = lodash_1.default.clone(target);
    for (var prop in obj) {
        var regex = new RegExp("{" + prop + "}", 'g');
        ret = ret.replace(regex, obj[prop]);
    }
    return ret;
}
exports.merge = merge;
function mergeQuery(target, obj) {
    var ret = lodash_1.default.clone(target);
    for (var prop in obj) {
        var regex = new RegExp("{" + prop + "}", 'g');
        ret = ret.replace(regex, obj[prop]);
    }
    var orphanedVarsRegex = new RegExp(/\{[\S]*\}/, 'g');
    var orphanedVars = orphanedVarsRegex.exec(ret);
    if (orphanedVars) {
        Logger_1.default.warn('Variables orphaned by this query: [%s]', orphanedVars.join(','));
        Logger_1.default.warn('Replacing orphans with null');
        ret = ret.replace(orphanedVarsRegex, 'null');
    }
    Logger_1.default.queries(ret);
    return ret;
}
exports.mergeQuery = mergeQuery;
function determineComplexity() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var complexity = 0;
    var objs = [];
    for (var i in objects) {
        var obj = objects[i];
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                complexity++;
                objs.push(obj[key]);
            }
        }
    }
    if (complexity == 0)
        return 0;
    else
        return complexity + determineComplexity(objs);
}
exports.determineComplexity = determineComplexity;
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function orderTop8(sets) {
    var ordered = [];
    var fn = function (roundName) {
        ordered = ordered.concat(lodash_1.default.find(sets, function (set) {
            return set.getFullRoundText() == roundName;
        }));
    };
    var hasReset = lodash_1.default.find(sets, function (set) {
        return set.getFullRoundText() === 'Grand Final Reset';
    });
    if (hasReset)
        fn('Grand Final Reset');
    fn('Grand Final');
    fn('Losers Final');
    fn('Losers Semi-Final');
    fn('Winners Final');
    fn('Losers Quarter-Final');
    fn('Winners Semi-Final');
    var roundNames = sets.map(function (set) { return set.getFullRoundText(); });
    var losersRoundName = roundNames.filter(function (name) { return losersRoundRegex.test(name); })[0];
    fn(losersRoundName);
    return ordered;
}
exports.orderTop8 = orderTop8;
function parseOptions(options) {
    return {
        isCached: options.isCached != undefined ? options.isCached === true : true,
        concurrency: options.concurrency || DEFAULT_CONCURRENCY,
        rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
    };
}
exports.parseOptions = parseOptions;
// todo remove theabove and below non-null expectations
function getHighestLevelLosersRound(sets) {
    var loserRounds = sets.filter(function (set) { return losersRoundRegex.test(set.getFullRoundText()); });
    var loserRoundNumbers = loserRounds.map(function (set) { return losersRoundRegex.exec(set.getFullRoundText())[1]; });
    var highestLoserRoundNumber = Math.max.apply(null, loserRoundNumbers);
    return "Losers Round " + highestLoserRoundNumber;
}
exports.getHighestLevelLosersRound = getHighestLevelLosersRound;
function filterForTop8Sets(sets) {
    var highestLoserRound = getHighestLevelLosersRound(sets);
    var targetLabels = TOP_8_LABELS.concat([highestLoserRound]);
    var topSets = sets.filter(function (set) { return targetLabels.includes(set.getFullRoundText()); });
    return orderTop8(topSets);
}
exports.filterForTop8Sets = filterForTop8Sets;
function createExpandsString(expands) {
    var expandsString = '';
    for (var property in expands) {
        if (expands.hasOwnProperty(property))
            expandsString += util_1.format('expand[]=%s&', property);
    }
    return expandsString;
}
exports.createExpandsString = createExpandsString;
function convertEpochToDate(epoch) {
    var d = new Date(0);
    d.setUTCSeconds(epoch);
    return d;
}
exports.convertEpochToDate = convertEpochToDate;
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
