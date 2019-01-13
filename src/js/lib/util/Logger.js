"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var winston_1 = __importDefault(require("winston"));
var logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.prettyPrint(),
    transports: [
        new winston_1.default.transports.Console()
    ]
});
module.exports = logger;
