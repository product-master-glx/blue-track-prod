import "react-chatbot-kit/build/main.css";
import Chatbot from "react-chatbot-kit";
import config from "./dependencies/config";
import MessageParser from "./dependencies/MessageParser";
import ActionProvider from "./dependencies/ActionProvider";
import SearchBar from "./dependencies/SearchBar";
import { useEffect, useRef, useCallback } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { botAOIAtom, botMessageAtom, aoiTypeAtom, botAoiArrayAtom } from "@/jotai/index";
import getBotQuestions from "@/api-handlers/landing-page-handler/get_bot_questions";

function LandingPageChatbot() {
	const setBotAOI = useSetAtom(botAOIAtom);

	const aoiType = useAtomValue(aoiTypeAtom);

	const [botAoiArray, setBotAoiArray] = useAtom(botAoiArrayAtom);

	const message = useAtomValue(botMessageAtom);

	const renderRef = useRef(true);

	const getQuetsions = useCallback(async () => {
		const prevAoiType =
			aoiType === "mandal" ? "district" : aoiType === "village" ? "mandal" : "district";
		const questions = await getBotQuestions(prevAoiType, aoiType);
		setBotAoiArray(questions.data);
		return questions;
	}, [aoiType, setBotAoiArray]);

	useEffect(() => {
		getQuetsions();

		if (renderRef.current) {
			// Remove default Form
			const inputElements = document.getElementsByClassName(
				"react-chatbot-kit-chat-input-container"
			);
			if (inputElements.length === 0) return;
			const inputElement = inputElements[0];
			inputElement.remove();
			renderRef.current = false;
		}
	}, [getQuetsions]);

	useEffect(() => {
		let searchResults = [];
		if (message === "") {
			searchResults = [];
		} else {
			searchResults = botAoiArray?.aoi_names?.filter((aoi) => {
				return aoi.name.toLowerCase().includes(message.toLowerCase());
			});
		}
		setBotAOI(searchResults);
	}, [message, botAoiArray, setBotAOI]);

	return (
		<div>
			<Chatbot
				config={config}
				messageParser={MessageParser}
				actionProvider={ActionProvider}
			/>
			<SearchBar />
		</div>
	);
}

export default LandingPageChatbot;
