import PropTypes from "prop-types";
import { Source, Layer, Map } from "react-map-gl/maplibre";
import MapGradientLegend from "./mapGradientLegend";
import ChangeMapView from "./changeMapView";
import MapGeocoder from "./MapGeocoder";
import { mapCenterAtom, mapZoomAtom } from "@/jotai/index";
import { useAtomValue } from "jotai";
import "maplibre-gl/dist/maplibre-gl.css";
import TooltipPopup from "./TooltipPopup";

function ReusableMapComponent({
	center,
	zoom,
	geoJsonData,
	maxTotalActiveAcreage,
	gradientArray,
	legendTitle,
	showLegend = true,
	showSearch = true,
	enableTooltip = true,
	onFeatureClick,
	onFeatureMouseEnter,
	onFeatureMouseLeave,
	children,
}) {
	const MAP_ZOOM_ATOM = useAtomValue(mapZoomAtom);
	const MAP_CENTER_ATOM = useAtomValue(mapCenterAtom);

	return (
		<Map
			initialViewState={{
				longitude: MAP_CENTER_ATOM[0],
				latitude: MAP_CENTER_ATOM[1],
				zoom: MAP_ZOOM_ATOM,
			}}
			mapStyle={`https://api.maptiler.com/maps/6bbcb0ed-e224-4b59-83ce-fd7846b5697a/style.json?key=${
				import.meta.env.VITE_API_KEY_MAPTILER_SATELLITE
			}`}
			style={{
				height: "88vh",
				width: "100%",
				position: "relative",
			}}
		>
			{showLegend && (
				<MapGradientLegend
					maxTotalActiveAcreage={maxTotalActiveAcreage}
					gradientArray={gradientArray}
					title={legendTitle}
				/>
			)}
			<ChangeMapView center={center} zoom={zoom} />
			{showSearch && <MapGeocoder />}

			{geoJsonData && (
				<Source id="polygon-data" type="geojson" data={geoJsonData}>
					<Layer
						id="polygon-layer"
						type="fill"
						paint={{
							"fill-color": ["get", "color"],
							"fill-opacity": 0.4,
						}}
						onClick={onFeatureClick}
						onMouseEnter={onFeatureMouseEnter}
						onMouseLeave={onFeatureMouseLeave}
					/>
					<Layer
						id="polygon-line-layer"
						type="line"
						paint={{
							"line-color": ["get", "color"],
							"line-width": 3,
							"line-opacity": 1.0,
						}}
					/>
				</Source>
			)}

			{enableTooltip && <TooltipPopup MAP_LAYER_ID="polygon-layer" />}
			{children}
		</Map>
	);
}

ReusableMapComponent.propTypes = {
	center: PropTypes.arrayOf(PropTypes.number).isRequired,
	zoom: PropTypes.number.isRequired,
	geoJsonData: PropTypes.object,
	maxTotalActiveAcreage: PropTypes.number.isRequired,
	gradientArray: PropTypes.arrayOf(PropTypes.string).isRequired,
	legendTitle: PropTypes.string,
	showLegend: PropTypes.bool,
	showSearch: PropTypes.bool,
	enableTooltip: PropTypes.bool,
	onFeatureClick: PropTypes.func,
	onFeatureMouseEnter: PropTypes.func,
	onFeatureMouseLeave: PropTypes.func,
	children: PropTypes.node,
};

export default ReusableMapComponent;
