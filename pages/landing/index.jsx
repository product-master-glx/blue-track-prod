import { Box, Stack } from "@mui/material";
import {
	graphDataForLandingPageAtom,
	isUserOnLandingPageAtom,
	listOfAllOrderDataAtom,
	listOfFilteredOrderDataAtom,
	showLoadingScreenAtom,
	userAccessTokensAtom,
	userDataAtom,
} from "@/jotai/index";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
// import getAllStatsHandler from "@/api-handlers/landing-page-handler/get_all_stats.handler";
import GetOrderDataHandler from "@/api-handlers/landing-page-handler/get_orders.handler";
import LandingPageMapContainer from "@/components/landingPageComponents/landingPageMap";

/**
 * This page shows the map and sidebar containing orders and graph data
 */
function LandingPage() {
	// State to manage laoder
	const SET_LOADING_SCREEN_BOOLEAN = useSetAtom(showLoadingScreenAtom);
	// Check whether user is on the landing page
	const SET_IS_USER_ON_LANDING_PAGE = useSetAtom(isUserOnLandingPageAtom);
	// User access token
	const USER_ACCESS_TOKEN_VALUE = useAtomValue(userAccessTokensAtom);
	// To store and update user's order data
	const SET_ALL_ORDER_DATA = useSetAtom(listOfAllOrderDataAtom);
	// To set the filtered order data according to selected filter (DoC)
	const SET_FILTERED_ORDER_DATA = useSetAtom(listOfFilteredOrderDataAtom);
	// All Stats data
	const SET_GRAPH_DATA_FOR_LANDING_PAGE = useSetAtom(graphDataForLandingPageAtom);
	// User data
	const COOKIES = useAtomValue(userDataAtom);

	useEffect(() => {
		// Prevents request when cookies have not been initialized
		if (!COOKIES || (COOKIES && !COOKIES.name)) return;

		// Starts loading
		SET_LOADING_SCREEN_BOOLEAN(true);

		// Send request to get the all stats
		// const graphData = getAllStatsHandler();

		// Send request to get the order data
		const orderData = GetOrderDataHandler();
		// Wait for both APIs to get completed
		Promise.allSettled([orderData]).then((res) => {
			const allOrderData = res[0].value;
			// If the order data and graph data exists
			if (allOrderData) {
				// // Update the order data with summary data, filter the null values
				// const temp_order_data = allOrderData.map((singleOrderData) => {
				// 	singleOrderData = { ...singleOrderData };
				// 	// Update the summary of the order
				// 	singleOrderData.avg_doc = allOrderData["avg_doc"];
				// 	singleOrderData.min_doc = allOrderData["min_doc"];
				// 	singleOrderData.max_doc = allOrderData["max_doc"];
				// 	singleOrderData.running_ponds = allOrderData["running_ponds"];

				// 	return singleOrderData;
				// });
				SET_ALL_ORDER_DATA(allOrderData);
				SET_FILTERED_ORDER_DATA(allOrderData);
			}
			// Stop loading
			SET_LOADING_SCREEN_BOOLEAN(false);
		});

		// We are on landing page, as we are on landing page
		SET_IS_USER_ON_LANDING_PAGE(true);
	}, [
		COOKIES,
		USER_ACCESS_TOKEN_VALUE,
		SET_GRAPH_DATA_FOR_LANDING_PAGE,
		SET_IS_USER_ON_LANDING_PAGE,
		SET_LOADING_SCREEN_BOOLEAN,
		SET_ALL_ORDER_DATA,
		SET_FILTERED_ORDER_DATA,
	]);

	return (
		<>
			<Box
				sx={{
					width: "auto",
					padding: "0 15px",
					height: "100%",
				}}
			>
				<Stack spacing={1}>
					<LandingPageMapContainer />
				</Stack>
			</Box>
		</>
	);
}

export default LandingPage;
