import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useAtom } from "jotai";
import { selectedToggleInLandingPageSideBoxAtom } from "@/jotai/index";

/**
 * Toggle between Order and Graph on the landing page sidebox data
 */
function ToggleButtons() {
	const [selectedToggleInLandingPageSideBox, setSelectedToggleInLandingPageSideBox] = useAtom(
		selectedToggleInLandingPageSideBoxAtom
	);

	const handleToggleInLandingPageSideBox = (_event, newToggleSelection) => {
		if (newToggleSelection !== null) {
			setSelectedToggleInLandingPageSideBox(newToggleSelection);
			console.log(newToggleSelection, "toggle switch");
		}
	};

	return (
		<ToggleButtonGroup
			value={selectedToggleInLandingPageSideBox}
			exclusive
			onChange={handleToggleInLandingPageSideBox}
			className="w-full"
		>
			<ToggleButton
				value="summary"
				className="w-full"
				aria-label="graph"
				sx={{ paddingX: "5px" }}
			>
				Summary
			</ToggleButton>
			<ToggleButton
				value="order"
				className="w-full"
				aria-label="order"
				sx={{ paddingX: "5px" }}
			>
				Order
			</ToggleButton>
			<ToggleButton
				// disabled
				className="w-full overflow-hidden"
				value="chatbot"
				aria-label="chatbot"
				sx={{ paddingX: "5px" }}
			>
				{/* <LockIcon /> */}
				Blue Bot
			</ToggleButton>
		</ToggleButtonGroup>
	);
}

export default ToggleButtons;
