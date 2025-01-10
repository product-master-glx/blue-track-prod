import getBotAnswer from "@/api-handlers/landing-page-handler/get_bot_answers";
import React from "react";
import { createClientMessage } from "react-chatbot-kit";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
	const goBackToRegionSelect = () => {
		console.log("children", children);
		setState((state) => {
			const botMessage = createChatBotMessage("Please search a region for analysis", {
				delay: 200,
				widget: "regionOverview",
			});

			return {
				...state,
				messages: [...state.messages, botMessage],
			};
		});
	};
	const selectRegion = () => {
		console.log("children", children);
		setState((state) => {
			console.log("State of region", state);
			console.log(state.selectedRegion);
			const forcedUserMessage = createClientMessage(
				"I would like to inquire about the " + state.selectedRegion + " region",
				{ withAvatar: false, delay: 500, widget: "questionOverview" }
			);

			return {
				...state,
				messages: [...state.messages, forcedUserMessage],
			};
		});
	};

	const selectQuestion = async () => {
		console.log("children", children);
		var questionID;
		var slug;
		var aoiType;
		await setState((state) => {
			console.log("state action-provider", state);
			slug = state.selectedSlug;
			questionID = state.selectedQuestion.ques_id;
			aoiType = state.selectedAoiType;
			return { ...state };
		});
		console.log(slug, questionID, "answer222");

		const answer = await getBotAnswer(questionID, slug, aoiType);
		console.log("answer for question", answer);

		setState((state) => {
			// console.log(state.selectedRegion);
			const forcedUserMessage = createClientMessage(state.selectedQuestion.question);

			console.log(answer, "answererr");
			const answerToQuestion = createChatBotMessage(Object.values(answer.data).pop());
			const returnAllQuestions = createChatBotMessage("Anything else I can help you with?", {
				withAvatar: false,
				delay: 5000,
				widget: "questionOverview",
			});

			return {
				...state,
				messages: [
					...state.messages,
					forcedUserMessage,
					answerToQuestion,
					returnAllQuestions,
				],
			};
		});
	};

	return (
		<div>
			{React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					actions: { selectRegion, selectQuestion, goBackToRegionSelect },
				});
			})}
		</div>
	);
};

export default ActionProvider;
