import { Box, Stack, IconButton, Slide } from "@mui/material";
import { useAtom } from "jotai";
import { useState } from "react";
import PropTypes from "prop-types";
import { graphFullSizeAtom, mapScrollWheelZoomAtom } from "../../../../jotai";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/**
 * This component wraps the bottom slider/monotone graph components with collapsable functionality
 */
function InsightBottomDisplayBox({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	const [GRAPH_FULL_SIZE_BOOLEAN, ] = useAtom(graphFullSizeAtom);
	const SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN = useAtom(mapScrollWheelZoomAtom);

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		// SET_GRAPH_FULL_SIZE_BOOLEAN(!newState);
	};

	const onMouseEnter = () => {
		SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN(false);
	};

	const onMouseLeave = () => {
		SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN(true);
	};

	return (
		<>
			<IconButton
				aria-label={isOpen ? "Close Bottom Box" : "Open Bottom Box"}
				onClick={handleToggle}
				sx={{
					p: "10px",
					position: "fixed",
					transition: "bottom 0.3s ease",
					border: "1px solid grey",
					borderRadius: "2px",
					backgroundColor: "black",
					zIndex: 1400,
					marginBottom: "-20px",
					transform: "translateY(-50%)",
					bottom: isOpen ? "calc(33vh + 20px)" : "20px",
					alignItems: "center",
					right: "50%",
				}}
			>
				{isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
			</IconButton>

			<Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
				<Box
					component="div"
					sx={{
						display: "flex",
						justifyContent: "center",
						width: GRAPH_FULL_SIZE_BOOLEAN ? "auto" : "calc(100% - 412px)",
						p: 2,
						border: "1px solid grey",
						borderRadius: "2px",
						backgroundColor: "black",
						position: "fixed",
						right: "5px",
						left: "5px",
						bottom: "5px",
						zIndex: 1300,
						marginRight: "auto",
						height: "33vh",
					}}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
				>
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						sx={{
							display: "flex",
							width: "100%",
							height: "100%",
							margin: "5px",
							mb: "0px",
							overflowY: "hidden",
						}}
					>
						{children}
					</Stack>
				</Box>
			</Slide>
		</>
	);
}

InsightBottomDisplayBox.propTypes = {
	children: PropTypes.node.isRequired,
};

export default InsightBottomDisplayBox;
