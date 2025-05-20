import { Source, GeolocateControl } from "react-map-gl/maplibre";
import { useEffect } from "react";
import {
	geoJSONCurrentlyBeingDisplayedAtom,
	showLoadingScreenAtom,
	centroidGeoJsonAtom,
} from "@/jotai/index";
import { useAtomValue, useSetAtom } from "jotai";
import MapGeocoder from "./MapGeocoder";
import TooltipPopup from "./TooltipPopup";
import MapLayer from "./MapLayer";

const MAP_SOURCE_ID = "ponds-map";
const MAP_LAYER_ID = "ponds-polygons";

function MapSource() {
	const GEOJSON_CURRENTLY_BEING_DISPLAYED = useAtomValue(geoJSONCurrentlyBeingDisplayedAtom);
	const CENTROID_GEOJSON = useAtomValue(centroidGeoJsonAtom);
	const SET_LOADING_SCREEN_BOOLEAN = useSetAtom(showLoadingScreenAtom);

	useEffect(() => {
		if (GEOJSON_CURRENTLY_BEING_DISPLAYED) {
			SET_LOADING_SCREEN_BOOLEAN(false);
		}

		GEOJSON_CURRENTLY_BEING_DISPLAYED?.features?.forEach((element) => {
			if (element.properties.village && element.properties.total_ponds === 0)
				console.log("GEOJSON_CURRENTLY_BEING_DISPLAYED element", element.properties);
		});
	}, [GEOJSON_CURRENTLY_BEING_DISPLAYED, SET_LOADING_SCREEN_BOOLEAN]);

	return (
		<>
			{GEOJSON_CURRENTLY_BEING_DISPLAYED && (
				<Source id={MAP_SOURCE_ID} type="geojson" data={GEOJSON_CURRENTLY_BEING_DISPLAYED}>
					<MapLayer MAP_LAYER_ID={MAP_LAYER_ID} MAP_SOURCE_ID={MAP_SOURCE_ID} />
				</Source>
			)}
			{CENTROID_GEOJSON && (
				<Source id={MAP_SOURCE_ID + "_centroids"} type="geojson" data={CENTROID_GEOJSON}>
					<MapLayer
						MAP_LAYER_ID={MAP_LAYER_ID + "_centroids"}
						MAP_SOURCE_ID={MAP_SOURCE_ID + "_centroids"}
					/>
				</Source>
			)}
			<GeolocateControl position="top-left" style={{ maxHeight: "50px" }} />
			<TooltipPopup MAP_LAYER_ID={MAP_LAYER_ID} />
			<MapGeocoder />
		</>
	);
}

export default MapSource;
