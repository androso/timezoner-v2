import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../lib/context";
import { useRouter } from "next/router";
import { LoginForm, LoadingSpinner } from "../components";
import { ParsedUrlQuery } from "querystring";
import {
	signInWithCustomToken,
	updateProfile,
	updateEmail,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import axios from "axios";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_DEV as string;
const DISCORD_API_ENDPOINT = process.env.NEXT_PUBLIC_DISCORD_API_ENDPOINT;
const DISCORD_CDN = process.env.NEXT_PUBLIC_DISCORD_CDN;

export default function loginPage() {
	// const userData = useContext(UserContext);
	const { user, isLoggedIn, loading, error } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (user != null && isLoggedIn) {
			router.push("/dashboard");
		}
		// console.log({
		// 	user,
		// 	isLoggedIn,
		// 	loading,
		// 	error,
		// 	queries: router.query
		// });
	}, [user, isLoggedIn, loading, error]);

	useEffect(() => {
		if (!loading && router.query.provider) {
			customSignIn(router.query);
			// console.log({
			// 	user,
			// 	isLoggedIn,
			// 	loading,
			// 	error,
			// 	queries: router.query
			// });
		}
	}, [loading]);

	return !loading && !isLoggedIn ? <LoginForm /> : <LoadingSpinner />;
}
type AuthQueries = {
	access_token: string;
	firebase_token: string;
	provider: string;
	refresh_token: string;
};
async function customSignIn(queries: ParsedUrlQuery) {
	const { provider, firebase_token, access_token, refresh_token } = queries;
	console.log("loging in user");
	switch (provider) {
		case "discord": {
			if (typeof firebase_token === "string") {
				
				try {
					const { user } =  await  signInWithCustomToken(auth, firebase_token);
					const discordUser = await (
						await axios.get(`${DISCORD_API_ENDPOINT}/users/@me`, {
							headers: {
								Authorization: `Bearer ${access_token}`,
							},
						})
					).data;
					const discordAvatarURL = `${DISCORD_CDN}/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`;
					const beforeUpdating = new Date();
					const profileUpdated = updateProfile(user, {
						displayName: discordUser.username,
						photoURL: discordAvatarURL,
					})
					const emailUpdated = updateEmail(user, discordUser.email); 
					const afterUpdating = new Date();

					// console.log('time that updating a profile takes', afterUpdating.getTime() - beforeUpdating.getTime());
					
					// const results = await signInWithCustomToken(auth, firebase_token);
					// if email, photoURL and displayName are not set in results.user, set them
					// Otherwise skip
					// signInWithCustomToken(auth, firebase_token).then((userCredential) => {
					// 	const user = userCredential.user;
					// }).catch((error) => {
					// 	console.error(error);
					// })
				} catch (error) {
					console.error(error);
				}
			}
		}
	}
}
