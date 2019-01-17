'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
var DEFAULT_ENCODING = 'json';
var Encoder = /** @class */ (function () {
    function Encoder() {
    }
    Encoder.determineEncoding = function (encoding) {
        return encoding != undefined && LEGAL_ENCODINGS.includes(encoding) ? encoding : DEFAULT_ENCODING;
    };
    Encoder.loadData = function (data, encoding) {
        if (encoding === void 0) { encoding = DEFAULT_ENCODING; }
        var encoded = encoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(encoding);
        return encoded;
    };
    Encoder.getData = function (data, encoding) {
        if (encoding === void 0) { encoding = DEFAULT_ENCODING; }
        var decoded = encoding == 'json' ? data : JSON.parse(new Buffer(data.toString(), encoding).toString('utf8'));
        return decoded;
    };
    return Encoder;
}());
exports.default = Encoder;
