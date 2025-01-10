const { blackA, mauve, violet } = require("@radix-ui/colors");
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			height: {
				"screen/2": "50vh",
				"screen/3": "33.333333vh",
				"screen/4": "25vh",
				"9/10": "90%",
				"9.5/10": "95%",
				"9.55/10": "95.5%",
				"9.6/10": "96%",
				graph: "50%",
				health: "53%",
				finder_nav: "10%",
			},
			width: {
				graph: "62%",
				graph_extend: "90%",
				health: "25%",
			},
			transitionProperty: {
				width: "width",
			},
			inset: {
				"7/10": "70%",
				graph: "65%",
				"4/10": "4%",
				"1/10": "1%",
				health: "35%",
				health_extend: "5%",
			},
			fontFamily: {
				alpha_slab: ["Alfa Slab One", "cursive"],
				krona_one: ["Krona One", "sans-serif"],
				karla: ["Karla", "sans-serif"],
			},
			translate: {
				sidebar: "22rem",
			},
			colors: {
				button_light: "#D9D9D9",
				button_dark: "#292929",
				button_red: "#FA6364",
				blue_bg: "#1A64F8",
				preset_active: "#1759D9",
				button_active: "#1C4FFF",
				button_inactive: "#FFFFFF",
				button_text_black: "#000000",
				button_text_white: "#FFFFFF",
				...blackA,
				...mauve,
				...violet,
			},
			dropShadow: {
				"3xl": "0px 10px 10px rgba(0, 0, 0, 1)",
				"4xl": ["30px 35px 35px rgba(0, 0, 0, 1)", "0 45px 65px rgba(0, 0, 0, 1)"],
			},
			gridTemplateRows: {
				10: "repeat(10, minmax(0, 1fr));",
			},
			gridRow: {
				"span-9": "span 9 / span 9",
				"span-8": "span 8 / span 8",
				"span-7": "span 7 / span 7",
			},
			gridRowStart: {
				6: "6",
				7: "7",
				8: "8",
				9: "9",
			},
			dropShadow: {
				"3xl": "0 35px 35px rgba(255, 255, 255, 0.5)",
				"4xl": [
					"0 35px 35px rgba(255, 255, 255, 0.5)",
					"0 45px 65px rgba(255, 255, 255, 0.3)",
				],
			},
			keyframes: {
				slideDownAndFade: {
					from: { opacity: 0, transform: "translateY(-2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideLeftAndFade: {
					from: { opacity: 0, transform: "translateX(2px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				slideUpAndFade: {
					from: { opacity: 0, transform: "translateY(2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideRightAndFade: {
					from: { opacity: 0, transform: "translateX(2px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
			},
			animation: {
				slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [],
};
