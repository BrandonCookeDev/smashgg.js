
import { GraphQLClient } from 'graphql-request'
import TokenHandler from './TokenHandler'

const API_URL = process.env.ApiUrl ?? 'https://api.smash.gg/gql/alpha'

export default class GQLClient{

	public static instance: GraphQLClient

	public static getApiUrl(){
		return API_URL
	}

	public static getHeaders(){
		const token = TokenHandler.getToken()
		if(!token) throw new Error('Cannot initialize without a token for smash.gg')
		
		return { 
			headers:{
				'X-Source': 'startgg.js',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		}
	}

	public static getInstance(){
		if(!GQLClient.instance){
			GQLClient.instance = new GraphQLClient(API_URL, GQLClient.getHeaders())
		}
		return GQLClient.instance
	}

}
