import { Box, Stack } from "@mui/material";
import { useAtomValue } from "jotai";
import PropTypes from "prop-types";
import { graphFullSizeAtom } from "../../../../jotai";

/**
 * This component wraps the bottom slider/monotone graph components
 */
function InsightBottomDisplayBox({ children }) {
	const GRAPH_FULL_SIZE_BOOLEAN = useAtomValue(graphFullSizeAtom);

	return (
		<>
			<Box
				component="div"
				sx={{
					display: "flex",
					justifyContent: "center",
					width: GRAPH_FULL_SIZE_BOOLEAN ? "auto" : "calc(100% - 400px)",
					p: 2,
					border: "1px solid grey",
					borderRadius: "2",
					backgroundColor: "black",
					position: "absolute",
					right: 5,
					left: 5,
					bottom: 5,
					zIndex: "1000",
					marginRight: "auto",
				}}
			>
				<Stack
					direction="row"
					spacing={1}
					alignItems="center"
					sx={{
						display: "flex",
						width: "100%",
						height: "100%",
						overflowY: "none",
						margin: "5px",
						mb: "0px",
					}}
				>
					{children}
				</Stack>
			</Box>
		</>
	);
}

InsightBottomDisplayBox.propTypes = {
	children: PropTypes.node.isRequired,
};

export default InsightBottomDisplayBox;
