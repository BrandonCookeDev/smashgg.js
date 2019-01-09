import winston from 'winston'

let logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
    ]
});

exports = logger;