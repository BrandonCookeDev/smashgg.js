/* eslint-disable */
'use strict';
let p = {path: require('path').join(__dirname, '..', '..', '..', '.env')};
require('dotenv').config(p);

Promise = require('bluebird')

let _	   = require('lodash');
let smashgg = require('../../..')
let Event   = smashgg.Event;

smashgg.initialize(process.env.API_TOKEN);
(async function(){
	try{
		let event = await Event.get('function-1-recursion-regional', 'melee-singles');
		let phaseGroups = await event.getPhaseGroups();

		let players = await Promise.all(
			phaseGroups.map(async (pg) => { return await pg.getEntrants(); }))
		
		players = _.flatten(players)
		console.log(`${players.length} participated in the event ${event.name}`)
		console.log('All participants for this event: \n')
		players.forEach(player => {
			console.log(player)
		})

		process.exit(0)
	} catch(e){
		console.error(e)
		process.exit(1)
	}
})()