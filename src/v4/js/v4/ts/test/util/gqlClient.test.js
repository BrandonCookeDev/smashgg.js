'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var GQLClient_1 = __importDefault(require("../../lib/util/GQLClient"));
var TokenHandler_1 = __importDefault(require("../../lib/util/TokenHandler"));
var API_URL = 'https://api.smash.gg/gql/alpha';
var API_TOKEN = '52292a2848052df2834aad11156f66ee6';
var HEADERS = {
    headers: {
        'X-Source': 'smashgg.js',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + API_TOKEN
    }
};
describe('smashgg GQL Client', function () {
    before(function () {
        TokenHandler_1.default.setToken(API_TOKEN);
    });
    it('should return the correct API url', function () {
        chai_1.expect(GQLClient_1.default.getApiUrl()).to.be.equal(API_URL);
    });
    it('should generate the correct headers w/ API Token', function () {
        chai_1.expect(GQLClient_1.default.getHeaders()).to.deep.equal(HEADERS);
    });
});
