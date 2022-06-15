import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { UserData } from "./utils/types";
import { getHighQualityAvatar } from "./utils/client-helpers";

// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
	// Right now we're using this hook just to get info from firebase, we should update it with the discord and google logic too
	const [user, loading, error] = useAuthState(auth);
	if (loading) {
		console.log("loading");
	} else if (error) {
		console.log("we have an error right now");
	} else if (user) {
		console.log("we know have an user");
	} else {
		console.log("exception", { error, loading, user });
	}
	return { user, error, loading };
};
