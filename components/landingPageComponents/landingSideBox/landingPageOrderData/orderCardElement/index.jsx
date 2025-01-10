import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import LockIcon from "@mui/icons-material/Lock";
import { getDefaultStore, useSetAtom } from "jotai";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
	// cookiesValuesAtom,
	mapScrollWheelZoomAtom,
	regionDataGatheredFromLandingPageAtom,
	showLoadingScreenAtom,
} from "@/jotai/index";

// function getFortnight(dateString) {
// 	// Parse the date string
// 	const date = dayjs(dateString);
// 	const day = date.date();

// 	// Determine the fortnight
// 	const fortnight = day <= 15 ? "1st" : "2nd";

// 	const monthName = date.format("MMMM");

// 	// Construct the final string
// 	return `${monthName} ${fortnight} Fortnight`;
// }

/**
 * This function is used to zoom to the given coordinates on the map
 * @param {Object} regionCoordinates - Coordinates to zoom
 * @param {Function} SET_MAP_ZOOM_ATOM - To set the zoom
 * @param {Function} SET_MAP_CENTER_ATOM - To set the center of the map
 * @param {Function} SET_LOADING_SCREEN_BOOLEAN - To toggle the visibility of loader
 */

/**
 * This function upates the global states to store the selected order and redirect to "/region-insight"
 * @param {Function} SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE - To set the selected order details
 * @param {Function} SET_LOADING_SCREEN_BOOLEAN - To toggle the visibility of loader
 * @param {Object} _COOKIES - User data
 * @param {Object} farmAndPondInfo - Selected farms and ponds data information in the selected order
 * @param {String} orderID - Order id of the selected order
 * @param {Number|String} numberOfPonds - Number of ponds in the selected order
 * @param {Object} regionCoordinates - Coordinates of the order
 * @param {string} currentOrderStatus - Order status
 * @param {Function} navigate - To navigate
 */
const onClickCardContent = (
	SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE,
	SET_LOADING_SCREEN_BOOLEAN,
	// COOKIES,
	farmAndPondInfo,
	orderId,
	// numberOfPonds,
	regionCoordinates,
	// currentOrderStatus,
	can_access,
	navigate
) => {
	// Update only if number of ponds are available and current order status is processed
	console.log("SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE can access", can_access);
	if (!can_access) {
		// Start loading
		SET_LOADING_SCREEN_BOOLEAN(true);
		// Get the insight id
		const aoi_slug = farmAndPondInfo.aoi_slug;
		console.log("SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE", {
			regionCoordinates,
			farmAndPondInfo,
			orderId,
			aoi_slug,
		});
		// To update the order data
		SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE({
			regionCoordinates,
			farmAndPondInfo,
			orderId,
			aoi_slug,
		});

		// Reset zoom for wheel to true
		const store = getDefaultStore();
		store.set(mapScrollWheelZoomAtom, true);

		// Redirecct to "/region-insight"
		navigate(`/region-insight/${aoi_slug}`);
	}
};

function createData(key, value) {
	return { key, value };
}

/**
 * This component shows the details of the particular order
 */
function OrderCardElement({
	orderID, // Order id
	orderTitle = "Order Title", // Order title
	// city = "City",
	// country = "Country",
	runningPonds = 0, // Current runninng ponds
	numberOfPonds = 2, // Current number of ponds
	// lastInsightDate = "1/1/1", // Last updated on
	regionCoordinates = [80, 16], // Coordinates of the region for the order
	averageDoC = null, // Average DoC for the order
	initialOrderStatus = "processing", // Current status of the order
	farmAndPondInfo, // Farm and other pond information
	can_access,
	running_acreage = 0,
	createdAt,
}) {
	const navigate = useNavigate();
	const SET_LOADING_SCREEN_BOOLEAN = useSetAtom(showLoadingScreenAtom);
	const SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE = useSetAtom(
		regionDataGatheredFromLandingPageAtom
	);
	// const COOKIES = useAtomValue(cookiesValuesAtom);
	const [currentOrderStatus, setCurrentOrderStatus] = useState(initialOrderStatus);

	// const timeDifferenceBetweenCurrentDateAndLatestInsightDateInDays = dayjs().diff(
	// 	dayjs(lastInsightDate),
	// 	"day"
	// );

	// const daysSinceLastInight = timeDifferenceBetweenCurrentDateAndLatestInsightDateInDays % 5;
	// const daysLeftForNextInsight = 5 - daysSinceLastInight;

	useEffect(() => {
		console.log(createdAt, "createdAt");
		if (createdAt && can_access) {
			const dateWhenOrderWasPlaced = dayjs(createdAt);
			const currentDate = dayjs();

			if (currentDate.diff(dateWhenOrderWasPlaced, "day") > 1) {
				console.log(currentDate.diff(dateWhenOrderWasPlaced, "day"), "aborted");
				setCurrentOrderStatus("aborted");
			}
		}
	}, [createdAt, currentOrderStatus, can_access]);
	return (
		<>
			<Card
				sx={{
					flex: "0 0 auto",
					width: "100%",
					minHeight: "fit",
					height: "auto",
				}}
				onClick={(event) => {
					event.stopPropagation();
					event.preventDefault();
					onClickCardContent(
						SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE,
						SET_LOADING_SCREEN_BOOLEAN,
						// COOKIES,
						farmAndPondInfo,
						orderID,
						// numberOfPonds,
						regionCoordinates,
						// currentOrderStatus,
						can_access,
						navigate
					);
				}}
			>
				<CardActionArea
					component="a"
					sx={{
						color: "white !important",
					}}
				>
					<CardContent>
						<Stack
							direction="row"
							spacing={2}
							justifyContent="center"
							alignItems="center"
						>
							<Box className="w-full">
								<Stack direction="row" alignItems="center" gap={1}>
									<Typography variant="h6" component="div">
										{orderTitle}
									</Typography>
									{can_access && <LockIcon />}
								</Stack>

								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
									flexWrap="wrap"
									gap={0.5}
									marginTop={1}
								>
									{[
										createData(
											"Active/Total Ponds",
											!isNaN(numberOfPonds)
												? runningPonds + "/" + numberOfPonds
												: "Not Available"
										),
										createData(
											"Active Acreage",
											Number(running_acreage).toFixed(3) + " acres"
										),
										createData(
											"Average DoC",
											averageDoC ? averageDoC.toFixed(2) : "Not Available"
										),
										// {
										/* // createData(
									{currentOrderStatus === "aborted" ? (
										<Typography variant="body2">
											Please contact support for more information
										</Typography>
									) : (
										[
											createData(
												"Active/Total Ponds",
												!isNaN(numberOfPonds)
													? runningPonds + "/" + numberOfPonds
													: "Not Available"
											),
											createData(
												"Active Acreage",
												running_acreage + " acres"
											),
											createData(
												"Average DoC",
												averageDoC ? averageDoC.toFixed(2) : "Not Available"
											),
											// createData(
											// 	"Last Updated",
											// 	lastInsightDate
											// 		? getFortnight(lastInsightDate)
											// 		: "Not Available"
											// ),
											// createData(
											// 	"Last Check",
											// 	lastInsightDate
											// 		? dayjs(lastInsightDate)
											// 				.add(
											// 					timeDifferenceBetweenCurrentDateAndLatestInsightDateInDays -
											// 						daysSinceLastInight,
											// 					"day"
											// 				)
											// 				.format("DD/MM/YYYY")
											// 		: "Not Available"
											// ), */
										// },
									].map((row, index) => (
										<Typography
											key={index}
											variant="body2"
											className="w-full flex"
										>
											<span className="w-[45%]">{row.key}</span>
											<span className="w-[55%] flex gap-2 items-center">
												:
												<Box
													component="span"
													sx={!can_access ? {} : { filter: "blur(5px)" }}
												>
													{!can_access
														? row.value
														: "* ".repeat(String(row.value).length)}
												</Box>
											</span>
										</Typography>
									))}
								</Stack>
							</Box>
						</Stack>
					</CardContent>
				</CardActionArea>
			</Card>
		</>
	);
}

OrderCardElement.propTypes = {
	orderID: PropTypes.node.isRequired,
	orderTitle: PropTypes.node.isRequired,
	city: PropTypes.node.isRequired,
	country: PropTypes.node.isRequired,
	numberOfPonds: PropTypes.node.isRequired,
	lastInsightDate: PropTypes.node.isRequired,
	regionCoordinates: PropTypes.any,
	farmAndPondInfo: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	currentOrderStatus: PropTypes.any,
};

export default OrderCardElement;
