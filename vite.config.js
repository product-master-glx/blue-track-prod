import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@/src": "/src",
			"@/components": "/components",
			"@/constants": "/constants",
			"@/jotai": "/jotai",
			"@/pages": "/pages",
			"@/api-handlers": "/api-handlers",
		},
	},
});
