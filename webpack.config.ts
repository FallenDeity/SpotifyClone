const path = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "main.js",
	},
	resolve: {
		extensions: [".ts"],
	},
	stats: {
		errorDetails: true,
	},
	module: {
		rules: [
			{
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};
