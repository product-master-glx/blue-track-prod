import { showLoadingScreenAtom } from "@/jotai/index";
import { Backdrop, CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai";

/**
 * This shows a loading screen (a loader with a backdrop) whenever the global state changes
 */
function LoadingScreen() {
	const LOADING_SCREEN_BOOLEAN = useAtomValue(showLoadingScreenAtom);
	return (
		<Backdrop sx={{ color: "#fff", zIndex: 5000 }} open={LOADING_SCREEN_BOOLEAN}>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
}

export default LoadingScreen;
