import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.prettyPrint(),
  transports:[
    new winston.transports.Console()
  ]
})

export = logger;