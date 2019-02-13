"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __importDefault(require("./util/Logger"));
var NetworkInterface_1 = __importDefault(require("./util/NetworkInterface"));
var queries = __importStar(require("./scripts/streamQueries"));
var Stream = /** @class */ (function () {
    function Stream(id, eventId, tournamentId, streamName, numSetups, streamSource, streamType, streamTypeId, isOnline, enabled, followerCount, removesTask, streamStatus, streamGame, streamLogo) {
        this.id = id;
        this.eventId = eventId;
        this.tournamentId = tournamentId;
        this.streamName = streamName;
        this.numSetups = numSetups;
        this.streamSource = streamSource;
        this.streamType = streamType;
        this.streamTypeId = streamTypeId;
        this.isOnline = isOnline;
        this.enabled = enabled;
        this.followerCount = followerCount;
        this.removesTasks = removesTask;
        this.streamStatus = streamStatus;
        this.streamGame = streamGame;
        this.streamLogo = streamLogo;
    }
    Stream.parse = function (data) {
        return new Stream(data.id, data.eventId, data.tournamentId, data.streamName, data.numSetups, data.streamSource, data.streamType, data.streamTypeId, data.isOnline, data.enabled, data.followerCount, data.removesTask, data.streamStatus, data.streamGame, data.streamLogo);
    };
    Stream.parseFull = function (data) {
        return Stream.parse(data.stream);
    };
    Stream.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info('Getting Stream with Id %s', id);
                        return [4 /*yield*/, NetworkInterface_1.default.query(queries.stream, { id: id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Stream.parseFull(data)];
                }
            });
        });
    };
    Stream.prototype.getId = function () {
        return this.id;
    };
    Stream.prototype.getEventId = function () {
        return this.eventId;
    };
    Stream.prototype.getTournamentId = function () {
        return this.tournamentId;
    };
    Stream.prototype.getStreamName = function () {
        return this.streamName;
    };
    Stream.prototype.getNumSetups = function () {
        return this.numSetups;
    };
    Stream.prototype.getStreamSource = function () {
        return this.streamSource;
    };
    Stream.prototype.getStreamType = function () {
        return this.streamType;
    };
    Stream.prototype.getStreamTypeId = function () {
        return this.streamTypeId;
    };
    Stream.prototype.getIsOnline = function () {
        return this.isOnline;
    };
    Stream.prototype.getEnabled = function () {
        return this.enabled;
    };
    Stream.prototype.getFollowerCount = function () {
        return this.followerCount;
    };
    Stream.prototype.getRemovesTasks = function () {
        return this.removesTasks;
    };
    Stream.prototype.getStreamStatus = function () {
        return this.streamStatus;
    };
    Stream.prototype.getStreamGame = function () {
        return this.streamGame;
    };
    Stream.prototype.getStreamLogo = function () {
        return this.streamLogo;
    };
    return Stream;
}());
exports.Stream = Stream;
