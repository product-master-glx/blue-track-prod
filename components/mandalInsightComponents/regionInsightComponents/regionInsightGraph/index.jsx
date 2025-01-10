import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Label,
	ReferenceLine,
} from "recharts";
import { useAtomValue } from "jotai";
import { currentLineChartDropdownValueAtom, metaDataForOrderAtom } from "@/jotai/index";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="custom-tooltip">
				{typeof payload[0].value === "number" && (
					<p className="label">{`${payload[0].dataKey} : 
      ${payload[0].value} `}</p>
				)}
				{/* <p className="desc">Anything you want can be displayed here.</p> */}
			</div>
		);
	}

	return null;
};

function RegionInsightGraph() {
	const CURRENT_LINE_CHART_DROPDOWN_VALUE = useAtomValue(currentLineChartDropdownValueAtom);
	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom);
	const [data, setData] = useState([]);
	const [liveReferenceLine, setLiveReferenceLine] = useState({ toShow: false, date: "" });

	useEffect(() => {
		if (METADATA_FOR_ORDER?.count_summary[CURRENT_LINE_CHART_DROPDOWN_VALUE]) {
			setLiveReferenceLine({ toShow: false, date: {} });
			console.log(METADATA_FOR_ORDER, "METADATA_FOR_ORDER");
			const unorderdCountSummaryObject =
				METADATA_FOR_ORDER?.count_summary[CURRENT_LINE_CHART_DROPDOWN_VALUE];
			const orderdCountSummaryObject = Object.keys(unorderdCountSummaryObject)
				.sort()
				.reduce((obj, key) => {
					obj[key] = unorderdCountSummaryObject[key];
					return obj;
				}, {});
			const allDatesForCurrentDoc = Object.keys(orderdCountSummaryObject);
			const allValuesForCorrespondingDatesForCurrentDoc =
				Object.values(orderdCountSummaryObject);
			var tempArr = [];
			const currentDateAsDayJSObject = dayjs();
			console.log(currentDateAsDayJSObject, "currentDateAsDayJSObject");
			var movedFromActualToPredictedBoolean = false;

			//mapping
			allDatesForCurrentDoc.map((item, index) => {
				const dateAsADayJSObject = dayjs(item);
				if (currentDateAsDayJSObject.isAfter(dateAsADayJSObject))
					tempArr.push({
						name: dateAsADayJSObject.format("DD-MMM"),
						actual: allValuesForCorrespondingDatesForCurrentDoc[index],
					});
				//Set Live Tracker
				else if (!movedFromActualToPredictedBoolean) {
					movedFromActualToPredictedBoolean = true;
					// if actual values are present
					if (tempArr.length > 0) {
						tempArr[tempArr.length - 1] = {
							...tempArr[tempArr.length - 1],
							predicted: tempArr[tempArr.length - 1].actual,
						};
						setLiveReferenceLine({
							status: true,
							date: tempArr[tempArr.length - 1].name,
						});
						tempArr.push({
							name: dateAsADayJSObject.format("DD-MMM"),
							predicted: allValuesForCorrespondingDatesForCurrentDoc[index],
						});
					} else {
						// if actual values are not present
						tempArr = [
							{
								name: currentDateAsDayJSObject.format("DD-MMM"),
								predicted: 0,
								actual: 0,
							},
						];
						setLiveReferenceLine({
							status: true,
							date: currentDateAsDayJSObject.format("DD-MMM"),
						});
						tempArr.push({
							name: dateAsADayJSObject.format("DD-MMM"),
							predicted: allValuesForCorrespondingDatesForCurrentDoc[index],
						});
					}
				} else
					tempArr.push({
						name: dateAsADayJSObject.format("DD-MMM"),
						predicted: allValuesForCorrespondingDatesForCurrentDoc[index],
					});
			});
			if (tempArr.length > 0) setData(tempArr);
			else {
				tempArr.push({
					name: currentDateAsDayJSObject.format("DD-MMM"),
					actual: 0,
				});
				setData(tempArr);
				setLiveReferenceLine({
					status: true,
					date: currentDateAsDayJSObject.format("DD-MMM"),
				});
			}
		}
	}, [METADATA_FOR_ORDER, CURRENT_LINE_CHART_DROPDOWN_VALUE]);

	return (
		<>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 30,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" tick={{ fill: "white" }} />
					{/* <YAxis domain={[0, 300]} tickCount={4} tick={{ fill: "white" }}> */}
					<YAxis tick={{ fill: "white" }}>
						<Label
							value="No. of Ponds"
							angle="-90"
							position={{
								x: 20,
								y: 15,
							}}
							fill="white"
							style={{
								fontSize: "1rem",
							}}
						/>
					</YAxis>
					{liveReferenceLine.status && (
						<ReferenceLine x={liveReferenceLine.date} stroke="#82ca9d" strokeWidth={3}>
							<Label
								value="Live"
								position="top"
								fill="#82ca9d"
								offset="10"
								style={{
									fontSize: "1rem",
								}}
							/>
						</ReferenceLine>
					)}
					<Tooltip content={<CustomTooltip />} />

					<Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={3} />
					<Line
						type="monotone"
						dataKey="predicted"
						stroke="#82ca9d"
						strokeDasharray="5 5"
						strokeWidth={3}
					/>
				</LineChart>
			</ResponsiveContainer>
		</>
	);
}

export default RegionInsightGraph;
