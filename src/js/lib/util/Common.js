"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Encoder_1 = __importDefault(require("./Encoder"));
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
function parseOptions(options) {
    return {
        isCached: options.isCached != undefined ? options.isCached === true : true,
        concurrency: options.concurrency || DEFAULT_CONCURRENCY,
        rawEncoding: Encoder_1.default.determineEncoding(options.rawEncoding)
    };
}
exports.parseOptions = parseOptions;
function getHighestLevelLosersRound(sets) {
    var regex = new RegExp(/Losers Round ([0-9])/);
    var loserRounds = sets.filter(function (set) { return regex.test(set.getRound()); });
    var loserRoundNumbers = loserRounds.map(function (set) { return regex.exec(set.getRound())[1]; });
    var highestLoserRoundNumber = Math.max.apply(null, loserRoundNumbers);
    return "Losers Round " + highestLoserRoundNumber;
}
exports.getHighestLevelLosersRound = getHighestLevelLosersRound;
function filterForTop8Sets(sets) {
    var highestLoserRound = getHighestLevelLosersRound(sets);
    var targetLabels = TOP_8_LABELS.concat([highestLoserRound]);
    var topSets = sets.filter(function (set) { return targetLabels.includes(set.getRound()); });
    return topSets;
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
