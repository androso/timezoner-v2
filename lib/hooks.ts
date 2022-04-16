import { auth} from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
	const [user] = useAuthState(auth);
	return { user };
};
