import { useMap } from "react-map-gl/maplibre";
import { useEffect } from "react";
import { mapZoomAtom } from "@/jotai/index";
import { useSetAtom } from "jotai";

function ChangeView({ center }) {
	const { current: map } = useMap();
	const setMapZoom = useSetAtom(mapZoomAtom);

	useEffect(() => {
		if (!map) return;

		// Update center while preserving current zoom
		const updateCenter = () => {
			const currentZoom = map.getZoom();
			console.log("Updating center (keeping zoom at", currentZoom);

			map.flyTo({
				center: [Number(center[0]), Number(center[1])],
				zoom: currentZoom,
				essential: true,
				duration: 1000,
			});
		};

		// Sync zoom changes to global state
		const handleZoomEnd = () => {
			const newZoom = map.getZoom();
			console.log("Zoom changed to:", newZoom);
			setMapZoom(newZoom);
		};

		if (map.loaded()) {
			updateCenter();
			map.on("zoomend", handleZoomEnd); // Listen for zoom changes
		} else {
			map.once("load", () => {
				updateCenter();
				map.on("zoomend", handleZoomEnd);
			});
		}

		// Cleanup
		return () => {
			map.off("zoomend", handleZoomEnd);
		};
	}, [map, center, setMapZoom]);

	return null;
}

export default ChangeView;
