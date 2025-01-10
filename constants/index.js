/**
 * This file contains the constants required all over the app, which are common
 */

import Gradient from "javascript-color-gradient";

// Auth urls
export const authURLs = ["/sign-in", "/sign-up"];
// URLs for which we don't have to show navbar
export const ignoreNavbarRoutes = [...authURLs];

export const history = {
	navigate: null,
	location: null,
};

export const colorGradientInsight = new Gradient()
	.setColorGradient(
		"#46c898",
		"#46b498",
		"#46a098",
		"#469098",
		"#467898",
		"#466498",
		"#465298",
		"#464098",
		"#462898",
		"#461698",
		"#460098",
		"#500098",
		"#5a0098",
		"#640098",
		"#6e0098",
		"#780098",
		"#820098",
		"#8c0098",
		"#960098",
		"#a00098"
	)
	.setMidpoint(101);
