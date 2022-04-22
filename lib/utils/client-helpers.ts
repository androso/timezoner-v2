import { User } from "firebase/auth";

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

