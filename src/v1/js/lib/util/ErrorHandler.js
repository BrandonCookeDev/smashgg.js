"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
function errHandle(e) {
    console.error(e.message.red);
    console.error(e);
}
process.on('error', errHandle);
process.on('unhandledRejection', errHandle);
process.on('uncaughtException', errHandle);
