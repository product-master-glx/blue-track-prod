import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "../pages/landing";
import CssBaseline from "@mui/material/CssBaseline";
import RegionInsight from "../pages/regionInsight";
import NotFound from "../pages/notFound";
import Layout from "../components/layout";
// import { DevTools } from "jotai-devtools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SignInPage from "../pages/signIn";
import SignUpPage from "@/pages/signUp";

// Creates a theme for the app using Material UI
const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

/**
 * Whatever renders here, user sees it.
 */
function App() {
	return (
		// <ErrorBoundary>
		//Theme provider from the material UI to update the theme
		<ThemeProvider theme={darkTheme}>
			{/* CSS base */}
			<CssBaseline />
			{/* Jotai Devtools */}
			{/* <DevTools isInitialOpen={false} /> */}

			{/* Framer component for animating */}
			<AnimatePresence>
				<BrowserRouter>
					<Routes>
						{/* In Layout, we are using Outlet to render the child route's element, if there is one. */}
						{/* Check if cookies exist, if no, redirect to sign in page */}
						<Route path="/" element={<Layout />}>
							<Route path="/" element={<LandingPage />} />
							<Route path="/region-insight/:orderId/" element={<RegionInsight />}>
								<Route path=":mandalId" element={<></>}>
									<Route path=":villageId" element={<></>} />
								</Route>
							</Route>
							<Route path="/sign-in" element={<SignInPage />} />
							<Route path="/sign-up" element={<SignUpPage />} />
						</Route>
						{/* In case no path exists, redirect to not found page */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</AnimatePresence>
		</ThemeProvider>
		// </ErrorBoundary>
	);
}

export default App;
