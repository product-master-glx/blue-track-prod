import Map from "react-map-gl/maplibre";
import { mapCenterAtom, mapZoomAtom, sateliteViewAtom, mapRefAtom } from "@/jotai/index";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import "maplibre-gl/dist/maplibre-gl.css";
import MapSource from "./MapSource";
import { useRef } from "react";
import ChangeMapView from "./changeMapView";
import Toggle from "./Toggle";
function MapLibreContainer({ children }) {
	const MAP_ZOOM_ATOM = useAtomValue(mapZoomAtom);
	const MAP_CENTER_ATOM = useAtomValue(mapCenterAtom);
	const [sateliteView] = useAtom(sateliteViewAtom);
	const setMapRef = useSetAtom(mapRefAtom);
	// const setZoom = useSetAtom(mapZoomAtom);
	const mapWrapperRef = useRef(null);

	const handleMapLoad = () => {
		if (mapWrapperRef.current) {
			const mapInstance = mapWrapperRef.current.getMap();
			// let zoom = mapInstance.getZoom();
			// setZoom(zoom)

			setMapRef(mapInstance); // ✅ Sets actual MapLibre map object
		}
	};

	return (
		<>
			<Map
				ref={mapWrapperRef}
				initialViewState={{
					longitude: MAP_CENTER_ATOM[0],
					latitude: MAP_CENTER_ATOM[1],
					zoom: MAP_ZOOM_ATOM,
				}}
				onLoad={handleMapLoad}
				mapLib={import("maplibre-gl")}
				// mapStyle={`https://api.maptiler.com/maps/6bbcb0ed-e224-4b59-83ce-fd7846b5697a/style.json?key=${
				// 	import.meta.env.VITE_API_KEY_MAPTILER_SATELLITE
				// }`}
				mapStyle={
					sateliteView
						? `https://api.maptiler.com/maps/satellite/style.json?key=seVNzl83FrbO4O11rjo1`
						: `https://api.maptiler.com/maps/6bbcb0ed-e224-4b59-83ce-fd7846b5697a/style.json?key=${
								import.meta.env.VITE_API_KEY_MAPTILER_SATELLITE
						  }`
				}
				style={{
					height: "88vh",
					width: "100%",
					position: "relative",
				}}
			>
				<Toggle />
				<ChangeMapView center={MAP_CENTER_ATOM} zoom={MAP_ZOOM_ATOM} />
				<MapSource />
				{children}
			</Map>
		</>
	);
}

export default MapLibreContainer;
