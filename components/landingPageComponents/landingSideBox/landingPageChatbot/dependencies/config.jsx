import { createChatBotMessage } from "react-chatbot-kit";
import RegionsOverview from "./widgets/selectRegionWidget/regions";
import QuestionOverview from "./widgets/SelectQuestionWidget/questions";

const config = {
	initialMessages: [
		createChatBotMessage(`Hi I'm BlueBot. I’m here to help you with all your shrimp needs`),
		createChatBotMessage("Please search a region for analysis", {
			withAvatar: false,
			delay: 500,
			widget: "regionOverview",
		}),
	],
	state: { selectedRegion: {}, selectedQuestion: {} },
	widgets: [
		{
			widgetName: "regionOverview",
			widgetFunc: (props) => <RegionsOverview {...props} />,
			mapStateToProps: ["selectedRegion"],
		},
		{
			widgetName: "questionOverview",
			widgetFunc: (props) => <QuestionOverview {...props} />,
			mapStateToProps: ["selectedQuestion"],
		},
	],
	customStyles: {
		botMessageBox: { backgroundColor: "#0047AB" },
		chatButton: { backgroundColor: "#0047AB" },
	},
};

export default config;
