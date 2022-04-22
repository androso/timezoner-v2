import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { isValidUser } from "./utils/client-helpers"; 
// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
	const [user, loading, error] = useAuthState(auth);
	// console.log(user, "hooks.ts")
	let isLoggedIn = false;
	if (user != null && !loading ) {
		if (isValidUser(user, true)) {
			isLoggedIn = true;
		}
	}
	return { user, error, loading, isLoggedIn };
};


