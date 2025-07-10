import { Box, Button, Stack, Typography } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { currentOrderDataAtom } from "@/jotai/index";
import { useMemo } from "react";

function RegionInsightHeaderButtons() {
	const { mandalId, villageId } = useParams();
	const CURRENT_ORDER_DATA = useAtomValue(currentOrderDataAtom);
	const navigate = useNavigate();

	const typeOfName = useMemo(() => {
		if (mandalId) {
			if (villageId) {
				return "Village";
			}
			return "Mandal";
		}
		return "District";
	}, [mandalId, villageId]);

	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			alignItems="center"
			spacing={2}
			sx={{ width: "100%", marginBottom: 5 }}
		>
			<Typography variant="h5" sx={{ lineHeight: 1 }}>
				{CURRENT_ORDER_DATA.name}{" "}
				{CURRENT_ORDER_DATA.name && <span className="text-sm">({typeOfName})</span>}
			</Typography>
			<Box
				m={0.5}
				//margin
				display="flex"
			>
				<Button
					variant="outlined"
					startIcon={<UndoIcon />}
					sx={{
						width: 90,
						padding: 1,
						color: "white",
						borderColor: "grey",
						alignItems: "left",
						alignContent: "left",
					}}
					onClick={() => {
						navigate(-1);
					}}
				>
					Back
				</Button>
			</Box>
		</Stack>
	);
}

export default RegionInsightHeaderButtons;
