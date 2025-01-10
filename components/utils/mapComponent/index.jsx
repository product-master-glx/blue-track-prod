import { Box } from "@mui/material";
import MapSearch from "./mapSearch";
import Map from "react-map-gl/maplibre";
import { useAtomValue } from "jotai";
import { mapScrollWheelZoomAtom } from "@/jotai/index";

function MapComponent({ containerRef, children, center, zoom, mapRef }) {
	const MAP_SCROLL_WHEEL_ZOOM_BOOLEAN = useAtomValue(mapScrollWheelZoomAtom);
	// const CURRENT_BASEMAP = useAtomValue(currentBaseMapAtom);

	return (
		<Box ref={containerRef} sx={{ width: "auto", border: "1px solid grey", borderRadius: 2 }}>
			<Map
				initialViewState={{ longitude: center[0], latitude: center[1], zoom }}
				mapStyle={`https://api.maptiler.com/maps/basic-v2/style.json?key=${
					import.meta.env.VITE_API_KEY_MAPTILER
				}`}
				style={{ height: "89.5vh", width: "100%" }}
				ref={mapRef}
				scrollZoom={MAP_SCROLL_WHEEL_ZOOM_BOOLEAN}
			>
				{/* {CURRENT_BASEMAP === "satellite" && <MapboxSatelliteLayer />} */}
				{children}
				<MapSearch />
			</Map>
		</Box>
	);
}
export default MapComponent;
