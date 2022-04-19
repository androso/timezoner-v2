//TODO: handle correctly the possible errors

import { NextApiRequest, NextApiResponse } from "next";
import url from "url";
import axios from "axios";
const DISCORD_API_ENDPOINT = process.env.NEXT_PUBLIC_DISCORD_API_ENDPOINT;
import { getAuth } from "firebase-admin/auth";
import { cert, getApp, initializeApp } from "firebase-admin/app";

const serviceAccount = require("../../timezoner-v2-firebase-adminsdk-c0w9x-955156a9ec.json");
const loginURL = `${process.env.NEXT_PUBLIC_DOMAIN_DEV}/login`;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { code } = req.query;
	if (code) {
		const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_OAUTH_CLIENT_ID;
		const CLIENT_SECRET = process.env.NEXT_PUBLIC_DISCORD_OAUTH_SECRET_KEY;
		const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN_DEV}/api/callback`;
		try {
			const queryParams = new url.URLSearchParams({
				client_id: `${CLIENT_ID}`,
				client_secret: `${CLIENT_SECRET}`,
				grant_type: "authorization_code",
				code: code,
				redirect_uri: `${REDIRECT_URI}`,
			});

			const response = await axios.post(
				`${DISCORD_API_ENDPOINT}/oauth2/token`,
				queryParams.toString(),
				{
					headers: {
						"Content-type": "application/x-www-form-urlencoded",
					},
				}
			);

			const { access_token, refresh_token } = response.data;
			const appConfig = {
				credential: cert(serviceAccount),
			};

			const adminApp = createFirebaseAdminApp(appConfig);
			const discordUser = await (
				await axios.get(`${DISCORD_API_ENDPOINT}/users/@me`, {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				})
			).data;

			if (adminApp) {
				const customToken = await getAuth().createCustomToken(discordUser.id, {
					custom: "displayname",
				});
				// console.log(customToken);
				const discordAuthParams = new url.URLSearchParams({
					access_token: access_token,
					refresh_token: refresh_token,
					firebase_token: customToken,
					provider: "discord",
				});

				res.redirect(`${loginURL}?${discordAuthParams}`);
			}
		} catch (error) {
			console.error(error, "loading from catch");
			res.send(500);
		}
	} else {
		const { error, error_description } = req.query;
		if (error === 'access_denied') {
			//The resource owner or authorization server denied the request
			res.redirect('/login');
		} else {
			res.send(400);
		}
		
	}
}

export function createFirebaseAdminApp(config: object) {
	try {
		return getApp();
	} catch {
		return initializeApp(config);
	}
}
