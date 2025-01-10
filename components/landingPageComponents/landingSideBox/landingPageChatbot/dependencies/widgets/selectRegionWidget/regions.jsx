import { Button, Box, Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { aoiSlugAtom, botAOIAtom, botMessageAtom, botQuestionsAtom } from "@/jotai/index";
import LockIcon from "@mui/icons-material/Lock";
import getBotQuestions from "@/api-handlers/landing-page-handler/get_bot_questions";

function RegionsOverview(props) {
	const { setState } = props;
	const botAOI = useAtomValue(botAOIAtom);
	const [message, setMessage] = useAtom(botMessageAtom);

	const setAoiSlug = useSetAtom(aoiSlugAtom);

	const setBotQuestions = useSetAtom(botQuestionsAtom);

	const onClickHandler = async (item) => {
		setState((state) => ({
			...state,
			selectedRegion: item.name,
			selectedSlug: item.slug,
			selectedAoiType: item.aoi_type,
		}));
		props.actionProvider.selectRegion();

		const prevAoiType =
			item.aoi_type === "mandal"
				? "district"
				: item.aoi_type === "village"
				? "mandal"
				: "district";
		setMessage("");
		const questions = await getBotQuestions(prevAoiType, item.aoi_type, item.slug);
		console.log("questions:", questions.data);
		setBotQuestions(questions.data?.questions);
		if (item.aoi_type !== "village") setAoiSlug(item.slug);
	};

	return (
		<>
			<Box
				sx={{
					color: "black",
					pb: "10px",
					backgroundColor: "black",
					zIndex: message.length > 0 ? 100 : -100,
					position: "absolute",
					bottom: 57,
					padding: 2,
					width: "88%",
					height: "auto",
					maxHeight: "80%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					overflowY: "scroll",
				}}
			>
				<TransitionGroup>
					{botAOI.map((item, index) => (
						<Collapse key={index}>
							<Button
								variant="contained"
								sx={{
									marginY: 0.5,
									width: "100%",
								}}
								disabled={item.locked}
								onClick={() => onClickHandler(item)}
								endIcon={item.locked && <LockIcon />}
							>
								{item.name}
							</Button>
						</Collapse>
					))}
				</TransitionGroup>
				{message.length > 0 && botAOI.length === 0 && (
					<Button
						variant="contained"
						sx={{
							marginY: 0.5,
							width: "100%",
						}}
					>
						No results found
					</Button>
				)}
			</Box>
		</>
	);
}

export default RegionsOverview;
