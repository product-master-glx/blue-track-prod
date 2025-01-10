import { cookiesValuesAtom, graphDataForLandingPageAtom } from "@/jotai/index";
import { getDefaultStore } from "jotai";
import request_handler from "../request.handler";
import endpoints from "@/constants/endpoints";

// To load the all the stats of the user which contains how many farms are "Empty", "Harvested", "Just Pumped", "Running"
export default async function getAllStatsHandler() {
	const store = getDefaultStore();
	const graphDataForLandingPage = store.get(graphDataForLandingPageAtom);
	if (graphDataForLandingPage) {
		return graphDataForLandingPage;
	}
	const COOKIES = store.get(cookiesValuesAtom);
	// Send the request with userID from the user data we stored in the global state and access token
	const graphData = await request_handler({
		method: "post",
		endpoint: endpoints.glxBlue.allStats,
		data: {
			userId: COOKIES.user_id,
		},
		successToast: false,
	});
	console.log(graphData, "graphData");
	return graphData;
}
