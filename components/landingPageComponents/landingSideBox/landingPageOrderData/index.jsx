import { Stack } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	listOfFilteredOrderDataAtom,
	totalOrdersThatAreEitherInProcessedOrProcessingStateAtom,
} from "@/jotai/index";
import SearchBarForOrders from "../../searchBarForOrders";
import OrderCardElement from "./orderCardElement";
import { useEffect } from "react";

const styles = {
	customScrollbar: {
		"&::-webkit-scrollbar": {
			width: "10px",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#888",
			borderRadius: "5px",
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: "#555",
		},
	},
};

/**
 * This component shows the search bar, filters and
 * the filtered orders (in case of no filters, it will be all order data)
 */
function LandingPageOrderData() {
	const FILTERED_ORDER_DATA = useAtomValue(listOfFilteredOrderDataAtom);
	const SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE = useSetAtom(
		totalOrdersThatAreEitherInProcessedOrProcessingStateAtom
	);

	useEffect(() => {
		SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE(0);
		FILTERED_ORDER_DATA?.map(() => {
			// if (item.insights[0]?.status == "processed" || !item.insights[0]) {
			SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE(
				(TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE) =>
					TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE + 1
			);
			// }
		});
	}, [FILTERED_ORDER_DATA, SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE]);

	return (
		<>
			{/* Assuming SearchBar is a component you have */}
			<Stack
				direction="row"
				className="w-full"
				justifyContent="center"
				alignItems="center"
				spacing={1}
			>
				<SearchBarForOrders />
				{/* <FilterOrders /> */}
			</Stack>

			<Stack
				direction="column"
				spacing={2}
				alignItems="center"
				sx={{
					display: "flex",
					width: "100%",
					height: "100%",
					overflowY: "auto",
					mt: "5px",
					...styles.customScrollbar,
				}}
			>
				{FILTERED_ORDER_DATA?.map((item, index) => {
					let polygonParsed = item.order?.aoi?.polygon;
					// const polygonParsed = JSON.parse(item.order?.aoi?.polygon);
					if (typeof polygonParsed === "string") {
						try {
							polygonParsed = JSON.parse(polygonParsed);
						} catch (error) {
							console.log("error in ploygon data", error);
							return null;
						}
					}
					if (item.order?.id) {
						return (
							<OrderCardElement
								key={item.order?.id}
								index={index}
								orderID={item.order?.id}
								orderTitle={item.order?.aoi.name}
								status={item.order?.aoi.status}
								city="C"
								country="C"
								initialOrderStatus={item.order.status}
								runningPonds={item.order.meta[0]?.meta.running_ponds}
								averageDoC={item.order.meta[0]?.meta.avg_doc}
								numberOfPonds={item.order.meta[0]?.meta.total_ponds}
								lastInsightDate={item?.order.last_insight_date ?? "N.A"}
								regionCoordinates={polygonParsed?.coordinates}
								farmAndPondInfo={item.order}
								can_access={item.locked}
								running_acreage={item.order.meta[0]?.meta.total_running_acreage}
								createdAt={item.order.created_at}
								currentOrderStatus={item.order.aoi.status}
							/>
						);
					}
				})}
			</Stack>

			{/* Assuming LandingSideBoxFooterButtons is another component you have */}
			{/* <LandingSideBoxFooterButtons /> */}
		</>
	);
}

export default LandingPageOrderData;
