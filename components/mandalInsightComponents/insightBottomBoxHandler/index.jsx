import InsightBottomDisplayBox from "./insightBottomDisplayBox";
import RegionInsightMapLegend from "../regionInsightComponents/regionInsightMapLegend";
import RegionInsightGraph from "../regionInsightComponents/regionInsightGraph";
import RegionInsightGraphDropdown from "../regionInsightComponents/regionInsightGraph/regionInsightGraphDropdown";
import { Box } from "@mui/material";

/**
 * This component renders the monotone graph of selected property e.g. pH, Ammonia, Calcium
 * and also gives option to select property. In case the user has selected particular status (after clicking on the graph)
 * and status is running, then we will show a slider to select range of DoC
 */
function InsightBottomBoxHandler() {
	return (
		<InsightBottomDisplayBox>
			<Box
				component="div"
				sx={{
					backgroundColor: "black",
					width: "25%",
					display: "flex",
					flexDirection: "column",
					gap: "4px",
				}}
			>
				<RegionInsightGraphDropdown />
				<RegionInsightMapLegend />
			</Box>
			<Box component="div" sx={{ backgroundColor: "black", width: "75%", height: "30vh" }}>
				<RegionInsightGraph />
			</Box>
		</InsightBottomDisplayBox>
	);
}

export default InsightBottomBoxHandler;
