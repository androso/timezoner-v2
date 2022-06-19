export const inUser = false; 
//! Helper functions for discord auth flow
//! will be used later, when support for discord will be added.



// import { getApp, initializeApp } from "firebase-admin/app";
// import { adminAppConfig } from "./types";
// import {
// 	ExchangeCodeRequestParamsDiscord,
// 	DISCORD_API_ENDPOINTS,
// } from "./types";
// import url from "url";
// import axios from "axios";

// export const createFirebaseAdminApp = (config: adminAppConfig) => {
// 	try {
// 		return getApp();
// 	} catch {
// 		return initializeApp(config);
// 	}
// };

// export const exchangeAccessCodeForCredentials = async (
// 	data: ExchangeCodeRequestParamsDiscord
// ) => {
// 	const payload = new url.URLSearchParams(data).toString();
// 	return axios.post(DISCORD_API_ENDPOINTS.OAUTH2_TOKEN, payload, {
// 		headers: {
// 			"Content-type": "application/x-www-form-urlencoded",
// 		},
// 	});  
// };
