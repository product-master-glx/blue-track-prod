import { Box, Stack } from "@mui/material";
import Icon404 from "../icon404";
import NotFoundFooterButtons from "../notFoundFooterButtons";

function NotFoundData() {
	return (
		<Box sx={{ minHeight: "100vh" }}>
			<Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
				<Icon404 />
				<NotFoundFooterButtons />
			</Stack>
		</Box>
	);
}

export default NotFoundData;
