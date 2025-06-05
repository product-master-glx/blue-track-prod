import { Layer, useMap, Popup } from "react-map-gl/maplibre";
import {
	boundingBoxCoordinatesToZoomAtom,
	currentPondsToShowAccordingToCountAtom,
	sateliteViewAtom,
} from "@/jotai/index";
import { useAtomValue, useAtom } from "jotai";
import { useEffect, useState } from "react";

const pondTypeMap = {
	1: "Shrimp",
	2: "Non-Shrimp",
};

function PondPopup({ feature, onClose }) {
	const { properties } = feature;

	const acreage = properties.acreage?.toFixed(2);
	const doc = properties.doc || 0;
	console.log("lmao", acreage);
	const pondType = pondTypeMap[properties.pond_type] || `Type ${properties.pond_type}`;
	const centroid = JSON.parse(properties.centroid);
	const [lng, lat] = centroid;

	const gmapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

	return (
		<Popup
			longitude={lng}
			latitude={lat}
			onClose={onClose}
			closeOnClick={false}
			maxWidth="300px"
		>
			<div
				// onMouseEnter={() => setIsPopupHovered(true)}
				// onMouseLeave={() => {
				// 	setIsPopupHovered(false);
				// 	onClose();
				// }}
				className="text-sm space-y-2 text-black"
			>
				<div>
					<strong>Pond Type:</strong> {pondType}
				</div>
				<div>
					<strong>Acreage:</strong> {acreage} acres
				</div>
				{pondType === "Shrimp" && (
					<div>
						<strong>Latest DOC:</strong> {doc}
					</div>
				)}
				<div>
					<a
						href={gmapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 hover:text-white"
					>
						Open in Google Maps
					</a>
				</div>
			</div>
		</Popup>
	);
}
function MapLayer({ MAP_LAYER_ID, MAP_SOURCE_ID }) {
	const { current: map } = useMap();
	const boundingBoxCoordinatesToZoom = useAtomValue(boundingBoxCoordinatesToZoomAtom);
	const CURRENT_PONDS_TO_SHOW_VALUE = useAtomValue(currentPondsToShowAccordingToCountAtom);
	const [sateliteView] = useAtom(sateliteViewAtom);
	const [hoveredFeature, setHoveredFeature] = useState(null);
	// const [isPopupHovered, setIsPopupHovered] = useState(false);

	console.log("CURRENT_PONDS_TO_SHOW_VALUE", CURRENT_PONDS_TO_SHOW_VALUE);
	console.log("map layer id in maplayer comp", MAP_LAYER_ID);
	useEffect(() => {
		if (map && boundingBoxCoordinatesToZoom) {
			map.fitBounds(boundingBoxCoordinatesToZoom, {
				animate: false,
				maxZoom: 9,
				minZoom: 3,
			});
		}

		map.on("mousemove", "ponds-polygons_centroids_centroid", (e) => {
			console.log("its triggered");
			if (e.features.length > 0) {
				const pondFeature = e.features[0];
				// Your hover logic for pond here, e.g. show popup or highlight
				console.log("Hover pond:", pondFeature);
				setHoveredFeature(e.features[0]);
			}
		});

		map.on("mouseleave", "ponds-polygons_centroids_centroid", () => {
			// Remove pond hover effect / popup here
			// setHoveredFeature(null);
		});
	}, [map, boundingBoxCoordinatesToZoom]);

	return (
		<>
			{hoveredFeature && (
				<PondPopup
					feature={hoveredFeature}
					onClose={() => setHoveredFeature(null)}
					// setIsPopupHovered={setIsPopupHovered}
				/>
			)}

			{MAP_SOURCE_ID.includes("centroid") && (
				<Layer
					{...{
						id: MAP_LAYER_ID + "_centroid",
						type: "circle",
						source: MAP_SOURCE_ID,
						interactive: true,
						paint: {
							"circle-radius": 6,
							"circle-color": [
								"case",
								["==", ["get", "pond_type"], 1],
								sateliteView ? "#1E90FF" : "#1E90FF",
								["==", ["get", "pond_type"], 2],
								sateliteView ? "#32CD32" : "#32CD32",
								"#FFD700",
							],
							"circle-stroke-color": "#000",
							"circle-stroke-width": 1,
						},
					}}
				/>
			)}
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
