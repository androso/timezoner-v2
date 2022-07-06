import { useAuth } from "../../context/auth";
import { getParsedDataFromUser } from "../client-helpers";

const useParsedUserData = () => {
	const { user, loading, error } = useAuth();
	const parsedUser = getParsedDataFromUser(user);
	return {
		parsedUser,
		loading,
		error,
	};
};
export default useParsedUserData;
