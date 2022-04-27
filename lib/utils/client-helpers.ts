import axios from "axios";
import { User } from "firebase/auth";
import { DISCORD_API_ENDPOINTS } from "./types";
import {  doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const defaultGoogleAvatarSize = 96;

export const isValidUser = (
	user: User | null | undefined,
	isLoggedIn: boolean
) => {
	if (user) {
		if (user.displayName && user.email && user.photoURL && isLoggedIn) {
			return true;
		}
	}
	return false;
};

export const getDiscordUser = async (accessToken: string) => {
	return axios.get(DISCORD_API_ENDPOINTS.USER, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
};

export const capitalizeFirstLetter = (string: string | null) => {
	if (typeof string === "string") {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	return "";
};

export const sendUserToFirestore = async (user: User, provider: string) => {
	if (provider === "google.com") {
		const userId = user.uid;
		return await setDoc(doc(firestore, "users", userId), {
			username: user.displayName,
			email: user.email,
			avatar_url: user.photoURL,
			provider
		});
	}
};

export const getParsedDataFromUser = (user: User) => {
	const username = user.displayName?.split(" ")[0] || "";
	const provider = user?.providerData[0]?.providerId || "discord";
	
	let photoURL = "";
	if (provider === "discord") {
		photoURL = user.photoURL || "";
	} else {
		//google
		// get a bigger image
		photoURL =
			user.photoURL?.replace(`s${defaultGoogleAvatarSize}-c`, "s256-c") || "";
	}
	return {
		username,
		photoURL,
		provider,
	};
}
