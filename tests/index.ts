import "mocha";
import * as assert from "assert";
import { Logger } from "../src";

describe("index", () => {
	it("should say 'Hello, world!'", () => {
		Logger.log("Hello, world!");
		assert.ok(true);
	});
});
