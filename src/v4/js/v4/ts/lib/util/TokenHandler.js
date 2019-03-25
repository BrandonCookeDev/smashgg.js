"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenRegex = new RegExp(/[a-f0-9]{32}/);
var TokenHandler = /** @class */ (function () {
    function TokenHandler() {
    }
    TokenHandler.setToken = function (token) {
        if (!tokenRegex.test(token))
            throw new Error("Invalid token '" + token + "'. Must be 32 lowercase, hexidecimal characters.");
        TokenHandler.token = token;
    };
    TokenHandler.getToken = function () {
        return TokenHandler.token;
    };
    return TokenHandler;
}());
exports.default = TokenHandler;
module.exports = TokenHandler;
