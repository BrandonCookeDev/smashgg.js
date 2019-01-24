exports.GGSet		= require('./src/js/lib/internal').GGSet;
exports.Event	   	= require('./src/js/lib/internal').Event;
exports.Phase	   	= require('./src/js/lib/internal').Phase;
exports.Player	  	= require('./src/js/lib/internal').Player;
exports.Tournament  = require('./src/js/lib/internal').Tournament;
exports.PhaseGroup  = require('./src/js/lib/internal').PhaseGroup;
exports.VideoGame	= require('./src/js/lib/internal').VideoGame;
exports.Character 	= require('./src/js/lib/Character').Character;

exports.Log         = require('./src/js/lib/util/Logger').default;
exports.setLogLevel = require('./src/js/lib/util/Logger').setLogLevel;
exports.addLog      = require('./src/js/lib/util/Logger').addLog;
exports.disableLog  = require('./src/js/lib/util/Logger').disableLog;
exports.enableLog	= require('./src/js/lib/util/Logger').enableLog;