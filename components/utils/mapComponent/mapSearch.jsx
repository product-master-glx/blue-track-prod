import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

/**
 * This component helps to search the location using MapBoxProvider
 */
function MapSearch() {
	const { current: Map } = useMap();
	const geocoderContainerRef = useRef(null);

	useEffect(() => {
		if (Map && geocoderContainerRef.current) {
			const geocoder = new MapboxGeocoder({
				accessToken: import.meta.env.VITE_MAP_BOX_PROVIDER_ACCESS_TOKEN,
				mapboxgl: Map.getMap(),
				placeholder: "search region of interest",
				marker: false,
			});
			geocoderContainerRef.current.appendChild(geocoder.onAdd(Map.getMap()));
		}
	}, [Map]);

	return (
		<div
			ref={geocoderContainerRef}
			style={{
				position: "absolute",
				top: 0,
				left: 10,
				zIndex: 1,
			}}
		/>
	);
}

export default MapSearch;
