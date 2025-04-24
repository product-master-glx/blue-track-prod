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
	const totalRunningAcreage = Number(METADATA_FOR_ORDER?.total_running_acreage).toFixed(2);
	const percentageRunningAcreage = (
		(METADATA_FOR_ORDER?.total_running_acreage / METADATA_FOR_ORDER?.total_acreage) *
		100
	).toFixed(2);
	const percentageRunningPonds = (
		(METADATA_FOR_ORDER?.running_ponds / METADATA_FOR_ORDER?.total_ponds) *
		100
	).toFixed(2);
	return (
		<Stack direction="column" spacing={1} sx={{ height: "100%", width: "100%" }}>
			<RegionInsightHeaderButtons />
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				spacing={1} // Reduced from 1
			>
				<Box
					component="section"
					sx={{
						px: 1, // Reduced from 2
						py: 0.5, // Reduced from 1
						borderRadius: 4,
						backgroundColor: "#121A2B",
						color: "white",
						border: "1px solid #004AAD",
						width: "50%",
					}}
				>
					<Typography variant="subtitle2" component="div" sx={{ fontWeight: "bold" }}>
						Active
						<br />
						Acreage
					</Typography>
					<Typography variant="subtitle2" component="div">
						{totalRunningAcreage}&nbsp;
						<span style={{ fontSize: "0.8rem", color: "#126bc5" }}>
							~{percentageRunningAcreage}%
						</span>
					</Typography>
					<Typography
						variant="subtitle2"
						component="div"
						sx={{ mt: 0.5, color: "#126bc5" }} // Reduced from 1
					>
						Total Acreage
					</Typography>
					<Typography variant="subtitle1" component="div" sx={{ color: "#126bc5" }}>
						{Number(METADATA_FOR_ORDER?.total_acreage).toFixed(3)}&nbsp;
					</Typography>
				</Box>
				<Box
					component="section"
					sx={{
						px: 1, // Reduced from 2
						py: 0.5, // Reduced from 1
						borderRadius: 4,
						backgroundColor: "#121A2B",
						color: "white",
						border: "1px solid #004AAD",
						width: "50%",
					}}
				>
					<Typography variant="subtitle2" component="div" sx={{ fontWeight: "bold" }}>
						Active
						<br />
						Ponds
					</Typography>
					<Typography variant="subtitle2" component="div">
						{METADATA_FOR_ORDER?.running_ponds ?? 0}
						<span style={{ marginLeft: "15px", fontSize: "0.8rem", color: "#126bc5" }}>
							~{percentageRunningPonds}%
						</span>
					</Typography>
					<Typography
						variant="subtitle2"
						component="div"
						sx={{ mt: 0.5, color: "#126bc5" }} // Reduced from 1
					>
						Total Ponds
					</Typography>
					<Typography variant="subtitle1" component="div" sx={{ color: "#126bc5" }}>
						{METADATA_FOR_ORDER?.total_ponds ?? 0}
					</Typography>
				</Box>
			</Stack>
			<RegionInsightToggleButton />
			<RegionInsightBarChart />
		</Stack>
	);
}

export default RegionInsightData;
