import { Layer, useMap } from "react-map-gl/maplibre";
import {
	boundingBoxCoordinatesToZoomAtom,
	currentPondsToShowAccordingToCountAtom, sateliteViewAtom
} from "@/jotai/index";
import { useAtomValue, useAtom } from "jotai";
import { useEffect } from "react";

function MapLayer({ MAP_LAYER_ID, MAP_SOURCE_ID }) {
	const { current: map } = useMap();
	const boundingBoxCoordinatesToZoom = useAtomValue(boundingBoxCoordinatesToZoomAtom);
	const CURRENT_PONDS_TO_SHOW_VALUE = useAtomValue(currentPondsToShowAccordingToCountAtom);
	const [sateliteView] = useAtom(sateliteViewAtom);
	console.log("CURRENT_PONDS_TO_SHOW_VALUE", CURRENT_PONDS_TO_SHOW_VALUE);
	useEffect(() => {
		if (map && boundingBoxCoordinatesToZoom) {
			map.fitBounds(boundingBoxCoordinatesToZoom, {
				animate: false,
				maxZoom: 9,
				minZoom: 3,
			});
		}
	}, [map, boundingBoxCoordinatesToZoom]);

	return (
		<>
			<Layer
				{...{
					id: MAP_LAYER_ID,
					type: "fill",
					source: MAP_SOURCE_ID,
					paint: {
						"fill-color": [
							"case",
							[
								"all",
								["==", ["get", "total_ponds"], 0],
								["==", ["get", "mandal"], true],
							],
							"#FF0000",
							[
								"all",
								["==", ["get", "total_ponds"], 0],
								["==", ["get", "village"], true],
							],
							sateliteView ? "#ffcc001A" : "#ffcc00",
							[
								"all",
								["==", ["get", "current_selected"], false],
								["==", ["get", "current_aoi"], "mandal"],
								["==", ["get", "mandal"], true],
							],
							"#fc8803",
							[
								"all",
								["==", ["get", "current_selected"], false],
								["==", ["get", "current_aoi"], "village"],
								["==", ["get", "village"], true],
							],
							sateliteView ? "#2DFF001A" : "#2DFF00",
							["to-color", ["get", "color"]],
						],
						"fill-outline-color": "#000000",
						"fill-opacity": [
							"case",
							[
								"all",
								["==", ["get", "total_ponds"], 0],
								["==", ["get", "mandal"], true],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyMandals"), true],
							],
							0.1,
							[
								"all",
								["==", ["get", "total_ponds"], 0],
								["==", ["get", "village"], true],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyVillages"), true],
							],
							1,
							[
								"all",
								[">", ["get", "total_ponds"], 0],
								["==", ["get", "mandal"], true],
								["==", ["get", "current_selected"], false],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherMandals"), true],
							],
							0.5,
							[
								"all",
								["==", ["get", "total_ponds"], 0],
								["==", ["get", "village"], true],
								["==", ["get", "current_selected"], false],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyVillages"), true],
							],
							0.1,
							[
								"all",
								[">", ["get", "total_ponds"], 0],
								["==", ["get", "village"], true],
								["==", ["get", "current_selected"], false],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherVillages"), true],
							],
							1,
							[
								"all",
								[">", ["get", "total_ponds"], 0],
								["==", ["get", "village"], true],
								["==", ["get", "current_aoi"], "village"],
								["==", ["get", "current_selected"], false],
								[
									"==",
									CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherVillages"),
									false,
								],
							],
							0,
							[
								"all",
								[">", ["get", "total_ponds"], 0],
								["!=", ["get", "current_selected"], false],
							],
							1,
							[
								"all",
								[">", ["get", "total_ponds"], 0],
								["==", ["get", "current_selected"], false],
								["==", ["get", "village"], true],
							],
							1,
							0,
						],
					},
				}}
			/>
			<Layer
				{...{
					id: MAP_LAYER_ID + "_line",
					type: "line",
					source: MAP_SOURCE_ID,
					paint: {
						"line-color": [
							"case",
							["==", ["get", "current_selected"], true],
							"#ff0000",
							"#000000",
						],
						"line-width": [
							"case",
							["==", ["get", "current_selected"], true],
							3,
							["==", ["get", "village"], true],
							2,
							1,
						],
						"line-opacity": [
							"case",
							[
								"any",
								[
									"all",
									["==", ["get", "total_ponds"], 0],
									["==", ["get", "mandal"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyMandals"),
										true,
									],
								],
								[
									"all",
									[">", ["get", "total_ponds"], 0],
									["==", ["get", "mandal"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherMandals"),
										true,
									],
								],
								[
									"all",
									["==", ["get", "total_ponds"], 0],
									["==", ["get", "village"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyVillages"),
										true,
									],
								],
								[
									"all",
									[">", ["get", "total_ponds"], 0],
									["==", ["get", "current_selected"], false],
									["==", ["get", "village"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherVillages"),
										true,
									],
								],
								[
									"all",
									[">", ["get", "total_ponds"], 0],
									["!=", ["get", "current_selected"], false],
								],
								[
									"all",
									[">", ["get", "total_ponds"], 0],
									["==", ["get", "current_selected"], false],
									["==", ["get", "village"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherVillages"),
										true,
									],
								],
							],
							1,
							[
								"all",
								[">", ["get", "total_ponds"], 0],
								["==", ["get", "village"], true],
								["==", ["get", "current_selected"], false],
								[
									"==",
									CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherVillages"),
									false,
								],
							],
							0,
							0,
						],
					},
				}}
			/>
		</>
	);
}

export default MapLayer;
