import { Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { listOfFilteredOrderDataAtom } from "@/jotai/index";
import { useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";

/**
 * This component shows the all stats summary using piechart when user selects Graph mode
 */
function LandingPageSummary() {
	const FILTERED_ORDER_DATA = useAtomValue(listOfFilteredOrderDataAtom);
	const navigate = useNavigate();

	const summaryData = useMemo(() => {
		if (!FILTERED_ORDER_DATA) {
			return null;
		}
		let total_active_ponds = 0,
			total_ponds = 0,
			total_active_acerage = 0,
			total_acerage = 0;

		const pieChartData = [];

		FILTERED_ORDER_DATA.map((order) => {
			if (order.order?.meta) {
				total_active_ponds += order.order.meta[0]?.meta.running_ponds;
				total_acerage += order.order.meta[0]?.meta.total_acreage || 0;
				total_ponds += order.order.meta[0]?.meta.total_ponds;
				total_active_acerage += order.order.meta[0]?.meta.total_running_acreage || 0;
			}
		});
		FILTERED_ORDER_DATA.map((order) => {
			if (order.order?.aoi.status === 1) {
				pieChartData.push({
					id: order.order?.aoi.name,
					label: order.order?.aoi.name,
					value: Math.round(
						(order.order.meta[0]?.meta.total_running_acreage / total_active_acerage) *
							100
					),
					...order,
				});
			}
		});
		return {
			meta: [
				{
					title: "Total Ponds",
					value: total_ponds,
					color: "purple",
				},
				{
					title: "Total Active Ponds",
					value: total_active_ponds,
					color: "#1f77b4",
				},
				{
					title: "Total Acreage (acres)",
					value: total_acerage,
					color: "purple",
				},
				{
					title: "Total Active Acreage (acres)",
					value: total_active_acerage,
					color: "#2ca02c",
				},
			],
			pieChartData: pieChartData,
		};
	}, [FILTERED_ORDER_DATA]);

	return (
		summaryData && (
			<Stack
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={0}
				sx={{ height: "100%" }}
				className="w-full h-[60%] overflow-hidden"
				gap={0}
			>
				<Stack
					direction="column"
					justifyContent="flex-start"
					alignItems="flex-start"
					spacing={1}
					sx={{ height: "40%", width: "100%", paddingTop: "20px" }}
				>
					{summaryData.meta.map((item, index) => (
						<Stack
							direction="row"
							justifyContent="flex-start"
							alignItems="center"
							spacing={2}
							sx={{ width: "100%" }}
							key={index}
						>
							<Typography
								variant="h6"
								sx={{
									width: "100%",
									fontSize: "17px",
									display: "flex",
									alignItems: "center",
								}}
								component="div"
							>
								<span style={{ width: "60%" }} className="block">
									{item.title}
								</span>
								<span style={{ width: "40%" }} className="block">
									: {item.value.toLocaleString("en-IN")}
								</span>
							</Typography>
						</Stack>
					))}
				</Stack>
				<Stack
					direction="column"
					justifyContent="flex-start"
					alignItems="flex-start"
					spacing={2}
					className="w-full h-[60%] overflow-hidden"
				>
					<Typography
						variant="h6"
						sx={{
							width: "100%",
							fontSize: "17px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							marginTop: "-50px",
						}}
						component="div"
					>
						<span style={{ width: "60%" }} className="block">
							Active Acreage Distribution
						</span>
					</Typography>
					<ResponsivePie
						data={summaryData.pieChartData}
						animate={true}
						activeOuterRadiusOffset={8}
						enableArcLinkLabels={false}
						margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
						innerRadius={0.4}
						colors={{ scheme: "pastel1" }}
						cornerRadius={3}
						sortByValue={true}
						isInteractive={true}
						startAngle={-180}
						onMouseEnter={(_datum, event) => {
							event.currentTarget.style.cursor = "pointer";
						}}
						borderWidth={1}
						borderColor={{
							from: "color",
							modifiers: [["darker", "3"]],
						}}
						tooltip={(e) => {
							const {
								datum: { label, value },
							} = e;
							return (
								<div
									style={{ backgroundColor: "#fff" }}
									className="shadow-inner text-black font-semibold text-[10px] p-1 rounded-lg"
								>
									{label} ({value}%)
								</div>
							);
						}}
						onClick={(item) => {
							if (!item.data?.locked) {
								navigate(`/region-insight/${item.data?.order.aoi_slug}`);
							}
						}}
						arcLabelsSkipAngle={10}
						arcLabelsComponent={({ _datum, label, style }) => (
							<animated.g
								transform={style.transform}
								style={{ pointerEvents: "none" }}
							>
								<text
									textAnchor="middle"
									dominantBaseline="central"
									fill={style.textColor}
									style={{
										fontSize: 16,
										fontWeight: 800,
									}}
								>
									{label}%
								</text>
							</animated.g>
						)}
					/>
				</Stack>
			</Stack>
		)
	);
}

export default LandingPageSummary;
