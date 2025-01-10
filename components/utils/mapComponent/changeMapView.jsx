import { useMap } from "react-map-gl/maplibre";
import { useEffect } from "react";

/**
 * This function sets the center and zoom for the map using the hook
 */
function ChangeView({
	center, //Center to zoom in on map
	zoom, // Zoom in number
}) {
	const { current: map } = useMap();

	useEffect(() => {
		if (map) {
			map.flyTo({
				center,
				zoom,
				essential: true,
			});
		}
	}, [map, center, zoom]);

	return null;
}

export default ChangeView;
