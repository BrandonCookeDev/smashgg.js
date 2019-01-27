/* eslint-disable */
'use strict';

const chalk = require('chalk');
let smashgg = require('../..')
let Event = smashgg.Event;

(async function(){
	try{
		let e = await Event.getEvent('melee-singles', '21xx-cameron-s-birthday-bash-1', {rawEncoding: 'base64'});
		let sets = await e.getSets();
		let incomplete = await e.getIncompleteSets();
		let complete = await e.getCompleteSets();
		
		console.log('Sets for ' + chalk.keyword('orange')(e.getTournamentName()));
		console.log('==========================================');
		console.log('COMPLETE: %s | INCOMPLETE: %s | TOTAL: %s', chalk.green(complete.length), chalk.red(incomplete.length), chalk.blue(sets.length));
		console.log('==========================================');
		console.log(chalk.yellow('In Progress:'));
		incomplete.forEach(set => {
			console.log('%s: %s %s v %s %s', 
				chalk.magenta(set.getRound()), 
				chalk.green(set.getPlayer1().getTag()), 
				chalk.blue(set.getPlayer1Score()), 
				chalk.blue(set.getPlayer2Score()), 
				chalk.green(set.getPlayer2().getTag()));
		});

		console.log(chalk.green('\nCompleted: '))
		complete.forEach(set => {
			console.log('%s: %s %s v %s %s', 
				chalk.magenta(set.getRound()), 
				chalk.green(set.getPlayer1().getTag()), 
				chalk.blue(set.getPlayer1Score()), 
				chalk.blue(set.getPlayer2Score()), 
				chalk.green(set.getPlayer2().getTag()));
		});
		
		return true;
	} catch(e){
		console.error(e);
		process.exit(1);
	}
})();
