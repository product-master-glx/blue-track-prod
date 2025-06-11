import { useAtomValue, useSetAtom } from "jotai";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	barChartTypeAtom,
	currentLineChartDropdownValueAtom,
	metaDataForOrderAtom,
	currentOrderDataAtom,
} from "../../../../jotai";
import { useMemo } from "react";

const extractNumericValues = (name) => {
	const [start, end] = name.split("-").map(Number);
	return { start, end };
};

/**
 * Bar chart for the running pond with different DoC on the X-Axis
 */
function RegionInsightBarChart() {
	const BAR_CHART_TYPE = useAtomValue(barChartTypeAtom);
	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom);
	const SET_CURRENT_LINE_CHART_DROPDOWN_VALUE = useSetAtom(currentLineChartDropdownValueAtom);
	const current_aoi = useAtomValue(currentOrderDataAtom);
	const barChartData = useMemo(() => {
		const data = [];
		if (METADATA_FOR_ORDER && METADATA_FOR_ORDER.latest_summary) {
			let latest_summary;
			let latest_summary_keys = [];
			if (BAR_CHART_TYPE == "count") {
				latest_summary = METADATA_FOR_ORDER.latest_summary.count || {};
				latest_summary_keys = Object.keys(latest_summary);
				latest_summary_keys.sort(function compare(a, b) {
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
					return 0;
				});
			} else {
				latest_summary = METADATA_FOR_ORDER.latest_summary.doc || {};
				latest_summary_keys = Object.keys(latest_summary);
				latest_summary_keys.sort(function compare(a, b) {
					const { start: startA, end: endA } = extractNumericValues(a);
					const { start: startB, end: endB } = extractNumericValues(b);
					if (startA !== startB) {
						return startA - startB;
					} else {
						return endA - endB;
					}
				});
			}
			latest_summary_keys.map((key) => {
				if (key !== "0C-19C") {
					data.push({
						name: key,
						value: latest_summary[key],
					});
				}
			});
			const totalValue = data.reduce((sum, item) => sum + item.value, 0);
			if (BAR_CHART_TYPE == "count") {
				data.push({ name: "PBNS", value: METADATA_FOR_ORDER.running_ponds - totalValue });
			}
			if (BAR_CHART_TYPE == "doc") {
				const index = data.findIndex((item) => item.name === "0-0");
				if (index !== -1) {
					const item = data.splice(index, 1)[0];
					item.name = "PBNS";
					data.push(item);
				}
			}
			console.log(data);
		}
		return data;
	}, [BAR_CHART_TYPE, METADATA_FOR_ORDER]);

	const barChartClick = (data) => {
		if (
			BAR_CHART_TYPE == "count" &&
			data &&
			data.activePayload &&
			data.activePayload.length > 0
		) {
			const key = data.activePayload[0].payload.name;
			if (Object.keys(METADATA_FOR_ORDER?.count_summary || {}).includes(key)) {
				SET_CURRENT_LINE_CHART_DROPDOWN_VALUE(key);
			}
		}
	};

	const formatToTwoDecimal = (value) => value.toFixed(0);

	return (
		<>
			<ResponsiveContainer>
				<BarChart
					width={500}
					height={300}
					data={barChartData}
					layout="vertical"
					onClick={barChartClick}
					style={{ cursor: "pointer" }}
				>
					<XAxis type="number" tick={{ fill: "white" }} />
					<YAxis
						dataKey="name"
						type="category"
						tick={{ fill: "white" }}
						label={{
							value: BAR_CHART_TYPE == "count" ? "" : "DoC (in days)",
							angle: -90,
							position: "insideLeft",
							style: {
								fontWeight: 600,
								fill: "white",
							},
						}}
					/>
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip />
					<Legend />
					<Bar
						dataKey="value"
						name="No. of Ponds"
						fill="#8884d8"
						formatter={formatToTwoDecimal}
					/>
				</BarChart>
			</ResponsiveContainer>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					color: "white",
					flexDirection: "column",
				}}
			>
				<span>** PBNS - Pumped But Not Stocked</span>
				{current_aoi.villageId && (
					<div style={{ display: "flex", gap: 8 }}>
						<div style={{ display: "flex", alignItems: "center" }}>
							<span
								style={{
									display: "inline-block",
									width: 16,
									height: 16,
									borderRadius: "50%",
									background: "#1E90FF",
									border: "1px solid #000",
									marginRight: 6,
								}}
							/>
							<span>Shrimp</span>
						</div>
						<div style={{ display: "flex", alignItems: "center" }}>
							<span
								style={{
									display: "inline-block",
									width: 16,
									height: 16,
									borderRadius: "50%",
									background: "#FF0000", // red
									border: "1px solid #000",
									marginRight: 6,
								}}
							/>
							<span>Inactive Shrimp</span>
						</div>

						<div style={{ display: "flex", alignItems: "center" }}>
							<span
								style={{
									display: "inline-block",
									width: 16,
									height: 16,
									borderRadius: "50%",
									background: "#32CD32",
									border: "1px solid #000",
									marginRight: 6,
								}}
							/>
							<span>Non Shrimp</span>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default RegionInsightBarChart;
