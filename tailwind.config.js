/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
	theme: {
		extend: {},
	},
	plugins: [require("tailwind-scrollbar"), require("tailwind-scrollbar-hide"), require("@tailwindcss/line-clamp")],
};
