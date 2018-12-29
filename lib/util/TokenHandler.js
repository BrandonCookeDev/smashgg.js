'use strict';
//22fa9bbc414976f05fa9f4b7eb253b6b
let tokenRegex = new RegExp(/[a-z0-9]{32}/);

class TokenHandler{

	static setToken(token){
		if(!tokenRegex.test(token))
			throw new Error('Incorrect token format. Must be 32 alphanumeric, lowercase characters');
		TokenHandler.token = token;
	}

	static getToken(){
		return TokenHandler.token;
	}
	
}

module.exports = TokenHandler;