import { graphFullSizeAtom, mapScrollWheelZoomAtom } from "@/jotai/index";
import { useSetAtom } from "jotai";
import { useState } from "react";
import CollapsableSideBox from "../collapsableSideBox";

function SideboxForLandingInsights({ children }) {
	const [isSideBoxVisible, setIsSideBoxVisible] = useState(true);
	const SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN = useSetAtom(mapScrollWheelZoomAtom);
	const SET_GRAPH_FULL_SIZE_BOOLEAN = useSetAtom(graphFullSizeAtom);

	const onSideboxClose = () => {
		setIsSideBoxVisible(false);
		SET_GRAPH_FULL_SIZE_BOOLEAN(true);
	};

	const onSideboxOpen = () => {
		setIsSideBoxVisible(true);
		SET_GRAPH_FULL_SIZE_BOOLEAN(false);
	};
	const onMouseEnter = () => {
		SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN(false);
	};
	const onMouseLeave = () => {
		SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN(true);
	};
	return (
		<>
			<CollapsableSideBox
				openSideBox={isSideBoxVisible}
				onSideboxClose={onSideboxClose}
				onSideboxOpen={onSideboxOpen}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				{children}
			</CollapsableSideBox>
		</>
	);
}

export default SideboxForLandingInsights;
