"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var Game = /** @class */ (function () {
    function Game(id, state, winnerId, orderNumber, selections) {
        this.id = id;
        this.state = state;
        this.winnerId = winnerId;
        this.orderNumber = orderNumber;
        this.selections = selections;
    }
    Game.parse = function (data) {
        return new Game(+data.id, data.state, data.winnerId, data.orderNum, Selections.parseArray(data.selections));
    };
    Game.parseFull = function (data) {
        return data.set.games.map(function (gameData) { return Game.parse(gameData); });
    };
    Game.prototype.getId = function () {
        return this.id;
    };
    Game.prototype.getState = function () {
        return this.state;
    };
    Game.prototype.getWinnerId = function () {
        return this.winnerId;
    };
    Game.prototype.getOrderNumber = function () {
        return this.orderNumber;
    };
    Game.prototype.getSelections = function () {
        return this.selections;
    };
    Game.prototype.getSelectionsForEntrantId = function (entrantId) {
        return lodash_1.default.find(this.selections, { entrantId: entrantId });
    };
    return Game;
}());
exports.Game = Game;
var Selections = /** @class */ (function () {
    function Selections(selectionType, selectionValue, entrantId, participantId) {
        this.selectionType = selectionType;
        this.selectionValue = selectionValue;
        this.entrantId = entrantId;
        this.attendeeId = participantId;
    }
    Selections.parse = function (data) {
        return new Selections(data.selectionType, data.selectionValue, data.entrantId, data.participantId);
    };
    Selections.parseArray = function (data) {
        return data.map(function (e) { return Selections.parse(e); });
    };
    Selections.parseFull = function (data) {
        return data.selections.map(function (selectionsData) { return Selections.parse(selectionsData); });
    };
    Selections.prototype.getSelectionType = function () {
        return this.selectionType;
    };
    Selections.prototype.getSelectionValue = function () {
        return this.selectionValue;
    };
    Selections.prototype.getEntrantId = function () {
        return this.entrantId;
    };
    Selections.prototype.getAttendeeId = function () {
        return this.attendeeId;
    };
    return Selections;
}());
exports.Selections = Selections;
