import { Outlet } from "react-router";
import Navigation from "./navbar";
import { Toaster } from "react-hot-toast";
import { Box, Stack } from "@mui/system";
import { Fragment, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { history, ignoreNavbarRoutes } from "../../constants";
import LoadingScreen from "../utils/loadingScreen";
import CheckCookies from "./checkCookies";

/**
 * This component is basic layout with navbar, whatever components get wraps in this will have a navbar
 */
function LayoutWithNavbar({ children }) {
	return (
		<Stack spacing={0} sx={{ height: "100vh" }}>
			<Box sx={{ height: "10%" }}>
				<Navigation />
			</Box>
			<Box sx={{ height: "90%", backgroundColor: "#242424" }}>{children}</Box>
		</Stack>
	);
}

/**
 * This component is basic layout, all the pages get wrapped in this component
 */
function Layout() {
	const location = useLocation();

	history.navigate = useNavigate();
	history.location = location;

	// Decide the layout should have a navbar or not based on the given routes for which we have to hide the navbar
	const BasicLayout = useMemo(() => {
		const isNavbarIgnored = ignoreNavbarRoutes.includes(location.pathname);
		return isNavbarIgnored ? Fragment : LayoutWithNavbar;
	}, [location.pathname]);

	return (
		<CheckCookies>
			<Box sx={{ width: "100%", margin: "0", overflow: "hidden" }}>
				<BasicLayout>
					<Outlet />
				</BasicLayout>
				<LoadingScreen />

				<Toaster
					position="top-center"
					reverseOrder={true}
					toastOptions={{
						style: {
							zIndex: 50,
						},
						duration: 5000,
					}}
				/>
			</Box>
		</CheckCookies>
	);
}

export default Layout;
