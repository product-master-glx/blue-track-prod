import request_handler from "../request.handler";
import endpoints from "@/constants/endpoints";

export default async function getBotAnswer(question_id, aoi_slug, aoi_type) {
	const answerByBot = await request_handler({
		method: "POST",
		endpoint: endpoints.blueBot.getAnswers,
		data: {
			aoi_slug,
			aoi_type,
			question_id,
		},
		successToast: false,
	});
	return answerByBot;
}
