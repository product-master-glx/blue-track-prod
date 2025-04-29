import endpoints from "@/constants/endpoints";
// import { getDefaultStore } from "jotai";
import toast from "react-hot-toast";
import request_handler from "../request.handler";
// import { history } from "@/constants/index";

/**
 * This function sends a request for user signing in
 */
export default async function userLogOutHandler(request_body) {
	// const store = getDefaultStore();
	try {
		const data = await request_handler({
			method: "post",
			endpoint: endpoints.loggedOut,
			data: request_body,
			isAuthenticationRequired: false,
			errorToast: false,
		});
		console.log("Logout response", data);
		// toast.success(data.message);

		// history.navigate("/");
	} catch (err) {
		console.error(err);
		toast.error(err.message);
	}
	return;
}
