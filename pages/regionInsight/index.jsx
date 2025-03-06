import { Box, Stack } from "@mui/material";
import InsightMap from "@/components/mandalInsightComponents/insightComponentMap";
import InsightSidebar from "@/components/mandalInsightComponents/insightSidebar";
import InsightBottomBoxHandler from "@/components/mandalInsightComponents/insightBottomBoxHandler";
import { useEffect } from "react";
import {
	regionDataGatheredFromLandingPageAtom,
	isUserOnLandingPageAtom,
	masterGeoJSONAtom,
	geoJSONCurrentlyBeingDisplayedAtom,
	mapZoomAtom,
	mapCenterAtom,
	metaDataForOrderAtom,
	// cookiesValuesAtom,
	FSMDataForCurrentOrderAtom,
	WQADataForCurrentOrderAtom,
	orderIDAtom,
	insightIDAtom,
	geoJSONSeperatedByStatusAsKeysAtom,
	currentOrderDataAtom,
	userDataAtom,sateliteViewAtom
} from "../../jotai";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import GetRegionData from "@/api-handlers/region-insights-handler/get_region_data";
import { useParams } from "react-router-dom";

const defineGeoJSONsForAllFarmStatus = (
	MASTER_GEOJSON,
	SET_GEOJSON_SEPERATED_BY_STATUS_AS_KEYS
) => {
	var temporaryJSONElement = {
		Harvested: { type: "FeatureCollection", features: [] },
		Running: { type: "FeatureCollection", features: [] },
		"Just Pumped": { type: "FeatureCollection", features: [] },
		Empty: { type: "FeatureCollection", features: [] },
		"Not Available": { type: "FeatureCollection", features: [] },
	};

	console.log(MASTER_GEOJSON, "MASTER_GEOJSON");

	MASTER_GEOJSON.features.map((item) => {
		//console.log(item);
		if (item?.properties?.farm_status === "NA") {
			temporaryJSONElement["Not Available"].features.push(item);
		} else {
			temporaryJSONElement[item?.properties?.farm_status]?.features.push(item);
		}
	});
	SET_GEOJSON_SEPERATED_BY_STATUS_AS_KEYS(temporaryJSONElement);
};
/**
 * To show the region insights
 * This pages shows the order details with data of the ponds
 */
function RegionInsight() {
	const { orderId, mandalId, villageId } = useParams();
	// To set the zoom on the map
	const SET_MAP_ZOOM_ATOM = useSetAtom(mapZoomAtom);
	// To set the center for the map
	const SET_MAP_CENTER_ATOM = useSetAtom(mapCenterAtom);
	// To set the meta data for the order
	const SET_METADATA_FOR_ORDER = useSetAtom(metaDataForOrderAtom);
	// Check whether user is on the landing page
	const SET_IS_USER_ON_LANDING_PAGE = useSetAtom(isUserOnLandingPageAtom);
	// Get the data from the landing page for selected order
	const REGION_DATA_GATHERED_FROM_LANDING_PAGE = useAtomValue(
		regionDataGatheredFromLandingPageAtom
	);
	const COOKIES = useAtomValue(userDataAtom);
	// To set the master data for the order
	const [MASTER_GEOJSON, SET_MASTER_GEO_JSON] = useAtom(masterGeoJSONAtom);
	// To set the current geo json object to show
	const SET_GEOJSON_CURRENTLY_BEING_DISPLAYED = useSetAtom(geoJSONCurrentlyBeingDisplayedAtom);
	// To set the current fsm data for the order
	const SET_FSM_DATA_FOR_CURRENT_ORDER = useSetAtom(FSMDataForCurrentOrderAtom);
	// To set the current fsm data for the order
	const SET_WQA_DATA_FOR_CURRENT_ORDER = useSetAtom(WQADataForCurrentOrderAtom);
	const SET_ORDER_ID_FOR_CURRENT_ORDER = useSetAtom(orderIDAtom);
	const SET_INSIGHT_ID_FOR_CURRENT_ORDER = useSetAtom(insightIDAtom);
	const SET_GEOJSON_SEPERATED_BY_STATUS_AS_KEYS = useSetAtom(geoJSONSeperatedByStatusAsKeysAtom);
	const SET_CURRENT_ORDER_DATA = useSetAtom(currentOrderDataAtom);
    const satliteView = useAtom(sateliteViewAtom);
	// console.log("REGION_DATA_GATHERED_FROM_LANDING_PAGE", REGION_DATA_GATHERED_FROM_LANDING_PAGE);
	useEffect(() => {
		SET_ORDER_ID_FOR_CURRENT_ORDER(orderId);
		SET_INSIGHT_ID_FOR_CURRENT_ORDER(orderId);
		console.log("orderId", orderId);
		if (!COOKIES.name) return;
		//We are not on the landing page
		SET_IS_USER_ON_LANDING_PAGE(false);
		// Get the data needed on this page
		GetRegionData(
			{
				...(REGION_DATA_GATHERED_FROM_LANDING_PAGE || {}),
				orderId,
				mandalId,
				villageId,
			},
			SET_MASTER_GEO_JSON,
			SET_GEOJSON_CURRENTLY_BEING_DISPLAYED,
			SET_MAP_ZOOM_ATOM,
			SET_MAP_CENTER_ATOM,
			SET_METADATA_FOR_ORDER,
			SET_CURRENT_ORDER_DATA,
			satliteView
			// SET_FSM_DATA_FOR_CURRENT_ORDER,
			// SET_WQA_DATA_FOR_CURRENT_ORDER
		);
	}, [
		orderId,
		mandalId,
		villageId,
		COOKIES,
		REGION_DATA_GATHERED_FROM_LANDING_PAGE,
		SET_MASTER_GEO_JSON,
		SET_IS_USER_ON_LANDING_PAGE,
		SET_GEOJSON_CURRENTLY_BEING_DISPLAYED,
		SET_MAP_ZOOM_ATOM,
		SET_MAP_CENTER_ATOM,
		SET_METADATA_FOR_ORDER,
		SET_ORDER_ID_FOR_CURRENT_ORDER,
		SET_INSIGHT_ID_FOR_CURRENT_ORDER,
		SET_FSM_DATA_FOR_CURRENT_ORDER,
		SET_WQA_DATA_FOR_CURRENT_ORDER,
		SET_CURRENT_ORDER_DATA,
	]);

	useEffect(() => {
		if (MASTER_GEOJSON) {
			defineGeoJSONsForAllFarmStatus(MASTER_GEOJSON, SET_GEOJSON_SEPERATED_BY_STATUS_AS_KEYS);
		}
	}, [MASTER_GEOJSON, SET_GEOJSON_SEPERATED_BY_STATUS_AS_KEYS]);

	return (
		<>
			<Box
				sx={{
					width: "auto",
					padding: "0 15px",
					height: "100%",
					position: "relative",
				}}
			>
				<Stack spacing={1} display={"flex"}>
					<InsightMap>
						<InsightSidebar />
						<InsightBottomBoxHandler />
					</InsightMap>
				</Stack>
			</Box>
		</>
	);
}

export default RegionInsight;
