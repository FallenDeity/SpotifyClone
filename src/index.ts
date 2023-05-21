import path from "path";

export class Logger {
	constructor(private readonly name: string) {}

	log(message: string): void {
		console.log(`[${new Date().toISOString()}] ${this.name}: ${message}`);
	}
}

const filePath: string = path.relative(process.cwd(), __filename);
const logger: Logger = new Logger(filePath);
logger.log("Hello, world!");
