import { Box } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useAtom } from "jotai";
import { sateliteViewAtom, setSateliteViewAtom } from "@/jotai/index"; // Import Jotai atoms

const Toggle = () => {
	const [sateliteView] = useAtom(sateliteViewAtom);
	const [, toggleSateliteView] = useAtom(setSateliteViewAtom);

	const handleToggle = (_, newValue) => {
		if (newValue !== null) {
			toggleSateliteView(newValue); // Toggle the state using Jotai
		}
	};

	return (
		<Box
			sx={{
				position: "absolute",
				bottom: 10,
				left: 10,
				zIndex: 100,
				display: "flex",
				alignItems: "center",
				gap: 1,
			}}
		>
			<ToggleButtonGroup
				value={sateliteView} // Bind to Jotai state
				exclusive
				onChange={handleToggle}
				className="w-full"
				sx={{ borderRadius: "24px" }}
			>
				<ToggleButton
					value={true}
					className="w-full whitespace-nowrap"
					aria-label="satellite-on"
					sx={{ paddingX: "5px" }}
				>
					Satellite View
				</ToggleButton>

				<ToggleButton
					value={false}
					className="w-full"
					aria-label="satellite-off"
					sx={{ paddingX: "5px" }}
				>
					Street View
				</ToggleButton>
			</ToggleButtonGroup>
		</Box>
	);
};

export default Toggle;
