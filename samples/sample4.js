'use strict';
require('colors')

const smashgg = require('..');
const {Event} = smashgg;

(async function(){
	try{
		let function1 = await Event.getEvent('melee-singles', 'function-1-recursion-regional');
		let function1Top8 = await function1.getTop8Sets();

		console.log('Function 1 Top 8!'.cyan);
		function1Top8.forEach(set => {
			console.log('============='.gray);
			console.log(set.getRound());
			console.log(`${set.getWinner().getTag().blue} ${set.getWinnerScore().toString().green} - ${set.getLoserScore().toString().red} ${set.getLoser().getTag().blue}`)
			console.log('============='.gray);
		})
	} catch(e){
		console.error(e);
		process.exit(1);
	}
})()