import LandingPageOrderData from "./landingPageOrderData";
import ToggleButtons from "./landingPageToggleButtons";
import { useAtom } from "jotai";
import { selectedToggleInLandingPageSideBoxAtom } from "@/jotai/index";
import SideboxForLandingInsights from "@/components/utils/sideboxForLandingInsights";
import { useMemo } from "react";
import LandingPageSummary from "./landingPageSummary";
import LandingPageChatbot from "./landingPageChatbot";

/**
 * This is sidebox for the landing page containing order data and all stats with PieChart
 */
function LandingSideBox() {
	const [selectedToggleInLandingPageSideBox] = useAtom(selectedToggleInLandingPageSideBoxAtom);

	const ComponentToDisplay = useMemo(() => {
		switch (selectedToggleInLandingPageSideBox) {
			case "summary":
				return LandingPageSummary;
			case "order":
				return LandingPageOrderData;
			case "chatbot":
				return LandingPageChatbot;
			default:
				return <>Something went wrong. Please try again</>;
		}
	}, [selectedToggleInLandingPageSideBox]);

	return (
		<SideboxForLandingInsights>
			<ToggleButtons />
			<ComponentToDisplay />
		</SideboxForLandingInsights>
	);
}

export default LandingSideBox;
