import PropTypes from "prop-types";
import { Box } from "@mui/material";
import MapLibreContainer from "@/components/utils/mapComponent/MapLibreContainer";
import MapGradientLegend from "@/components/utils/mapComponent/mapGradientLegend";
import { colorGradientInsight } from "@/constants/index";
import { currentHighestCountRegionInsightAtom } from "@/jotai/index";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";

/**
 * This component shows the ponds in the selected order on the map
 */
function InsightMap({ children }) {
	const { villageId } = useParams();
	const currentHighestCountRegionInsight = useAtomValue(currentHighestCountRegionInsightAtom);

	return (
		<>
			<Box
				sx={{
					width: "auto",
					border: "1px solid grey",
					borderRadius: "2",
					height: "100%",
				}}
			>
				{!villageId && (
					<MapGradientLegend
						maxTotalActiveAcreage={currentHighestCountRegionInsight + 1}
						gradientArray={colorGradientInsight.getColors()}
						style={{
							height: "40vh",
							top: "10vh",
							left: "1.4vw",
						}}
						// title="No. of Ponds"
					/>
				)}
				<MapLibreContainer>{children}</MapLibreContainer>
			</Box>
		</>
	);
}

InsightMap.propTypes = {
	children: PropTypes.node.isRequired,
};

export default InsightMap;
