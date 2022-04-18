import { NextApiRequest, NextApiResponse } from "next";
import url from "url";
import axios from "axios";
const DISCORD_API_ENDPOINT = "https://discord.com/api/v8";
import { getAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase-admin/app";
import { Auth } from "firebase-admin/auth";
import { cert } from "firebase-admin/app";
import { auth, firebaseConfig, createFirebaseApp } from "../../lib/firebase";
import { getApp } from "firebase/app";
import { signInWithCustomToken } from "firebase/auth";
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

			const app = createFirebaseApp(appConfig);

			const discordUser = await (
				await axios.get(`${DISCORD_API_ENDPOINT}/users/@me`, {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				})
			).data;

			const customToken = await getAuth().createCustomToken(discordUser.id);
			console.log(customToken);
			const discordAuthParams = new url.URLSearchParams({
				access_token: access_token,
				refresh_token: refresh_token,
				firebase_token: customToken,
				provider: "discord",
			});
			
			res.redirect(`${loginURL}?${discordAuthParams}`);
		} catch (error) {
			console.error(error);
		}
	} else {
		res.send(400);
	}
}
