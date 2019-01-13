'use strict';

const chalk = require('chalk');

let smashgg = require('../index')
let Tournament = smashgg.Tournament
let Event = smashgg.Event;

(async function(){
	try{
		let t = await Tournament.getTournament('21xx-cameron-s-birthday-bash-1', {rawEncoding: 'base64'});
		let sets = await t.getAllSets();		
		let i1 = await t.getIncompleteSets();
		let c1 = await t.getCompleteSets();	
		console.log('%s :: %s', i1.length, c1.length);

		let e = await Event.getEvent('melee-singles', '21xx-cameron-s-birthday-bash-1', {rawEncoding: 'base64'});
		let incomplete = await e.getIncompleteSets();
		let complete = await e.getCompleteSets();
		
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