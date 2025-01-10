import { Box, IconButton, Slide, Stack } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PropTypes from "prop-types";
/**
 * This component is used for the sidebox on the landing and insights page
 * which is collapsable
 */
function CollapsableSideBox({
	children,
	openSideBox,
	showCloseIcon = true,
	onSideboxClose = () => {},
	onSideboxOpen = () => {},
	onMouseEnter = () => {},
	onMouseLeave = () => {},
}) {
	return (
		<>
			<Stack
				direction="row"
				// divider={
				//   <Divider
				//     orientation="vertical"
				//     variant="middle"
				//     flexItem
				//     sx={{
				//       zIndex:1000,
				//       borderRightWidth: 5,
				//       bgcolor:'black',
				//       marginY:5
				//     }}/>}
				spacing={2}
				justifyContent="flex-end"
				alignItems="center"
				sx={{
					height: "100%",
					marginRight: "8px",
				}}
			>
				{showCloseIcon &&
					(openSideBox ? (
						<IconButton
							aria-label="Close Sidebar"
							onClick={onSideboxClose}
							sx={{
								p: "10",
								border: "1px solid grey",
								borderRadius: "2px",
								backgroundColor: "black",
								position: "relative",
								marginRight: "8px",
								zIndex: "400",
							}}
						>
							<ArrowForwardIosIcon />
						</IconButton>
					) : (
						<IconButton
							aria-label="Open Sidebar"
							onClick={onSideboxOpen}
							sx={{
								p: "10",
								border: "1px solid grey",
								borderRadius: "2px",
								backgroundColor: "black",
								position: "relative",
								marginRight: "8px",
								zIndex: "400",
							}}
						>
							<ArrowBackIosNewIcon />
						</IconButton>
					))}

				<Slide direction="left" in={openSideBox} mountOnEnter unmountOnExit>
					<Box
						component="div"
						sx={{
							display: "flex",
							justifyContent: "center",
							width: 384,
							p: 2,
							border: "1px solid grey",
							borderRadius: "2px",
							backgroundColor: "black",
							position: "relative",
							height: "calc(100% - 16px)",
							zIndex: "1000",
							margin: "auto",
						}}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						<Stack
							direction="column"
							spacing={2}
							alignItems="center"
							sx={{
								display: "flex",
								width: "100%",
								height: "100%",
								overflowY: "auto",
								mt: "5px",
							}}
						>
							{children}
						</Stack>
					</Box>
				</Slide>
			</Stack>
		</>
	);
}

CollapsableSideBox.propTypes = {
	children: PropTypes.node.isRequired,
};

export default CollapsableSideBox;
