'use strict';
require('colors');

let Cache = require('./Cache');
let TokenHandler = require('./TokenHandler');
let NI = require('./NetworkInterface');
let log = require('winston');

function handleErrors(e){
	console.error(e.message.red);
	console.error('NOTE: Check your debug log for stack trace'.grey);
	log.debug(e);
}

module.exports = function(token){
	process.on('SIGINT', handleErrors);
	process.on('error', handleErrors);
	process.on('unhandledRejection', handleErrors);
	process.on('uncaughtException', handleErrors);

	TokenHandler.setToken(token);
	Cache.init();
	NI.init();

};