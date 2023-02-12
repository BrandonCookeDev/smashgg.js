import winston from 'winston'

const startggJsLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		verbose: 3,
		debug: 4,
		queries: 5
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		verbose: 'blue',
		debug: 'magenta',
		queries: 'cyan'
	}
}

const tempLogger = winston.createLogger({
	level: 'info',
	levels: startggJsLevels.levels,
	format: winston.format.combine(
		winston.format.splat(),
		winston.format.simple(),
		winston.format.colorize()
	),
	transports: [
		new winston.transports.Console()
	]
})

const logQuery = (msg: string): void => {
	tempLogger.log('queries', msg)
}

const logger = Object.assign(tempLogger, { queries: logQuery })

export default logger

winston.addColors(startggJsLevels.colors)

export function setLogLevel(level: string): void {
	logger.level = level
}

export function addLog(type: string, options: winston.LoggerOptions): void {
	switch (type.toLowerCase()) {
		case 'console':
			logger.add(new winston.transports.Console(options))
			break
		case 'file':
			logger.add(new winston.transports.File(options))
			break
		default:
			throw new Error(`${type} is not valid for addLog. Valid values: [console, file]`)
	}
}

export function disableLog() {
	logger.transports.forEach(transport => {
		transport.silent = true
	})
}

export function enableLog() {
	logger.transports.forEach(transport => {
		transport.silent = false
	})
}

export const levels = {
	QUERIES: 'queries',
	DEBUG: 'debug',
	VERBOSE: 'verbose',
	INFO: 'info',
	WARN: 'warn',
	ERROR: 'error'
}
