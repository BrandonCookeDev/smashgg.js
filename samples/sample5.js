'use strict';
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});

let setToken = require('../lib/util/Initializer');
let Tournament = require('../lib/Tournament');
let token = process.env.API_TOKEN;

(async function(){
	setToken(token);
	let t = await Tournament.getTournament('to12');
	console.log(t.getName());
	console.log(t.getState());
	console.log(t.getCity());
	process.exit(0);
})();