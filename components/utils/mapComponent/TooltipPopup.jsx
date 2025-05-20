import { useMemo, useEffect, useRef, useCallback } from "react";
import { centroid, polygon } from "@turf/turf";
//multiPolygon
import { Popup } from "maplibre-gl";
import { renderToString } from "react-dom/server";
import { useMap } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

// const openInGoogleMaps = (longitude, latitude) => {
// 	const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
// 	window.open(googleMapsUrl, "_blank");
// };

function TooltipHTML({ properties, coordinates }) {
	const isLandingPage = window.location.pathname === "/";
	const isRegionInsightPage = window.location.pathname.includes("/region-insight");
	const farmCentroid = useMemo(() => {
		if (!coordinates) return "";
		const reversedCoords = [...coordinates].reverse().map((c) => c.toFixed(4));
		return `${reversedCoords[0]} (Lat), ${reversedCoords[1]} (Long)`;
	}, [coordinates]);
	const propertiesToShow = useMemo(() => {
		const dataToShow = [];
		if (properties?.name) {
			dataToShow.push({
				title:
					properties.mandal == undefined
						? "Name"
						: properties.mandal
						? "Mandal Name"
						: properties.pond
						? "Name"
						: "Village Name",
				value: properties.name,
			});
		}
		if (properties.village && properties?.request_data) {
			const data = JSON.parse(properties.request_data);
			dataToShow.push({
				title: "Mandal Name",
				value: capitalizeFirstLetter(data.mandal_slug.split("-")[0]),
			});
		}
		if (properties?.total_ponds !== undefined) {
			dataToShow.push({ title: "Ponds", value: properties.total_ponds });
		}
		if (properties?.villages_count !== undefined) {
			dataToShow.push({ title: "Villages", value: properties.villages_count });
		}
		if (properties.locked) {
			return dataToShow;
		}
		if (isLandingPage && properties.total_running_acreage !== undefined) {
			dataToShow.push({
				title: "Active Acreage",
				value: `${properties.total_running_acreage.toFixed(2)} acres`,
			});
		}
		if (isLandingPage && properties.avg_doc !== undefined) {
			dataToShow.push({ title: "Average DoC", value: properties.avg_doc.toFixed(2) });
		}
		if (properties.pond) {
			dataToShow.push({ title: "Area", value: properties.acreage.toFixed(2) });
		}
		// if (isRegionInsightPage) {
		// 	dataToShow.push({ title: "Coordinates", value: farmCentroid });
		// }
		return dataToShow;
	}, [properties, isLandingPage, isRegionInsightPage, farmCentroid]);
	return (
		<div className="text-sm text-black font-semibold text-wrap">
			{propertiesToShow.map((property, index) => (
				<div key={index}>
					<span className="font-medium" style={{ textTransform: "capitalize" }}>
						{property.title}:
					</span>
					{property.value}
				</div>
			))}
			{properties.pond && (
				<button
					// onClick={() => openInGoogleMaps(longitude, latitude)}
					style={{
						marginTop: "10px",
						padding: "5px 10px",
						background: "#007BFF",
						color: "#fff",
						border: "none",
						borderRadius: "3px",
						cursor: "pointer",
					}}
				>
					Open in Google Maps
				</button>
			)}
		</div>
	);
}

function TooltipPopup({ MAP_LAYER_ID }) {
	const popupRef = useRef(true);
	const { current: map } = useMap();
	const navigate = useNavigate();
	console.log("MAP_LAYER_ID:", MAP_LAYER_ID);
	const handlePopupDisplay = useCallback(
		(e, popup) => {
			const geometryType = e.features[0].geometry.type.toLowerCase();
			const coordinates = centroid(
				geometryType === "polygon"
					? polygon(e.features[0].geometry.coordinates)
					: // : multiPolygon(e.features[0].geometry.coordinates)
					  polygon(e.features[0].geometry.coordinates)
			).geometry.coordinates.slice();
			console.log(
				"--------+++++++++++----------e.features[0]---------++++++++------------",
				e.features[0]
			);
			const properties = e.features[0].properties;
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}
			if (!properties.current_selected) {
				popup
					.setLngLat(coordinates)
					.setHTML(
						renderToString(
							<TooltipHTML properties={properties} coordinates={coordinates} />
						)
					)
					.addTo(map.getMap());
			}
		},
		[map]
	);

	const handleFeatureClick = useCallback(
		(e) => {
			const properties = e.features[0].properties;
			if (properties.locked) return;
			// const coords = e.features[0].geometry.coordinates;
			// // const coords = e.features[0].geometry.coordinates;

			// coords.forEach((ring, index) => {
			// 	console.log(`Ring ${index}: length = ${ring.length}`);
			// 	console.log(`Ring ${index} first point = ${JSON.stringify(ring[0])}`);
			// 	console.log(`Ring ${index} last point = ${JSON.stringify(ring[ring.length - 1])}`);
			// });

			// const turfPoly = polygon(coords); // Make sure this includes ALL rings
			// const coordinates = centroid(turfPoly).geometry.coordinates
			// 	.slice()
			// 	.reverse()
			// 	.map((c) => c.toFixed(4))
			// .join(", ");

			const geometry = e.features[0].geometry;

			let rings = [];

			if (geometry.type === "Polygon") {
				rings = geometry.coordinates;
			}
			// else if (geometry.type === "MultiPolygon") {
			// 	// Flatten all rings from all polygons
			// 	geometry.coordinates.forEach(polygonRings => {
			// 		rings.push(...polygonRings);
			// 	});

			// }
			else {
				throw new Error("Unsupported geometry type: " + geometry.type);
			}

			// Ensure all rings are closed and valid
			const cleanedRings = rings
				.map((ring, idx) => {
					if (ring.length < 3) {
						console.warn(`Skipping ring ${idx} — not enough points.`);
						return null;
					}

					const first = ring[0];
					const last = ring[ring.length - 1];
					const isClosed = first[0] === last[0] && first[1] === last[1];
					const closedRing = isClosed ? ring : [...ring, first];

					if (closedRing.length < 4) {
						console.warn(`Skipping ring ${idx} — less than 4 points after closing.`);
						return null;
					}

					return closedRing;
				})
				.filter(Boolean);

			if (cleanedRings.length === 0) {
				throw new Error("No valid rings to create polygon.");
			}

			// Construct polygon and compute centroid
			const turfPoly = polygon(cleanedRings);
			const coordinates = centroid(turfPoly)
				.geometry.coordinates.slice()
				.reverse()
				.map((c) => c.toFixed(4))
				.join(", ");

			// const coordinates = centroid(polygon(e.features[0].geometry.coordinates))
			// 	.geometry.coordinates.slice()
			// 	.reverse()
			// 	.map((c) => c.toFixed(4))
			// 	.join(", ");
			navigator.permissions.query({ name: "clipboard-write" }).then(async (result) => {
				if (result.state === "granted" || result.state === "prompt") {
					try {
						await navigator.clipboard.writeText(coordinates);
					} catch (err) {
						console.error("Failed to copy: ", err);
					}
				}
			});
			if (properties.total_ponds > 0 && properties.slug) {
				const requestData = JSON.parse(properties?.request_data || "{}");
				let mandalURL = `/region-insight`;
				if ((properties.mandal || properties.village) && requestData.district_slug) {
					mandalURL += `/${requestData.district_slug}`;
				}
				if (properties.village && requestData.mandal_slug) {
					mandalURL += `/${requestData.mandal_slug}`;
				}
				navigate(`${mandalURL}/${properties.slug}`);
			}
		},
		[navigate]
	);

	useEffect(() => {
		if (map && popupRef.current) {
			const popup = new Popup({ closeButton: false, closeOnClick: false });
			map.on("mouseenter", MAP_LAYER_ID, (e) => {
				map.getCanvas().style.cursor = "pointer";
				handlePopupDisplay(e, popup);
			});
			map.on("mouseleave", MAP_LAYER_ID, () => {
				map.getCanvas().style.cursor = "";
				popup.remove();
			});
			map.on("click", MAP_LAYER_ID, handleFeatureClick);
			popupRef.current = false;

			return () => {
				map.off("mouseenter", MAP_LAYER_ID);
				map.off("mouseleave", MAP_LAYER_ID);
				map.off("click", MAP_LAYER_ID);
				popup.remove();
			};
		}
	}, [map, MAP_LAYER_ID, handlePopupDisplay, handleFeatureClick]);

	return null;
}

export default TooltipPopup;
