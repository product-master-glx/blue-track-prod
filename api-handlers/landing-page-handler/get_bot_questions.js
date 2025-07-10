import request_handler from "../request.handler";
import endpoints from "@/constants/endpoints";

export default async function getBotQuestions(aoiType, aoiSlugType, aoiSlug) {
	const slug = aoiSlug ? `&aoi_slug=${aoiSlug}` : "";
	const endpoint =
		endpoints.blueBot.getQuestions +
		`aoi_slug_type=${aoiSlugType}&aoi_type_to_search=${aoiType}` +
		slug;

	const QuestionsByBot = await request_handler({
		method: "get",
		endpoint: endpoint,
		data: {},
		successToast: false,
	});
	return QuestionsByBot;
}
