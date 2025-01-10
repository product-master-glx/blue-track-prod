import { Box, Button } from "@mui/material";

function NotFoundFooterButtons() {
	return (
		<Box
			sx={{
				width: "100%",
			}}
		>
			<Button
				variant="outlined"
				sx={{ padding: 1, color: "white" }}
				onClick={() => {
					console.log("add ponds");
				}}
			>
				Add ponds
			</Button>
		</Box>
	);
}

export default NotFoundFooterButtons;
