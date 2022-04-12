module.exports = {
	mode: "jit",
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				lightBlue: "hsl(182, 100%, 88%)",
				lightGreen: "hsl(130, 100%, 88%)",
				gunMetal: "hsl(192, 15%, 18%)",
				blackCoral: "hsl(205, 13%, 37%);"
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
