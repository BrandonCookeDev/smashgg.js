"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game(id, state, winnerId, orderNumber, selections) {
        this.id = id;
        this.state = state;
        this.winnerId = winnerId;
        this.orderNumber = orderNumber;
        this.selections = selections;
    }
    Game.parse = function (data) {
        return new Game(+data.id, data.state, data.winnerId, data.orderNum, data.selections);
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
    return Game;
}());
exports.Game = Game;
