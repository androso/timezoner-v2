import React from "react";
import { useAuth } from "../../context/auth";
import { getParsedDataFromUser } from "../client-helpers";
import { UserData } from "../types";

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
