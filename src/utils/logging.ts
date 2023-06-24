import process from "node:process";

import * as fs from "fs";
import * as path from "path";
import * as winston from "winston";

export class Logger {
	public logger: winston.Logger;
	constructor(private readonly name: string, private readonly _dirname: string = path.join(process.cwd(), "logs")) {
		fs.mkdirSync(this._dirname, { recursive: true });
		const date = new Date();
		const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		this.logger = winston.createLogger({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.label({ label: `${path.relative(process.cwd(), __filename)} ${this.name}` }),
				winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				winston.format.printf((info) => `${info.timestamp} ${info.label} ${info.level}: ${info.message}`)
			),
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({
					filename: `${this._dirname}/${dateString}.log`,
				}),
			],
		});
		module.exports = this.logger;
	}

	public info(message: string): void {
		this.logger.info(message);
	}
}
