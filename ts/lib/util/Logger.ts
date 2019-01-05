import * as winston from 'winston'

var logger: winston.Logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
    ]
});

exports = logger;