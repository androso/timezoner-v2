import React from "react";
import { useAuth } from "../../context/auth";
import { getParsedDataFromUser } from "../client-helpers";

const useParsedUserData = () => {
	const { user, loading, error } = useAuth();
	const parsedUser = React.useMemo(() => getParsedDataFromUser(user), [user]);

	return {
		parsedUser,
		loading,
		error,
	};
};
export default useParsedUserData;
