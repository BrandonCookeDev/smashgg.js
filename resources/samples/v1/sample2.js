/* eslint-disable */
'use strict';

Promise = require('bluebird')

let _	   = require('lodash');
let smashgg = require('../../../src/v1')
let Event   = smashgg.Event;

(async function(){
	try{
		let event = await Event.getEvent('melee-singles', 'ceo-2016');
		let phaseGroups = await event.getEventPhaseGroups();

		let players = await Promise.all(
			phaseGroups.map(async (pg) => { return await pg.getPlayers(); }))
		
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