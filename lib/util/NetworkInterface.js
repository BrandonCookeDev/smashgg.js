'use strict';

let TokenHandler = require('./TokenHandler');
let { GraphQLClient } = require('graphql-request');
let Common = require('./Common');

const API_URL = process.env.ApiUrl || 'https://insiders-gcp-api.smashgg.com/gql/alpha';
const RATE_LIMIT_MS_TIME = process.env.RateLimitMsTime || 1000;

class NetworkInterface{

	static init(){
        NetworkInterface.client = new GraphQLClient(API_URL, NetworkInterface.getHeaders());
		NetworkInterface.initialized = true;
	}

	static getHeaders(){
		let token = TokenHandler.getToken();
		if(!token) throw new Error('Cannot initialize without a token for smash.gg');
		
		return { 
			headers:{
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		};
	}

	static async query(query, variables){
        await Common.sleep(RATE_LIMIT_MS_TIME);
        return await NetworkInterface.client.request(query, variables);
	}

}

module.exports = NetworkInterface;