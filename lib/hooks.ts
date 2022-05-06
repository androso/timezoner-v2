import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// import {
// 	// isValidUser,
// 	getProviderFromFirebaseUser,
// } from "./utils/client-helpers";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { UserData } from "./utils/types";
import { User } from "firebase/auth";
// Custom hook to read  auth record and user profile doc

export const useUserData = () => {
	// Right now we're using this hook just to get info from firebase, we should update it with the discord and google logic too
	const [user, loading, error] = useAuthState(auth);
	const [username, setUsername] = useState<null | string>(null);
	const [avatarURL, setAvatarURL] = useState<null | string>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	// let isLoggedIn = false;
	// useEffect(() => {
	// 	if (user != null && !loading) {
	// 		if (isValidUser(user, true)) {
	// 			isLoggedIn = true;
	// 		}
	// 	}
	// }, [user, loading])

	useEffect(() => {
		// turn off realtime subscription when user is no longer logged in
		// console.log("useEffect inside hooks.ts", {
		// 	user, loading
		// })
		if (user?.displayName != null) { 
			console.log(user.displayName);
		}
		let unsubscribe;
		if (user != null && !loading) {
			setIsLoggedIn(true);
			const docRef = doc(firestore, "users", user.uid);
			// console.log("before getting snapshot")

			unsubscribe = onSnapshot(docRef, (doc) => {
				const data = doc.data() as UserData;

				if (data) {
					// console.log("user was found in database");
					setUserData({
						...data,
						avatar_url: getHighQualityAvatar(data.avatar_url, data.provider),
					});
				} else {
					// console.log("user was not found in databae");
				}
			});
		} else if (!loading) {
			// console.log("setting to false")
			setIsLoggedIn(false);
			// isLoggedIn = false;
			setUsername(null);
			setAvatarURL(null);
		}

		// if (user && isLoggedIn) {

		// } else {

		// }

		return unsubscribe;
	}, [user, loading]);

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

function isValidUser(user: User | null | undefined, isLoggedIn: boolean) {
	if (user != null && isLoggedIn) {
		return true;
	} else {
		console.log("invalid User!", { user, isLoggedIn });
		return false;
	}
}
