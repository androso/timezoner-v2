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
	signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import axios from "axios";
import toast from "react-hot-toast";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_DEV as string;
const DISCORD_API_ENDPOINT = process.env.NEXT_PUBLIC_DISCORD_API_ENDPOINT;
const DISCORD_CDN = process.env.NEXT_PUBLIC_DISCORD_CDN;

export default function loginPage() {
	const { user, isLoggedIn, loading, error } = useContext(UserContext);
	const router = useRouter();
	const [validUser, setvalidUser] = useState(false);

	useEffect(() => {
		// if it's loggedIn and is a valid user

		if (!loading && !isLoggedIn && router.query.provider) {
			// console.log("we should be signing only with discord");
			// TODO HERE; make sure to call isValidUser after customSignIn.
			
			customSignIn(router.query, router); //returns a user 
			setvalidUser(true);
			// console.log(user, isLoggedIn);
			// if (isValidUser(user, isLoggedIn)) {
			// 	router.push("/dashboard");
			// }
		} else if (!loading && isLoggedIn && !validUser) {
			// TODO: Add a button here to close it instead of time
			toast.error(
				"looks like you already have an account with a different provider",
				{
					duration: 6000,
				}
			);
		}
		// console.log({
		// 	user,
		// 	isLoggedIn,
		// 	loading,
		// 	error,
		// });
	}, [user, isLoggedIn, loading, error]);

	useEffect(() => {}, [loading]);

	return !loading && !validUser ? <LoginForm /> : <LoadingSpinner />;
}
type AuthQueries = {
	access_token: string;
	firebase_token: string;
	provider: string;
	refresh_token: string;
};

async function customSignIn(queries: ParsedUrlQuery, router: NextRouter) {

	const { provider, firebase_token, access_token, refresh_token } = queries;
	switch (provider) {
		case "discord": {
			if (typeof firebase_token === "string") {
				try {
					const { user } = await signInWithCustomToken(auth, firebase_token);
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

					try {
						await updateEmail(user, discordUser.email);
						router.push("/dashboard");
						return user;
					} catch (error: unknown) {
						if (error instanceof Error) {
							if (
								error.message === "Firebase: Error (auth/email-already-in-use)."
							) {
								console.log("deleting user and returning false");
								deleteUser(user);
								signOut(auth);
								return false;
							}
						}
					}

				} catch (error) {
					console.error(error);
				}
			}
		}
	}
}
