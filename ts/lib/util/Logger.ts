import * as winston from 'winston'

var logger: winston = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
    ]
});

module.exports = logger;