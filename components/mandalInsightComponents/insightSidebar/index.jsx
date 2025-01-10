import SideboxForLandingInsights from "@/components/utils/sideboxForLandingInsights";
import { showRegionInsightPageAtom } from "../../../jotai";
import RegionInsightData from "../regionInsightComponents/regionInsightData";
import { useAtomValue } from "jotai";

/**
 * This component shows the sidebar containing either region insights
 * or the pond insights in case user has selected any pond
 */
function InsightSidebar() {
	const REGION_INSIGHT_DISPLAY_BOOLEAN = useAtomValue(showRegionInsightPageAtom);
	return (
		<SideboxForLandingInsights>
			{REGION_INSIGHT_DISPLAY_BOOLEAN && <RegionInsightData />}
		</SideboxForLandingInsights>
	);
}

export default InsightSidebar;
