
import { GraphQLClient } from 'graphql-request'
import TokenHandler from './TokenHandler'

const API_URL = process.env.ApiUrl || 'https://api.smash.gg/gql/alpha'

export default class GQLClient{

	static instance: GraphQLClient

	static getApiUrl(){
		return API_URL
	}

	static getHeaders(){
		let token = TokenHandler.getToken()
		if(!token) throw new Error('Cannot initialize without a token for smash.gg')
		
		return { 
			headers:{
				'X-Source': 'smashgg.js',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		}
	}

	static getInstance(){
		if(!GQLClient.instance){
			GQLClient.instance = new GraphQLClient(API_URL, GQLClient.getHeaders())
		}
		return GQLClient.instance;
	}

}