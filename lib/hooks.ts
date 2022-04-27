import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { isValidUser } from "./utils/client-helpers";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
	// Right now we're using this hook just to get info from firebase, we should update it with the discord and google logic too
	const [user, loading, error] = useAuthState(auth);
	const [username, setUsername] = useState<null | string>(null);
	const [avatarURL, setAvatarURL] = useState<null | string>(null);

	let isLoggedIn = false;
	
	if (user != null && !loading) {
		if (isValidUser(user, true)) {
			isLoggedIn = true;
		}
	}

	useEffect(() => {
		// turn off realtime subscription when user is no longer logged in
		let unsubscribe;
		if (user) {
			if (
				user.providerData[0].providerId &&
				user.providerData[0].providerId === "google.com"
			) {
				const docRef = doc(firestore, "users", user.uid);
				unsubscribe = onSnapshot(docRef, (doc) => {
					setUsername(doc.data()?.username);
					setAvatarURL(doc.data()?.avatar_url);
				});
				// console.log("from google!");
			} else {
				// From discord
				// console.log("from discord!");
			}
		} else {
			setUsername(null);
			setAvatarURL(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, error, loading, isLoggedIn };
};
