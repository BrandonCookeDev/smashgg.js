const tokenRegex = new RegExp(/[a-f0-9]{32}/)

export default class TokenHandler {

	public static token: string

	public static setToken(token: string): void{
		if(!tokenRegex.test(token))
			throw new Error(`Invalid token '${token}'. Must be 32 lowercase, hexidecimal characters.`)
		TokenHandler.token = token
	}

	public static getToken(): string{
		return TokenHandler.token
	}
	
}
