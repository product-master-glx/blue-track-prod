import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, InputLabel } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { currentLineChartDropdownValueAtom, metaDataForOrderAtom } from "../../../../../jotai";
import { useEffect } from "react";

/**
 * This renders a dropdown for selecting property
 */
export default function RegionInsightGraphDropdown() {
	const [CURRENT_LINE_CHART_DROPDOWN_VALUE, SET_CURRENT_LINE_CHART_DROPDOWN_VALUE] = useAtom(
		currentLineChartDropdownValueAtom
	);

	const handleChange = (event) => {
		SET_CURRENT_LINE_CHART_DROPDOWN_VALUE(event.target.value);
	};

	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom);

	useEffect(() => {
		if (METADATA_FOR_ORDER && METADATA_FOR_ORDER?.count_summary)
			SET_CURRENT_LINE_CHART_DROPDOWN_VALUE(
				Object.keys(METADATA_FOR_ORDER?.count_summary).pop()
			);
	}, [METADATA_FOR_ORDER, SET_CURRENT_LINE_CHART_DROPDOWN_VALUE]);
	return (
		<Box sx={{ top: 0, height: "100%", width: "100%" }}>
			<FormControl sx={{ width: "100%" }}>
				<InputLabel id="property-label">Count</InputLabel>
				{METADATA_FOR_ORDER && METADATA_FOR_ORDER.count_summary && (
					<Select
						labelId="property-label"
						id="property-label"
						value={CURRENT_LINE_CHART_DROPDOWN_VALUE}
						onChange={handleChange}
						displayEmpty
						label="Property"
					>
						{Object.keys(METADATA_FOR_ORDER.count_summary).map((item, index) => {
							return (
								<MenuItem value={item} key={index}>
									{item}
								</MenuItem>
							);
						})}
					</Select>
				)}
				{/* <FormHelperText>Without label</FormHelperText> */}
			</FormControl>
		</Box>
	);
}
