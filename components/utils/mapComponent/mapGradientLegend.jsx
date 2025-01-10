import { Box, Stack } from "@mui/material";

function MapGradientLegend({
	maxTotalActiveAcreage = 0,
	gradientArray = [],
	style = {},
	title = "Active Acreage",
}) {
	return (
		<Stack
			direction="column"
			justifyContent="flex-start"
			alignItems="center"
			spacing={0}
			sx={{
				width: 100,
				height: "50vh",
				borderRadius: 1,
				position: "absolute",
				left: "1vh",
				top: "15vh",
				zIndex: "400",
				backgroundColor: "black",
				padding: "8px 2px",
				...style,
			}}
		>
			<Box sx={{ px: 2, typography: "p", fontSize: "15px", textAlign: "center" }}>
				{title}
			</Box>

			<Stack
				direction="row"
				justifyContent="flex-start"
				alignItems="center"
				spacing={0}
				sx={{
					width: "100%",
					height: "100%",
					// borderRadius: 1,
					// position: "absolute",
					// left: "1vh",
					// top: "10vh",
					// zIndex: "400",
					// backgroundColor: "black",
				}}
			>
				<Box
					sx={{
						width: "25%",
						height: "96%",
						marginTop: "5%",
						marginLeft: "10%",
						background: `linear-gradient(to top, ${gradientArray.join(", ")})`,
					}}
				/>
				<Stack
					direction="column"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={0}
					sx={{
						height: "100%",
						width: "75%",
						marginTop: "5%",
					}}
				>
					<Box sx={{ typography: "subtitle2" }}>
						- {parseInt(maxTotalActiveAcreage - 1).toLocaleString("en-IN")}
					</Box>
					<Box sx={{ typography: "subtitle2" }}>
						- {parseInt((2 * (maxTotalActiveAcreage - 1)) / 3).toLocaleString("en-IN")}
					</Box>
					<Box sx={{ typography: "subtitle2" }}>
						- {parseInt((maxTotalActiveAcreage - 1) / 3).toLocaleString("en-IN")}
					</Box>
					<Box sx={{ typography: "subtitle2" }}>- 0</Box>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default MapGradientLegend;
