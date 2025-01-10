import { Box, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { metaDataForOrderAtom } from "../../../../jotai";
import RegionInsightBarChart from "../regionInsightBarChart";
import RegionInsightHeaderButtons from "../regionInsightHeaderButtons";
import RegionInsightToggleButton from "../regionInsightToggleButton";

/**
 * This component renders a meta data for the order as well
 * as Bar graph in case the pond selected is in running state
 * or Pie chart
 */
function RegionInsightData() {
	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom);
	console.log("METADATA_FOR_ORDER", METADATA_FOR_ORDER);

	return (
		<Stack direction="column" spacing={1} sx={{ height: "100%", width: "100%" }}>
			<RegionInsightHeaderButtons />
			<Stack direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
				<Box
					component="section"
					sx={{
						px: 2,
						py: 1,
						borderRadius: 1,
						backgroundColor: "#00FF7F",
						color: "black",
					}}
				>
					<Typography variant="subtitle2" component="div">
						Running Acreage
					</Typography>
					<Typography variant="h6" component="div">
						{Number(METADATA_FOR_ORDER?.total_running_acreage).toFixed(3)}&nbsp;
						<Typography variant="subtitle2" display="inline">
							acres
						</Typography>
					</Typography>
				</Box>
				<Box
					component="section"
					sx={{
						px: 2,
						py: 1,
						borderRadius: 1,
						backgroundColor: "#00FF7F",
						color: "black",
					}}
				>
					<Typography variant="subtitle2" component="div">
						Running Ponds
					</Typography>
					<Typography variant="h6" component="div">
						{METADATA_FOR_ORDER?.running_ponds ?? 0}
					</Typography>
				</Box>
			</Stack>
			<RegionInsightToggleButton />
			<RegionInsightBarChart />
		</Stack>
	);
}

export default RegionInsightData;
