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
var path_1 = __importDefault(require("path"));
var ROOT = path_1.default.join(__dirname, '..', '..', '..', '..', '.env');
var dotenv_1 = require("dotenv");
dotenv_1.config({ path: ROOT });
require("../lib/util/ErrorHandler");
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
var Initializer_1 = __importDefault(require("../lib/util/Initializer"));
var Stream_1 = require("../lib/Stream");
var testData = __importStar(require("./data/stream.testData"));
var stream1, stream2, stream3;
var STREAM_ID_1 = 10493;
var STREAM_ID_2 = 574;
var STREAM_ID_3 = 40210;
describe('smashgg Stream', function () {
    this.timeout(10000);
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Initializer_1.default(process.env.API_TOKEN)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Stream_1.Stream.get(STREAM_ID_1)];
                    case 2:
                        stream1 = _a.sent();
                        return [4 /*yield*/, Stream_1.Stream.get(STREAM_ID_2)];
                    case 3:
                        stream2 = _a.sent();
                        return [4 /*yield*/, Stream_1.Stream.get(STREAM_ID_3)];
                    case 4:
                        stream3 = _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    });
    // id
    it('should get the correct stream id 1', function () {
        expect(stream1.getId()).to.be.equal(testData.stream1.id);
    });
    it('should get the correct stream id 2', function () {
        expect(stream2.getId()).to.be.equal(testData.stream2.id);
    });
    it('should get the correct stream id 3', function () {
        expect(stream3.getId()).to.be.equal(testData.stream3.id);
    });
    // event id
    it('should get the correct stream event id 1', function () {
        expect(stream1.getEventId()).to.be.equal(testData.stream1.eventId);
    });
    it('should get the correct stream event id 2', function () {
        expect(stream2.getEventId()).to.be.equal(testData.stream2.eventId);
    });
    it('should get the correct stream event id 3', function () {
        expect(stream3.getEventId()).to.be.equal(testData.stream3.eventId);
    });
    // tournament id
    it('should get the correct stream tournament id 1', function () {
        expect(stream1.getTournamentId()).to.be.equal(testData.stream1.tournamentId);
    });
    it('should get the correct stream tournament id 2', function () {
        expect(stream2.getTournamentId()).to.be.equal(testData.stream2.tournamentId);
    });
    it('should get the correct stream tournament id 3', function () {
        expect(stream3.getTournamentId()).to.be.equal(testData.stream3.tournamentId);
    });
    // stream name
    it('should get the correct stream name id 1', function () {
        expect(stream1.getStreamName()).to.be.equal(testData.stream1.streamName);
    });
    it('should get the correct stream name id 2', function () {
        expect(stream2.getStreamName()).to.be.equal(testData.stream2.streamName);
    });
    it('should get the correct stream name id 3', function () {
        expect(stream3.getStreamName()).to.be.equal(testData.stream3.streamName);
    });
    // num setups
    it('should get the correct num setups id 1', function () {
        expect(stream1.getNumSetups()).to.be.equal(testData.stream1.numSetups);
    });
    it('should get the correct num setups id 2', function () {
        expect(stream2.getNumSetups()).to.be.equal(testData.stream2.numSetups);
    });
    it('should get the correct num setups id 3', function () {
        expect(stream3.getNumSetups()).to.be.equal(testData.stream3.numSetups);
    });
    // stream source
    it('should get the correct stream source id 1', function () {
        expect(stream1.getStreamSource()).to.be.equal(testData.stream1.streamSource);
    });
    it('should get the correct stream source id 2', function () {
        expect(stream2.getStreamSource()).to.be.equal(testData.stream2.streamSource);
    });
    it('should get the correct stream source id 3', function () {
        expect(stream3.getStreamSource()).to.be.equal(testData.stream3.streamSource);
    });
    // stream type
    it('should get the correct stream type id 1', function () {
        expect(stream1.getStreamType()).to.be.equal(testData.stream1.streamType);
    });
    it('should get the correct stream type id 2', function () {
        expect(stream2.getStreamType()).to.be.equal(testData.stream2.streamType);
    });
    it('should get the correct stream type id 3', function () {
        expect(stream3.getStreamType()).to.be.equal(testData.stream3.streamType);
    });
    // stream type id
    it('should get the correct stream type id id 1', function () {
        expect(stream1.getStreamTypeId()).to.be.equal(testData.stream1.streamTypeId);
    });
    it('should get the correct stream type id id 2', function () {
        expect(stream2.getStreamTypeId()).to.be.equal(testData.stream2.streamTypeId);
    });
    it('should get the correct stream type id id 3', function () {
        expect(stream3.getStreamTypeId()).to.be.equal(testData.stream3.streamTypeId);
    });
    // is online
    it('should get the correct stream is online status id 1', function () {
        expect(stream1.getIsOnline()).to.be.equal(testData.stream1.isOnline);
    });
    it('should get the correct stream is online status id 2', function () {
        expect(stream2.getIsOnline()).to.be.equal(testData.stream2.isOnline);
    });
    it('should get the correct stream is online status id 3', function () {
        expect(stream3.getIsOnline()).to.be.equal(testData.stream3.isOnline);
    });
    // enabled
    it('should get the correct stream enabled id 1', function () {
        expect(stream1.getEnabled()).to.be.equal(testData.stream1.enabled);
    });
    it('should get the correct stream enabled id 2', function () {
        expect(stream2.getEnabled()).to.be.equal(testData.stream2.enabled);
    });
    it('should get the correct stream enabled id 3', function () {
        expect(stream3.getEnabled()).to.be.equal(testData.stream3.enabled);
    });
    // follower count
    it('should get the correct stream follower count id 1', function () {
        expect(stream1.getFollowerCount()).to.be.equal(testData.stream1.followerCount);
    });
    it('should get the correct stream follower count id 2', function () {
        expect(stream2.getFollowerCount()).to.be.equal(testData.stream2.followerCount);
    });
    it('should get the correct stream follower count id 3', function () {
        expect(stream3.getFollowerCount()).to.be.equal(testData.stream3.followerCount);
    });
    // removesTasks
    it('should get the correct stream removes tasks id 1', function () {
        expect(stream1.getRemovesTasks()).to.be.equal(testData.stream1.removesTasks);
    });
    it('should get the correct stream removes tasks id 2', function () {
        expect(stream2.getRemovesTasks()).to.be.equal(testData.stream2.removesTasks);
    });
    it('should get the correct stream removes tasks id 3', function () {
        expect(stream3.getRemovesTasks()).to.be.equal(testData.stream3.removesTasks);
    });
    // stream status
    it('should get the correct stream status id 1', function () {
        expect(stream1.getStreamStatus()).to.be.equal(testData.stream1.streamStatus);
    });
    it('should get the correct stream status id 2', function () {
        expect(stream2.getStreamStatus()).to.be.equal(testData.stream2.streamStatus);
    });
    it('should get the correct stream status id 3', function () {
        expect(stream3.getStreamStatus()).to.be.equal(testData.stream3.streamStatus);
    });
    // stream game
    it('should get the correct stream game id 1', function () {
        expect(stream1.getStreamGame()).to.be.equal(testData.stream1.streamGame);
    });
    it('should get the correct stream game id 2', function () {
        expect(stream2.getStreamGame()).to.be.equal(testData.stream2.streamGame);
    });
    it('should get the correct stream game id 3', function () {
        expect(stream3.getStreamGame()).to.be.equal(testData.stream3.streamGame);
    });
    // stream logo
    it('should get the correct stream logo id 1', function () {
        expect(stream1.getStreamLogo()).to.be.equal(testData.stream1.streamLogo);
    });
    it('should get the correct stream logo id 2', function () {
        expect(stream2.getStreamLogo()).to.be.equal(testData.stream2.streamLogo);
    });
    it('should get the correct stream logo id 3', function () {
        expect(stream3.getStreamLogo()).to.be.equal(testData.stream3.streamLogo);
    });
});
