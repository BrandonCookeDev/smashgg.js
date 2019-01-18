import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports:[
    new winston.transports.Console()
  ]
})
export default logger

export function setLogLevel(level: string) : void{
  logger.level = level
}

export function addLog(type: string, options: winston.LoggerOptions): void{
  switch(type.toLowerCase()){
    case 'console':
      logger.add(new winston.transports.Console(options))
      break;
    case 'file':
      logger.add(new winston.transports.File(options))
      break;
    default: 
      throw new Error(`${type} is not valid for addLog. Valid values: [console, file]`);
  }
}