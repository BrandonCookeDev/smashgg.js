'use strict';

let TokenHandler = require('./TokenHandler');
let { GraphQLClient } = require('graphql-request');

const API_URL = '';

class NetworkInterface{

    static init(){
        if(!NetworkInterface.initialized){
            NetworkInterface.client = new GraphQLClient(API_URL, NetworkInterface.getHeaders());
            NetworkInterface.initialized = true;
        }
    }

    static getHeaders(){
        let token = TokenHandler.getToken();
        if(!token) throw new Error('Cannot initialize without a token for smash.gg');
        
        return { 
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    }

    static async query(query, variables){
        return await NetworkInterface.client(query, variables);
    }

}

module.exports = NetworkInterface;