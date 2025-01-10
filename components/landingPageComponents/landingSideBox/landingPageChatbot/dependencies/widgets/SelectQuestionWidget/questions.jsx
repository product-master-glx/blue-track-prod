import { Button, Grow, Stack } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { aoiSlugAtom, aoiTypeAtom, botAoiArrayAtom, botQuestionsAtom } from "@/jotai/index";
import getBotQuestions from "@/api-handlers/landing-page-handler/get_bot_questions";

function QuestionOverview(props) {
	const { setState } = props;
	const botQuestions = useAtomValue(botQuestionsAtom);

	const setAoiType = useSetAtom(aoiTypeAtom);

	const setBotQuestions = useSetAtom(botQuestionsAtom);

	const setBotAoiArray = useSetAtom(botAoiArrayAtom);

	const aoiSlug = useAtomValue(aoiSlugAtom);

	const getQuestions = async (aoiType, aoiSlugType) => {
		const questions = await getBotQuestions(aoiType, aoiSlugType, aoiSlug);
		console.log(
			`questions for:${aoiType},aoiSlugType:${aoiSlugType}, aoiSlug, ${aoiSlug}`,
			questions
		);
		setBotQuestions(questions.data?.questions);
		setBotAoiArray(questions.data);
		setAoiType(aoiType);
	};

	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="flex-start"
			spacing={2}
			sx={{ color: "black", pb: "10px" }}
		>
			{botQuestions.map((item, index) =>
				item.id === 1000 ? (
					<Grow
						in={true}
						key={index + 1}
						style={{ transformOrigin: "0 0 0" }}
						timeout={1000 * index}
					>
						<Button
							variant="contained"
							key={item.id}
							color="error"
							size="small"
							onClick={() => {
								setState((state) => ({ ...state, selectedRegion: {} }));
								props.actionProvider.goBackToRegionSelect();
							}}
							sx={{ textAlign: "left" }}
						>
							{item.question}
						</Button>
					</Grow>
				) : (
					<Grow
						in={true}
						key={index + 1}
						style={{ transformOrigin: "0 0 0" }}
						timeout={1000 * index}
					>
						<Button
							variant="contained"
							key={index}
							size="small"
							onClick={async () => {
								setState((state) => ({ ...state, selectedQuestion: item }));
								console.log("props.actionProvider", props.actionProvider);
								props.actionProvider.selectQuestion();
							}}
							sx={{ textAlign: "left" }}
						>
							{item.question}
						</Button>
					</Grow>
				)
			)}

			<Button
				variant="contained"
				size="small"
				onClick={() => {
					getQuestions("district", "district");
				}}
				sx={{ textAlign: "left" }}
			>
				Select Districts
			</Button>
			<Button
				variant="contained"
				size="small"
				onClick={() => {
					getQuestions("mandal", "district");
				}}
				sx={{ textAlign: "left" }}
			>
				Select Mandals
			</Button>
			<Button
				variant="contained"
				size="small"
				onClick={async () => {
					getQuestions("village", "mandal");
				}}
				sx={{ textAlign: "left" }}
			>
				Select Village
			</Button>
		</Stack>
	);
}

export default QuestionOverview;
