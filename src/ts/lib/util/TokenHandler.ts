const tokenRegex = new RegExp(/[a-z0-9]{32}/)

export default class TokenHandler implements ITokenHandler.TokenHandler{

	static token: string

	static setToken(token: string) : void{
		if(!tokenRegex.test(token))
			throw new Error('Incorrect token format. Must be 32 alphanumeric, lowercase characters')
		TokenHandler.token = token
	}

	static getToken() : string{
		return TokenHandler.token
	}
	
}

namespace ITokenHandler{
	export interface TokenHandler{

	}
}

module.exports = TokenHandler
