"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.splat(), winston_1.default.format.simple()),
    transports: [
        new winston_1.default.transports.Console()
    ]
});
exports.default = logger;
function setLogLevel(level) {
    logger.level = level;
}
exports.setLogLevel = setLogLevel;
function addLog(type, options) {
    switch (type.toLowerCase()) {
        case 'console':
            logger.add(new winston_1.default.transports.Console(options));
            break;
        case 'file':
            logger.add(new winston_1.default.transports.File(options));
            break;
        default:
            throw new Error(type + " is not valid for addLog. Valid values: [console, file]");
    }
}
exports.addLog = addLog;
function disableLog() {
    logger.transports.forEach(function (transport) {
        transport.silent = true;
    });
}
exports.disableLog = disableLog;
function enableLog() {
    logger.transports.forEach(function (transport) {
        transport.silent = false;
    });
}
exports.enableLog = enableLog;
