import endpoints from "@/constants/endpoints";
import request_handler from "../request.handler";
import * as turf from "@turf/turf";
import { getDefaultStore } from "jotai";
import {
	boundingBoxCoordinatesToZoomAtom,
	currentHighestCountRegionInsightAtom,
	currentOrderDataAtom,
	geoJSONCurrentlyBeingDisplayedAtom,
	metaDataForOrderAtom,
	showLoadingScreenAtom,
} from "@/jotai/index";
import maplibregl from "maplibre-gl";
import { colorGradientInsight } from "@/constants/index";

// const MAXLIMITFORPONDS = 5000;

// const getNextBatchesInBackground = async (data, batches) => {
// 	console.log("Getting batches", batches);
// 	const promises = [];

// 	for (let index = 1; index <= batches; index++) {
// 		promises.push(
// 			request_handler({
// 				method: "post",
// 				endpoint: endpoints.glxBlue.gJSon,
// 				data: {
// 					orderId: data.orderId,
// 					insightId: data.insightId,
// 					limit: MAXLIMITFORPONDS,
// 					offset: index,
// 				},
// 			})
// 		);
// 	}
// 	const batchResponse = await Promise.allSettled(promises);

// 	const store = getDefaultStore();
// 	const current_fsm = store.get(geoJSONCurrentlyBeingDisplayedAtom);

// 	let final_fsm_features = [];
// 	let fsm = {};
// 	if (current_fsm) {
// 		fsm = { ...current_fsm };
// 		if (current_fsm?.features?.length > 0) {
// 			final_fsm_features = [...current_fsm.features];
// 		}
// 	}

// 	batchResponse.map((response) => {
// 		if (response.status === "fulfilled") {
// 			const fsmData = response.value.fsm;
// 			fsmData?.features?.map((feature) => {
// 				const currentPondCount = Object.values(feature.properties?.count || {}).pop();
// 				feature.properties.count_status = currentPondCount;
// 			});
// 			final_fsm_features = [...final_fsm_features, ...fsmData.features];
// 		}
// 	});
// 	console.log("final_fsm_features length", final_fsm_features.length);

// 	fsm.features = final_fsm_features;

// 	console.log("After loading batches", fsm);
// 	store.set(geoJSONCurrentlyBeingDisplayedAtom, fsm);
// };

// Get the data required to show for the order details

const GetRegionData = async (
	data,
	SET_MASTER_GEO_JSON,
	SET_GEOJSON_CURRENTLY_BEING_DISPLAYED,
	_SET_MAP_ZOOM_ATOM,
	SET_MAP_CENTER_ATOM,
	SET_METADATA_FOR_ORDER,
	SET_CURRENT_ORDER_DATA,
	sateliteView,
	SET_CENTROID_GEOJSON
	// SET_FSM_DATA_FOR_CURRENT_ORDER,
	// SET_WQA_DATA_FOR_CURRENT_ORDER
) => {
	const store = getDefaultStore();
	const current_order = store.get(currentOrderDataAtom);
	// console.log("data region props",data);

	if (
		current_order?.orderId == data.orderId &&
		current_order?.mandalId == data.mandalId &&
		current_order?.villageId == data.villageId
	) {
		console.log("Already have the data");
		return;
	}
	store.set(geoJSONCurrentlyBeingDisplayedAtom, null);
	store.set(metaDataForOrderAtom, null);
	store.set(currentOrderDataAtom, "");
	store.set(showLoadingScreenAtom, true);
	// Get the GeoJSON data containing FSM (farms status management) using order id and insight id and access token
	const request_data = {
		district_slug: data.orderId,
		mandal_slug: data.mandalId ?? undefined,
		village_slug: data.villageId ?? undefined,
	};
	let current_aoi = "";

	if (request_data.district_slug) {
		current_aoi = "district";
		if (request_data.mandal_slug) {
			current_aoi = "mandal";
			if (request_data.village_slug) {
				current_aoi = "village";
			}
		}
	}

	console.log("request_data", request_data);

	// "district_slug": "east-godavari-bcd0f51b-b2f6-46fa-bc6d-af0c6a86c6a5",
	// "mandal_slug":"maredumilli-368c2451-b38a-430d-974c-1e14601ff9a7"
	// 		"village_slug": "elivada-9421fa51-bbde-40ff-acdf-7878c28b0fb8"
	const getAllData = request_handler({
		method: "post",
		endpoint: endpoints.userOrdersMetaData,
		data: request_data,
	});

	const AllDataForOrder = await Promise.allSettled([getAllData]);

	// console.log(AllDataForOrder[0]?.value?.data, "AllDataForOrder");

	const finalGJSON = {};
	// Update the master geo json with order
	let mandalsData = AllDataForOrder[0].value.data.mandals;
	const metaData = AllDataForOrder[0].value.data.meta_data;
	const orderInfo = AllDataForOrder[0].value.data.order_details;
	const aoiDetails = AllDataForOrder[0].value.data.aoi_details;
	// const pondsData = AllDataForOrder[0].value.data.ponds;

	let currentHighestCountRegionInsight = 0;
	console.log("mandalsData", mandalsData);
	mandalsData?.map(function (feature) {
		if (feature.meta.total_running_acreage > currentHighestCountRegionInsight) {
			currentHighestCountRegionInsight = feature.meta.total_running_acreage;
		}
	});

	mandalsData?.map((feature) => {
		const currentPondCount = Object.values(feature.meta?.count_summary || {}).pop();
		feature.meta.count_status = currentPondCount;
		feature.meta.color = sateliteView
			? `${colorGradientInsight.getColor(
					feature.meta.total_running_acreage
						? Math.round(
								(feature.meta.total_running_acreage /
									currentHighestCountRegionInsight) *
									100
						  ) + 1
						: 1
			  )}33`
			: `${colorGradientInsight.getColor(
					feature.meta.total_running_acreage
						? Math.round(
								(feature.meta.total_running_acreage /
									currentHighestCountRegionInsight) *
									100
						  ) + 1
						: 1
			  )}`;
		// console.log("feature.meta.color", feature.meta.color);
		feature.meta.mandal = true;
		feature.meta.village = false;
		if (data.mandalId) {
			feature.meta.current_selected = feature?.slug === String(data.mandalId);
			if (feature.meta?.current_selected) {
				orderInfo.name = feature.name;
			}
		}
	});

	mandalsData = mandalsData.filter((a) => !a.meta.current_selected);

	const coordinateArray = [...mandalsData].map((mandal) => JSON.parse(mandal.polygon));

	let boundingBox, bigBbox;
	let bigBboxPolygon;

	if (!data) {
		boundingBox = turf.polygon(JSON.parse(data.farmAndPondInfo.aoi.polygon).coordinates);
	} else {
		// boundingBox = turf.envelope(mandalsData); // Old version
		boundingBox = coordinateArray.map((polygon) => turf.envelope(polygon));
		// Flatten all bounding boxes into one array of coordinates
		const allCoordinates = [].concat(
			...boundingBox.map((bbox) => [
				[bbox.bbox[0], bbox.bbox[1]],
				[bbox.bbox[2], bbox.bbox[3]],
			])
		);

		// Calculate one big bounding box that encompasses all coordinates
		bigBbox = turf.bbox({
			type: "FeatureCollection",
			features: allCoordinates.map((coord) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: coord,
				},
			})),
		});

		// Optionally, convert the bbox to a polygon
		bigBboxPolygon = turf.bboxPolygon(bigBbox);
	}

	finalGJSON.features = mandalsData;

	if (AllDataForOrder[0].value.data.villages) {
		const villagesData = AllDataForOrder[0].value.data.villages;
		let selectedVillage;
		currentHighestCountRegionInsight = 0;

		villagesData.map(function (feature) {
			if (feature.meta.total_running_acreage > currentHighestCountRegionInsight) {
				currentHighestCountRegionInsight = feature.meta.total_running_acreage;
			}
		});

		console.log("All Villages", villagesData);
		villagesData.map((feature) => {
			console.log("All Villages feature", feature);
			const currentPondCount = feature.meta?.total_ponds ?? 0;
			feature.meta.count_status = currentPondCount;

			feature.meta.village_slug = feature.slug;
			feature.meta.color = sateliteView
				? `${colorGradientInsight.getColor(
						feature.meta.total_running_acreage
							? Math.round(
									(feature.meta.total_running_acreage /
										currentHighestCountRegionInsight) *
										100
							  ) + 1
							: 1
				  )}33`
				: `${colorGradientInsight.getColor(
						feature.meta.total_running_acreage
							? Math.round(
									(feature.meta.total_running_acreage /
										currentHighestCountRegionInsight) *
										100
							  ) + 1
							: 1
				  )}`;
			feature.meta.village_name = feature.name;
			feature.meta.mandal = false;
			feature.meta.village = true;
			// console.log("data",data);
			if (feature.slug) {
				// feature.meta.current_selected = feature.slug === data.villageId;
				feature.meta.current_selected = feature.slug === data.villageId;
				if (feature.meta.current_selected) {
					selectedVillage = { ...feature };
					orderInfo.name = feature.meta.name;
				}
			}
		});

		let villageBoundingBox;
		if (data.villageId && selectedVillage?.slug) {
			// const villageCoords = JSON.parse(selectedVillage.polygon);
			// villageBoundingBox = turf.envelope(villageCoords);
			// } else {
			// boundingBox = turf.envelope(villagesData);
			const villageCoordsArray = [...villagesData].map((village) =>
				JSON.parse(village.polygon)
			);

			// boundingBox = turf.envelope(mandalsData); // Old version
			villageBoundingBox = villageCoordsArray.map((polygon) => turf.envelope(polygon));
			// Flatten all bounding boxes into one array of coordinates
			const allCoordinates = [].concat(
				...villageBoundingBox.map((bbox) => [
					[bbox.bbox[0], bbox.bbox[1]],
					[bbox.bbox[2], bbox.bbox[3]],
				])
			);

			// Calculate one big bounding box that encompasses all coordinates
			const villageBigBbox = turf.bbox({
				type: "FeatureCollection",
				features: allCoordinates.map((coord) => ({
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: coord,
					},
				})),
			});

			// Optionally, convert the bbox to a polygon
			// villageBigBboxPolygon = turf.bboxPolygon(bigBbox);
			bigBboxPolygon = turf.bboxPolygon(villageBigBbox);
		}
		finalGJSON.features = [...finalGJSON.features, ...villagesData];
	}

	if (AllDataForOrder[0].value.data.ponds) {
		console.log("Ponds Data>>>>>>>>>>>>>>>>>>>>>>>>>", AllDataForOrder[0].value.data.ponds);
		const pondsData = AllDataForOrder[0].value.data.ponds;
		let selectedPond;
		currentHighestCountRegionInsight = 0;
		console.log("selectedPond", selectedPond);

		// Calculate the highest acreage for ponds
		pondsData.map(function (feature) {
			if (feature.acreage > currentHighestCountRegionInsight) {
				currentHighestCountRegionInsight = feature.acreage;
			}
		});

		// Process each pond feature
		pondsData.map((feature) => {
			console.log("Processing Pond Feature", feature);

			feature.meta = feature.meta || {}; // Ensure meta exists
			feature.meta.color = sateliteView
				? `${colorGradientInsight.getColor(
						feature.acreage
							? Math.round(
									(feature.acreage / currentHighestCountRegionInsight) * 100
							  ) + 1
							: 1
				  )}33`
				: `${colorGradientInsight.getColor(
						feature.acreage
							? Math.round(
									(feature.acreage / currentHighestCountRegionInsight) * 100
							  ) + 1
							: 1
				  )}`;
			feature.meta.pond_name = feature.name;
			feature.meta.mandal = false;
			feature.meta.village = false;
			feature.meta.pond = true;

			if (feature.polygon) {
				const polygon =
					typeof feature.polygon === "string"
						? JSON.parse(feature.polygon)
						: feature.polygon;
				const centroid = turf.centroid(polygon);
				feature.meta.centroid = centroid.geometry.coordinates;
			}

			// Mark the pond as selected only if data.pondId is provided
			if (data.pondId && feature.id) {
				feature.meta.current_selected = feature.id === data.pondId;
				if (feature.meta.current_selected) {
					selectedPond = { ...feature };
					orderInfo.name = feature.name;
				}
			}
		});

		// Add ponds to the final GeoJSON if a village is selected
		if (data.villageId && pondsData.length > 0) {
			console.log("Adding pond polygons to GeoJSON for village");
			finalGJSON.features = [...finalGJSON.features, ...pondsData];
		}
	}

	store.set(currentHighestCountRegionInsightAtom, currentHighestCountRegionInsight);

	// console.log(metaData?.Total, MAXLIMITFORPONDS);
	// if (metaData?.Total > MAXLIMITFORPONDS) {
	// 	getNextBatchesInBackground(data, Math.ceil(metaData?.Total / MAXLIMITFORPONDS) - 1);
	// }
	finalGJSON.features.map((feature) => {
		feature.meta.request_data = request_data;
	});
	console.log("GEMO", finalGJSON.features);
	if (data.mandalId) {
		console.log("finalGJSON for mandal before filtering", finalGJSON);
		//Remove Empty Ponds
		finalGJSON.features = finalGJSON.features.filter(
			(a) => a.meta.village || a.meta.total_ponds > 0 || a.meta.pond
		);
		console.log("finalGJSON for mandal after filtering", finalGJSON);
	}
	if (data.villageId) {
		finalGJSON.features = finalGJSON.features.filter(
			(a) => a.meta.village || a.meta.total_ponds > 0 || a.meta.pond
		);
		console.log("finalGJSON for village", finalGJSON);
	}

	const centroidGeoJson = {
		type: "FeatureCollection",
		features: finalGJSON.features
			.filter((item) => item.meta && item.meta.pond && Array.isArray(item.meta.centroid))
			.map((item) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: item.meta.centroid,
				},
				properties: {
					name: item.name,
					id: item.id,
					slug: item.slug,
					created_at: item.created_at,
					updated_at: item.updated_at,
					status: item.status,
					acreage: item.acreage,
					pond_type: item.pond_type,
					predicted_water: item.predicted_water,
					pond: item.meta.pond || false,
					current_aoi,
					...item.meta,
				},
			})),
	};

	// Set the centroid geojson for use in the frontend
	SET_CENTROID_GEOJSON(centroidGeoJson);

	finalGJSON.features = finalGJSON.features.filter((item) => !item.meta?.pond);

	SET_MASTER_GEO_JSON(finalGJSON);
	// Show the current GEO Json directly
	console.log(current_aoi);
	const geoJson = {
		type: "FeatureCollection",
		features: finalGJSON.features.map((item) => ({
			type: "Feature",
			geometry: typeof item.polygon === "string" ? JSON.parse(item.polygon) : item.polygon,
			properties: {
				name: item.name,
				id: item.id,
				slug: item.slug,
				created_at: item.created_at,
				updated_at: item.updated_at,
				status: item.status,
				acreage: item.acreage,
				pond_type: item.pond_type,
				predicted_water: item.predicted_water,
				pond: item.meta.pond || false,
				current_aoi,
				...item.meta,
			},
		})),
	};
	SET_GEOJSON_CURRENTLY_BEING_DISPLAYED(geoJson);

	const centroid = turf.centroid(bigBboxPolygon);
	console.log(centroid, "centroid");
	// Zoom in to the coordinates
	SET_MAP_CENTER_ATOM([centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]]);
	console.log(finalGJSON, "MJ");
	// Set the meta data
	SET_METADATA_FOR_ORDER(metaData);
	// Set the zoom
	// SET_MAP_ZOOM_ATOM(15);
	SET_CURRENT_ORDER_DATA({
		...orderInfo,
		...aoiDetails,
		orderId: data.orderId,
		insightId: data.insightId,
		mandalId: data.mandalId,
		villageId: data.villageId,
	});

	const bounds = new maplibregl.LngLatBounds([
		[bigBboxPolygon.bbox[0], bigBboxPolygon.bbox[1]],
		[bigBboxPolygon.bbox[2], bigBboxPolygon.bbox[3]],
	]);

	store.set(boundingBoxCoordinatesToZoomAtom, bounds);

	store.set(showLoadingScreenAtom, false);
};

export default GetRegionData;
