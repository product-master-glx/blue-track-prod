import endpoints from "@/constants/endpoints";
import { userAccessTokensAtom, loginOtpValidityAtom, userDataAtom } from "@/jotai/index";
import { getDefaultStore } from "jotai";
// import Cookies from "js-cookie";
import toast from "react-hot-toast";
import request_handler from "../request.handler";
import { history } from "@/constants/index";

/**
 * This function sends a request for user signing in
 */
export default async function userSignInHandler(request_body) {
	const store = getDefaultStore();
	try {
		const data = await request_handler({
			method: "post",
			endpoint: endpoints.signedIn,
			data: request_body,
			isAuthenticationRequired: false,
			errorToast: false,
		});
		const accessToken = data.accessToken;
		// Cookies.set("accessToken", accessToken, {
		// 	expires: 604800,
		// 	path: "/",
		// 	secure: true,
		// 	sameSite: "None",
		// domain: window.location.hostname,
		// httpOnly: true,
		// domain: ".galaxeye.space",
		// });
		toast.success(data.message);
		store.set(userAccessTokensAtom, accessToken);

		if (data?.data?.valid_for) store.set(loginOtpValidityAtom, data?.data?.valid_for);

		const numberOfProperties = Object.keys(request_body).length;

		if (numberOfProperties === 2) {
			store.set(userDataAtom, data?.data);
			history.navigate("/");
		}
	} catch (err) {
		console.error(err);
		toast.error(err.message);
	}
	return;
}
