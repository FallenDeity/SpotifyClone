import * as winston from "winston";
export declare class Logger {
    private readonly name;
    private readonly _dirname;
    logger: winston.Logger;
    constructor(name: string, _dirname?: string);
    info(message: string): void;
}
