import { barChartTypeAtom } from "@/jotai/index";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useAtom } from "jotai";

function RegionInsightToggleButton() {
	const [BAR_CHART_TYPE, SET_BAR_CHART_TYPE] = useAtom(barChartTypeAtom);

	const handleChange = (_event, BAR_CHART_TYPE) => {
		if (BAR_CHART_TYPE !== null) {
			SET_BAR_CHART_TYPE(BAR_CHART_TYPE);
		}
	};
	return (
		<Box sx={{ width: "100%" }}>
			<ToggleButtonGroup
				value={BAR_CHART_TYPE}
				exclusive
				onChange={handleChange}
				aria-label="text alignment"
			>
				<ToggleButton value="count" aria-label="Count">
					Count
				</ToggleButton>
				<ToggleButton value="doc" aria-label="DOC">
					DOC
				</ToggleButton>
			</ToggleButtonGroup>
		</Box>
	);
}

export default RegionInsightToggleButton;
