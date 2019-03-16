"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_request_1 = require("graphql-request");
var TokenHandler_1 = __importDefault(require("./TokenHandler"));
var API_URL = process.env.ApiUrl || 'https://api.smash.gg/gql/alpha';
var GQLClient = /** @class */ (function () {
    function GQLClient() {
    }
    GQLClient.getApiUrl = function () {
        return API_URL;
    };
    GQLClient.getHeaders = function () {
        var token = TokenHandler_1.default.getToken();
        if (!token)
            throw new Error('Cannot initialize without a token for smash.gg');
        return {
            headers: {
                'X-Source': 'smashgg.js',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        };
    };
    GQLClient.getInstance = function () {
        if (!GQLClient.instance) {
            GQLClient.instance = new graphql_request_1.GraphQLClient(API_URL, GQLClient.getHeaders());
        }
        return GQLClient.instance;
    };
    return GQLClient;
}());
exports.default = GQLClient;
