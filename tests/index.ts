import "mocha";

import * as assert from "assert";

import { Logger } from "../src";

describe("index", () => {
	it("should say 'Hello, world!'", () => {
		const logger: Logger = new Logger("MyLogger");
		logger.log("Hello, world!");
		assert.ok(true);
	});
});
