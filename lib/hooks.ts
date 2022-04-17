import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
	const [user, loading, error] = useAuthState(auth)
	let isLoggedIn = false;
	if (user) {
		console.log("user is logged in", user);
		isLoggedIn = true;
	}
	return { user, error, loading, isLoggedIn };
};
