import axios from "axios";
import { User } from "firebase/auth";
import { DISCORD_API_ENDPOINTS } from "./types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore, googleAuthProvider } from "../firebase";

const defaultGoogleAvatarSize = 96;

export const isValidUser = (
	user: User | null | undefined,
	isLoggedIn: boolean
) => {
	if (user) {
		// console.log("validating user", user, "isloggedin", isLoggedIn);
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
	//     - if document exist
	//       - we use that
	//     - if not we create that document
	//       - we set that document to our global user

	if (provider === "google.com" || provider === 'discord.com') {
		const userId = user.uid;
		const userDocRef = doc(firestore, "users", userId);
		const userDocSnap = await getDoc(userDocRef);
		if (userDocSnap.exists()) {
			console.log("we're not writing to database in this case");
			return;
		} else {
			console.log("we're writing to database");
			return await setDoc(doc(firestore, "users", userId), {
				username: user.displayName,
				email: user.email,
				avatar_url: user.photoURL,
				provider,
			});
		}
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
};


export const getProviderFromFirebaseUser = (user:User) => {
	if (user.providerData[0]?.providerId === 'google.com') {
		return "google.com";
	} else { 
		return "discord.com";
	}
}