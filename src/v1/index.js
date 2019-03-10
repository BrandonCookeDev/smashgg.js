const internal = require('./js/lib/internal');
exports.Tournament  = internal.Tournament;
exports.Event       = internal.Event;
exports.Phase       = internal.Phase;
exports.PhaseGroup  = internal.PhaseGroup;
exports.GGSet       = internal.GGSet;
exports.VideoGame   = require('./js/lib/VideoGame');
exports.Character   = require('./js/lib/Character');
exports.Player      = require('./js/lib/Player');

exports.Log         = require('./js/lib/util/Logger').default
exports.setLogLevel = require('./js/lib/util/Logger').setLogLevel
exports.addLog      = require('./js/lib/util/Logger').addLog
exports.disableLog  = require('./js/lib/util/Logger').disableLog
exports.enableLog	= require('./js/lib/util/Logger').enableLog
