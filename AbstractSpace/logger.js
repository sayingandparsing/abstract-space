const winston = require('winston')

class Logger {

	log

	constructor() {
		console.log('creating logger')
		this.log = winston.createLogger({
			level: 'debug',
			format: winston.format.json(),
			transports: [
			  // - Write to all logs with level `info` and below to `combined.log`
			  // - Write all logs error (and below) to `error.log`
			  new winston.transports.File({ filename: 'error.log', level: 'error' }),
			  new winston.transports.File({
				  filename: 'combined.log',
				  prettyPrint: JSON.stringify
				}),
			  new winston.transports.Console({
				name: 'debug-console',
				level: 'debug',
				prettyPrint: true,
				handleExceptions: true,
				json: false,
				colorize: true
    })
			]
		});
	}
}
export const log = new Logger().log
