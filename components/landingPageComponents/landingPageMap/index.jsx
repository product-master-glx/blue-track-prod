import { useEffect, useMemo, useRef } from "react";
import { useAtomValue } from "jotai";
import { listOfAllOrderDataAtom, mapCenterAtom, mapZoomAtom } from "@/jotai/index";
import { useNavigate } from "react-router-dom";
import { polygon, union } from "@turf/turf";
import ReusableMapComponent from "../../utils/mapComponent/ReusableMapComponent";
import LandingSideBox from "../landingSideBox";
import { colorGradientInsight } from "@/constants/index";

function LandingPageMapContainer() {
	const ALL_ORDER_DATA = useAtomValue(listOfAllOrderDataAtom);
	const MAP_ZOOM_ATOM = useAtomValue(mapZoomAtom);
	const MAP_CENTER_ATOM = useAtomValue(mapCenterAtom);
	const navigate = useNavigate();
	const mapRef = useRef(null);

	const boundingBoxCoordinatesToZoom = useMemo(() => {
		let finalPolygon;
		ALL_ORDER_DATA?.forEach((item) => {
			const coordinates = item?.insights?.[0]?.AOI?.polygon?.coordinates;
			if (item.status === "active" && coordinates?.[0]) {
				finalPolygon = finalPolygon
					? union(finalPolygon, polygon(coordinates))
					: polygon(coordinates);
			}
		});
		return finalPolygon?.geometry?.coordinates?.[0];
	}, [ALL_ORDER_DATA]);

	useEffect(() => {
		const map = mapRef.current?.getMap();
		if (map && boundingBoxCoordinatesToZoom) {
			map.fitBounds(boundingBoxCoordinatesToZoom, { padding: 20 });
		}
	}, [boundingBoxCoordinatesToZoom]);

	const maxTotalActiveAcreage = useMemo(() => {
		return (
			ALL_ORDER_DATA?.reduce((max, item) => {
				const totalAcreage = item.order?.meta?.[0]?.meta?.total_running_acreage ?? 0;
				return Math.max(max, totalAcreage);
			}, 0) + 1
		);
	}, [ALL_ORDER_DATA]);

	const gradientArray = useMemo(() => colorGradientInsight.getColors(), []);

	const geoJsonData = useMemo(() => {
		const features = ALL_ORDER_DATA?.map((item) => {
			const polygonData = item?.order?.aoi?.polygon;

			if (typeof polygonData === "string") {
				try {
					item.order.aoi.polygon = JSON.parse(polygonData);
				} catch (error) {
					console.error("Error parsing polygon data:", error);
					return null;
				}
			}

			const coordinates = item?.order?.aoi?.polygon?.coordinates;
			if (!coordinates) {
				return null;
			}

			const totalAcreage = item?.order?.meta?.[0]?.meta?.total_running_acreage;
			const avgDoc = item?.order?.meta?.[0]?.meta?.avg_doc;
			const name = item?.order?.aoi?.name ?? "Unknown Area";
			const locked = item.locked;

			const colorIndex = Math.round(
				(totalAcreage / maxTotalActiveAcreage) * (gradientArray.length - 1)
			);
			const color =
				gradientArray[Math.min(Math.max(colorIndex, 0), gradientArray.length - 1)];

			return {
				type: "Feature",
				geometry: {
					type: "Polygon",
					coordinates,
				},
				properties: {
					color,
					itemId: item.id ?? item?.order?.id ?? "Unknown",
					name,
					total_running_acreage: totalAcreage,
					avg_doc: avgDoc,
					locked,
					slug: item?.order?.aoi?.slug,
					total_ponds: item?.order?.meta?.[0]?.meta?.total_ponds,
				},
			};
		}).filter(Boolean);

		return {
			type: "FeatureCollection",
			features: features || [],
		};
	}, [ALL_ORDER_DATA, gradientArray, maxTotalActiveAcreage]);

	const handleFeatureClick = (e) => {
		const feature = e.features[0];
		if (feature && feature.properties) {
			navigate(`/region-insight/${feature.properties.itemId}`);
		}
	};

	return (
		<ReusableMapComponent
			center={MAP_CENTER_ATOM}
			zoom={MAP_ZOOM_ATOM}
			mapRef={mapRef}
			geoJsonData={geoJsonData}
			maxTotalActiveAcreage={maxTotalActiveAcreage}
			gradientArray={gradientArray}
			legendTitle="Active Acreage"
			showLegend
			showSearch
			enableTooltip
			onFeatureClick={handleFeatureClick}
		>
			<LandingSideBox />
		</ReusableMapComponent>
	);
}

export default LandingPageMapContainer;
