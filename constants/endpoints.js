/**
 * This file contains the API endpoints and their domains
 */

export const awsAPIDomain = "https://03ybm05ec1.execute-api.ap-south-1.amazonaws.com";

export const azureAPIDomain = "https://galaxeye-blue-prod.eastus.cloudapp.azure.com";

// export const azureDevAPIDomain = "https://galaxeye-blue-internal.eastus.cloudapp.azure.com";
export const azureDevAPIDomain = "https://galaxeye-blue-prod.eastus.cloudapp.azure.com";

const glxBlueEndpoint = "/glx-blue-p";

export default {
	aoi: awsAPIDomain + "/aoi",
	order: awsAPIDomain + "/order",
	getSignedURL: awsAPIDomain + "/get_signed_url",
	signedIn: azureDevAPIDomain + "/login",
	signedUp: azureDevAPIDomain + "/signup",
	loggedOut: azureDevAPIDomain + "/logout",
	placeOrder: awsAPIDomain + "/place-order",
	blueBot: {
		getQuestions: azureDevAPIDomain + "/get_bot_questions?",
		getAnswers: azureDevAPIDomain + "/get_bot_answer",
	},
	glxBlue: {
		processingOrder: awsAPIDomain + glxBlueEndpoint + "/processingOrders",
		allStats: awsAPIDomain + glxBlueEndpoint + "/allStats",
		gJSon: azureAPIDomain + "/getProcessingGJSON",
		uploadResults: awsAPIDomain + glxBlueEndpoint + "/uploadResults",
	},
	userOrders: azureDevAPIDomain + "/get_user_orders",
	userOrdersMetaData: azureDevAPIDomain + "/get_user_order_meta_data",
};
