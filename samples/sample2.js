'use strict';

Promise = require('bluebird');

let _	   = require('lodash');
let Event   = require('../lib/Event');

(async function(){
	try{
		let event = await Event.getEvent('ceo-2016', 'melee-singles');
		let phaseGroups = await event.getEventPhaseGroups();

		let players = await Promise.all(
			phaseGroups.map(async (pg) => { return await pg.getPlayers(); }));
		
		players = _.flatten(players);
		console.log(`${players.length} participated in the event ${event.name}`);
		console.log('All participants for this event: \n');
		players.forEach(player => {
			console.log(player);
		});

		process.exit(0);
	} catch(e){
		console.error(e);
		process.exit(1);
	}
})();