module.exports = {
	mode: "jit",
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false,
	theme: {
		extend: {
			width: {
				"avatar-sm-w": "9.375rem",
				"container-sm": "22.75rem"
			},
			maxWidth: {
				'tablet-max-w': '90%',
				'mobile-max-w': '95%',
				'desktop-max-w': '1300px'
			},
			colors: {
				lightBlue: "hsl(182, 100%, 88%)",
				lightGreen: "hsl(130, 100%, 88%)",
				gunMetal: "hsl(192, 15%, 18%)",
				blackCoral: "hsl(205, 13%, 37%);",
				btnGradientTop: "hsl(192, 8%, 32%);",
				btnGradientBott: "hsl(192, 8%, 28%);",
				whiteText1: "#EFF2FA",
				purpleGradientStart: "#DFA4D9",
				purpleGradientMid: "#BBABE7",
				purpleGradientEnd: "#ABB8FF",
				containerGray: "#606368",
				darkLabel: "#414549",
				headerBottom: "hsl(203, 13%, 25%);",
				headerTop: "hsl(203, 13%, 40%);",
				logoutBtnBottomColor:"hsl(0, 0%, 20%);",
				logoutBtnTopColor:"hsl(0, 0%, 32%);"
			},
			fontFamily: {
				sans: ["Inter", "Poppins", "Roboto"],
			},
			animation: {},
			keyframes: {
				"lds-ellipsis1": {
					"0%": {
						transform: "scale(0)",
					},
					"100%": {
						transform: "scale(1)",
					},
				},
				"lds-ellipsis2": {
					"0%": {
						transform: "translate(0, 0)",
					},
					"100%": {
						transform: "translate(24px, 0)",
					},
				},
				"lds-ellipsis3": {
					"0%": {
						transform: "scale(1)",
					},
					"100%": {
						transform: "scale(0)",
					},
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
