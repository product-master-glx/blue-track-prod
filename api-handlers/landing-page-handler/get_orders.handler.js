import { listOfAllOrderDataAtom } from "@/jotai/index";
import { getDefaultStore } from "jotai";
import request_handler from "../request.handler";
import endpoints from "@/constants/endpoints";

//To get the user's orders
export default async function GetOrderDataHandler() {
	const store = getDefaultStore();
	const listOfAllOrderData = store.get(listOfAllOrderDataAtom);
	if (listOfAllOrderData) {
		return listOfAllOrderData;
	}
	// const COOKIES = store.get(cookiesValuesAtom);
	// Send the request with userID from the user data we stored in the global state and access token
	const outputOrder = await request_handler({
		method: "get",
		endpoint: endpoints.userOrders,
		data: {},
		successToast: false,
	});
	const allInfoOrders = outputOrder?.data;
	console.log(allInfoOrders, "allInfoOrders");
	return allInfoOrders;
}
