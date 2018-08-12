import * as winston from 'winston'

class Logger {

	log :winston.Logger

	constructor() {
		this.log = winston.createLogger({
			level: 'debug',
			format: winston.format.combine(
				winston.format.prettyPrint(),
				winston.format.simple()
			),
			transports: [
			  // - Write to all logs with level `info` and below to `combined.log`
			  // - Write all logs error (and below) to `error.log`
			  new winston.transports.File({ filename: 'error.log', level: 'error' }),
			  new winston.transports.File({ filename: 'combined.log', level: 'debug' }),
			  new winston.transports.Console({format: winston.format.simple()})
			]
		});
	}
}

export const log = new Logger().log
