import { useEffect, useState } from "react";
import { useMap, Marker } from "react-map-gl/maplibre";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const coordinatesGeocoder = function (query) {
	// Match anything which looks like
	// decimal degrees coordinate pair.
	const matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
	if (!matches) {
		return null;
	}

	function coordinateFeature(lng, lat) {
		return {
			center: [lng, lat],
			geometry: {
				type: "Point",
				coordinates: [lng, lat],
			},
			place_name: "Lat: " + lat + " Lng: " + lng,
			place_type: ["coordinate"],
			properties: {},
			type: "Feature",
		};
	}

	const coord1 = Number(matches[1]);
	const coord2 = Number(matches[2]);
	const geocodes = [];

	if (coord2 < -90 || coord2 > 90) {
		// must be lat, lng
		geocodes.push(coordinateFeature(coord2, coord1));
	}

	if (coord1 < -90 || coord1 > 90) {
		// must be lng, lat
		geocodes.push(coordinateFeature(coord1, coord2));
	}

	if (geocodes.length === 0) {
		// else could be either lng, lat or lat, lng
		geocodes.push(coordinateFeature(coord2, coord1));
		geocodes.push(coordinateFeature(coord1, coord2));
	}

	return geocodes;
};

function MapGeocoder() {
	const { current: map } = useMap();

	const [markerCoordinates, setMarkerCoordinates] = useState(null);

	useEffect(() => {
		const geocoder_div = document.getElementById("geocoder");
		if (geocoder_div) {
			if (map) {
				const geocoder = new MapboxGeocoder({
					accessToken: import.meta.env.VITE_MAP_BOX_PROVIDER_ACCESS_TOKEN,
					placeholder: "Search with place name, coordinates",
					marker: false,
					localGeocoder: coordinatesGeocoder,
				});
				geocoder.on("result", (selected) => {
					console.log(selected);
					setMarkerCoordinates({
						longitude: selected?.result?.center?.[0],
						latitude: selected?.result?.center?.[1],
					});
				});
				geocoder_div.innerHTML = "";
				geocoder_div.appendChild(geocoder.onAdd(map));
			}

			return () => {
				geocoder_div.innerHTML = "";
			};
		}
	}, [map]);

	return (
		<>
			{markerCoordinates && (
				<Marker
					longitude={markerCoordinates.longitude}
					latitude={markerCoordinates.latitude}
					anchor="bottom"
				/>
			)}
			<div
				id="geocoder"
				style={{
					position: "absolute",
					top: 0,
					left: "36px",
					marginLeft: "20px",
					marginTop: "10px",
					display: "block",
					width: "100%",
					maxWidth: "300px",
				}}
			></div>
		</>
	);
}

export default MapGeocoder;
