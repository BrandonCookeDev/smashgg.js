"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var logger = new (winston_1.default.Logger)({
    transports: [
        new (winston_1.default.transports.Console)(),
    ]
});
exports = logger;
