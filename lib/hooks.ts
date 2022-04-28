import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	isValidUser,
	getProviderFromFirebaseUser,
} from "./utils/client-helpers";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { UserData } from "./utils/types";

// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
	// Right now we're using this hook just to get info from firebase, we should update it with the discord and google logic too
	const [user, loading, error] = useAuthState(auth);
	const [username, setUsername] = useState<null | string>(null);
	const [avatarURL, setAvatarURL] = useState<null | string>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		// turn off realtime subscription when user is no longer logged in
		let unsubscribe;

		if (user != null && !loading && isValidUser(user, true)) {
			setIsLoggedIn(true);
			// if (
			// 	getProviderFromFirebaseUser(user) === "google.com"
			// ) {
			// 	const docRef = doc(firestore, "users", user.uid);
			// 	unsubscribe = onSnapshot(docRef, (doc) => {
			// 		const data = doc.data() as UserData;
			// 		setUserData({
			// 			...data,
			// 			avatar_url: getHighQualityAvatar(data.avatar_url, data.provider),
			// 		});
			// 	});
			// } else {
			// 	// From discord

			// }
			const docRef = doc(firestore, "users", user.uid);

			unsubscribe = onSnapshot(docRef, (doc) => {
				const data = doc.data() as UserData;
				if (data) {
					setUserData({
						...data,
						avatar_url: getHighQualityAvatar(data.avatar_url, data.provider),
					});
				}
			});
		} else if (!loading) {
			setIsLoggedIn(false);
			setUsername(null);
			setAvatarURL(null);
		}

		// if (user && isLoggedIn) {

		// } else {

		// }

		return unsubscribe;
	}, [user, loading]);

	useEffect(() => {
		// if (userData) {
		// 	console.log("parsed user data", userData);
		// }
		// console.log("user from hooks", user);
	}, [user]);

	return { user, error, loading, isLoggedIn, userData };
};

const defaultGoogleAvatarSize = 96;

function getHighQualityAvatar(avatar_url: string, provider: string) {
	if (provider === "google.com") {
		return avatar_url.replace(`s${defaultGoogleAvatarSize}-c`, "s256-c");
	} else {
		return avatar_url;
	}
}
