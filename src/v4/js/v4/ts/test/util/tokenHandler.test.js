"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../lib/util/TokenHandler");
var chai_1 = require("chai");
var TokenHandler_1 = __importDefault(require("../../lib/util/TokenHandler"));
var BAD_TOKEN_1 = 'THISISAVERYBADTOKEN';
var BAD_TOKEN_2 = '68x91e2848052ed278a3d88656f66ff6';
var BAD_TOKEN_3 = '68x91e2848052ed278a3d88656f66ff6THISTOKENISTOOLONG';
var GOOD_TOKEN = '52292a2848052df2834aad11156f66ee6';
describe('smashgg Token Handler', function () {
    it('should deny a key shorter than 32 characters', function () {
        chai_1.expect(TokenHandler_1.default.setToken(BAD_TOKEN_1)).to.throw(Error);
    });
    it('should deny a key that\'s too long', function () {
        chai_1.expect(TokenHandler_1.default.setToken(BAD_TOKEN_2)).to.throw(Error);
    });
    it('should deny a key that is not hexidecimal', function () {
        chai_1.expect(TokenHandler_1.default.setToken(BAD_TOKEN_3)).to.throw(Error);
    });
    it('should accept a legitimate 32 character hexidecimal token', function () {
        chai_1.expect(TokenHandler_1.default.setToken(GOOD_TOKEN)).to.not.throw(Error);
    });
});
