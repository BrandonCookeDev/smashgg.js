'use strict';


class TokenHandler{

    static setToken(token){
        TokenHandler.token = token;
    }

    static getToken(){
        return TokenHandler.token;
    }
    
}

module.exports = TokenHandler;