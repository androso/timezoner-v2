import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../lib/context";
import { useRouter, } from "next/router";
import { NextRouter } from "next/router";
import { LoginForm, LoadingSpinner } from "../components";
import { ParsedUrlQuery } from "querystring";
import {
	signInWithCustomToken,
	updateProfile,
	updateEmail,
	deleteUser,
	getRedirectResult,
	signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import axios from "axios";
import toast from "react-hot-toast";
import { isValidUser } from "../lib/utils";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_DEV as string;
const DISCORD_API_ENDPOINT = process.env.NEXT_PUBLIC_DISCORD_API_ENDPOINT;
const DISCORD_CDN = process.env.NEXT_PUBLIC_DISCORD_CDN;

export default function loginPage() {
	const { user, isLoggedIn, loading, error } = useContext(UserContext);
	const router = useRouter();
	const [validUser, setvalidUser] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);

	useEffect(() => {
		// if it's loggedIn and is a valid user
		if (!loading && !isLoggedIn && router.query.provider && !invalidEmail) {

			customSignIn(router.query, router).then(userCredentials => {
				if (!isValidUser(userCredentials, true)) {
					setInvalidEmail(true);
				} else {
					setvalidUser(true);
				}
			}) 

		} else if (isLoggedIn && user?.providerData[0]?.providerId === 'google.com') {
			// TODO: prevent user from login with google after login in with discord (rn firebase doesn't throw an error);
			// const validateGoogleLogin = async () => {
			// 	const results = await getRedirectResult(auth);
			// 	if (results) {
			// 		setvalidUser(true);
			// 		router.push("/dashboard");	
			// 	}
			// }
			// validateGoogleLogin();
			router.push("/dashboard");

		}
	}, [isLoggedIn, loading, error, invalidEmail]);

	if (!loading && !isValidUser(user, isLoggedIn)) {
		return <LoginForm />
	} else {
		return <LoadingSpinner/>
	}
	
}


async function customSignIn(queries: ParsedUrlQuery, router: NextRouter) {

	const { provider, firebase_token, access_token, refresh_token } = queries;
	switch (provider) {
		case "discord": {
			// console.log("login discord")			
			if (typeof firebase_token === "string") {
				try {
					var { user } = await signInWithCustomToken(auth, firebase_token);
					const discordUser = await (
						await axios.get(`${DISCORD_API_ENDPOINT}/users/@me`, {
							headers: {
								Authorization: `Bearer ${access_token}`,
							},
						})
					).data;
					const discordAvatarURL = `${DISCORD_CDN}/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`;

					const profileUpdated = updateProfile(user, {
						displayName: discordUser.username,
						photoURL: discordAvatarURL,
					});

					await updateEmail(user, discordUser.email);
					router.push("/dashboard");
					return user;

				} catch (error:unknown) {
					if (error instanceof Error) {
						if (error.message === "Firebase: Error (auth/email-already-in-use).") {
							toast.error(
								"looks like you already have an account with a different provider",
								{
									duration: 6000,
								}
							);
							await deleteUser(user);
						}
					}
					return null;
				}
			}
		}
	}
	
}
