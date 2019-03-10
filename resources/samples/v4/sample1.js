/* eslint-disable */
'use strict';
let p = {path: require('path').join(__dirname, '..', '..', '..', '.env')};
require('dotenv').config(p);
const chalk = require('chalk');
let smashgg = require('../../..');
let Event = smashgg.Event;

smashgg.initialize(process.env.API_TOKEN);
(async function(){
	try{
		let e = await Event.get('21xx-cameron-s-birthday-bash-1', 'melee-singles');
		let sets = await e.getSets();
		let incomplete = await e.getIncompleteSets();
		let complete = await e.getCompleteSets();
		
		console.log('Sets for ' + chalk.keyword('orange')(e.getName()));
		console.log('==========================================');
        console.log('COMPLETE: %s | INCOMPLETE: %s | TOTAL: %s', 
            chalk.green(complete.length), 
            chalk.red(incomplete.length), 
            chalk.blue(sets.length));
		console.log('==========================================');
		console.log(chalk.yellow('In Progress:'));
		incomplete.forEach(set => {
			console.log('%s: %s %s v %s %s', 
				chalk.magenta(set.getFullRoundText()), 
				chalk.green(set.getPlayer1Tag()), 
				chalk.blue(set.getPlayer1Score()), 
				chalk.blue(set.getPlayer2Score()), 
				chalk.green(set.getPlayer2Tag()));
		});

		console.log(chalk.green('\nCompleted: '))
		complete.forEach(set => {
			console.log('%s: %s %s v %s %s', 
				chalk.magenta(set.getFullRoundText()), 
				chalk.green(set.getPlayer1Tag()), 
				chalk.blue(set.getPlayer1Score()), 
				chalk.blue(set.getPlayer2Score()), 
				chalk.green(set.getPlayer2Tag()));
		});
		
		return true;
	} catch(e){
		console.error(e);
		process.exit(1);
	}
})();
