import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { UserData } from "./types";

const defaultGoogleAvatarSize = 96;

export const isValidUser = (
	user: User | null | undefined,
	isLoggedIn: boolean
) => {
	if (
		user != null &&
		user.displayName &&
		user.email &&
		user.photoURL &&
		isLoggedIn
	) {
		return true;
	} else {
		return false;
	}
};

// export const getDiscordUser = async (accessToken: string) => {
// 	return axios.get(DISCORD_API_ENDPOINTS.USER, {
// 		headers: {
// 			Authorization: `Bearer ${accessToken}`,
// 		},
// 	});
// };

export const capitalizeFirstLetter = (string: string | null) => {
	if (typeof string === "string") {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	return "";
};

export const sendUserToFirestore = async (user: User, provider: string) => {
	if (provider === "google.com") {
		const userId = user.uid;
		const userDocRef = doc(firestore, "users", userId);
		const userDocSnap = await getDoc(userDocRef);
		if (userDocSnap.exists()) {
			// console.log("we're not writing to database in this case");
			return;
		} else {
			// console.log("we're writing to database");
			return await setDoc(doc(firestore, "users", userId), {
				username: user.displayName,
				email: user.email,
				avatar_url: getHighQualityAvatar(user.photoURL, "google.com"),
				provider,
				id: userId,
			});
		}
	}
};

export const getParsedDataFromUser = (
	user: User | null | undefined
): UserData | null => {
	if (user) {
		const username = user.displayName?.split(" ")[0] || "";
		const provider = user?.providerData[0]?.providerId || "discord";

		let avatar_url = "";
		if (provider === "discord") {
			avatar_url = user.photoURL || "";
		} else {
			//google
			// get a bigger image
			avatar_url = getHighQualityAvatar(user.photoURL ?? "", "google.com");
		}
		return {
			username,
			avatar_url,
			provider,
			id: user.uid,
			email: user.email ?? "",
		};
	}
	return null;
};

export const getProviderFromFirebaseUser = (user: User) => {
	if (user.providerData[0]?.providerId === "google.com") {
		return "google.com";
	} else {
		return "discord.com";
	}
};

export function getHighQualityAvatar(avatar_url: string, provider: string) {
	if (provider === "google.com") {
		return avatar_url.replace(`s${defaultGoogleAvatarSize}-c`, "s256-c");
	} else {
		return avatar_url;
	}
}
