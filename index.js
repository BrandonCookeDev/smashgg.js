exports.initialize  = require('./src/v4/js/lib/util/Initializer').default;

exports.GGSet		= require('./src/v4/js/lib/GGSet').GGSet
exports.Event	   	= require('./src/v4/js/lib/Event').Event
exports.Phase	   	= require('./src/v4/js/lib/Phase').Phase
exports.Player	  	= require('./src/v4/js/lib/Entrant').Entrant
exports.Tournament  = require('./src/v4/js/lib/Tournament').Tournament
exports.PhaseGroup  = require('./src/v4/js/lib/PhaseGroup').PhaseGroup
exports.VideoGame	= require('./src/v4/js/lib/VideoGame').VideoGame
exports.Character 	= require('./src/v4/js/lib/Character').Character

exports.Log         = require('./src/v4/js/lib/util/Logger').default
exports.setLogLevel = require('./src/v4/js/lib/util/Logger').setLogLevel
exports.addLog      = require('./src/v4/js/lib/util/Logger').addLog
exports.disableLog  = require('./src/v4/js/lib/util/Logger').disableLog
exports.enableLog	= require('./src/v4/js/lib/util/Logger').enableLog
