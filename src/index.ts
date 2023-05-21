export class Logger {
	constructor(private readonly name: string) {}

	log(message: string): void {
		console.log(`[${this.name}] ${message}`);
	}
}

const logger: Logger = new Logger("MyLogger");
logger.log("Hello World!");
