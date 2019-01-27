"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var Cache_1 = __importDefault(require("./Cache"));
var TokenHandler_1 = __importDefault(require("./TokenHandler"));
var NetworkInterface_1 = __importDefault(require("./NetworkInterface"));
var StaggeredRequestQueue_1 = __importDefault(require("./StaggeredRequestQueue"));
var winston_1 = __importDefault(require("winston"));
function handleErrors(e) {
    console.error(e.message.red);
    console.error('NOTE: Check your debug log for stack trace'.grey);
    winston_1.default.debug(e);
}
module.exports = function (token) {
    //process.on('error', handleErrors)
    process.on('error', handleErrors);
    process.on('unhandledRejection', handleErrors);
    process.on('uncaughtException', handleErrors);
    TokenHandler_1.default.setToken(token);
    Cache_1.default.init();
    NetworkInterface_1.default.init();
    StaggeredRequestQueue_1.default.init();
};
