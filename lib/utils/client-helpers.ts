import axios from "axios";
import { User } from "firebase/auth";
import { DISCORD_API_ENDPOINTS } from "./types";


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

export const getDiscordUser = async (accessToken:string) => {
	return axios.get(DISCORD_API_ENDPOINTS.USER, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		}
	})
}