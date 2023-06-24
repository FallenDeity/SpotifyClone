import "mocha";

import * as assert from "assert";

import { Logger } from "../src/utils/logging";

describe("index", (): void => {
	it("should say 'Hello, world!'", (): void => {
		const logger: Logger = new Logger("MyLogger");
		logger.info("Hello, world!");
		assert.ok(true);
	});
});
