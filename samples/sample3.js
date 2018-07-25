'use strict';

let _ = require('lodash');
let Tournament = require('../lib/Tournament');
let winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	level: 'verbose',
	colorize: true,
	timestamp: true,
	json: false
});

(async function(){
	try{
		let t = await Tournament.getTournament('21xx-cameron-s-birthday-bash-1', {rawEncoding: 'base64'});
		let sets = await t.getAllSets();		
		let incomplete = sets.filter(set => { return set.isComplete == false; });
		incomplete.forEach(set => { console.log(set); });
		return true;
	} catch(e){
		console.error(e);
		process.exit(1);
	}
})();