import { createContext, useContext } from "react";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import dynamic from "next/dynamic";

const DynamicLoadingSpinner = dynamic(
	() => import("../../components/LoadingSpinner"),
	{
		ssr: false,
	}
);
export interface userContextType {
	user: User | null | undefined;
	error: Error | undefined;
	loading: boolean;
}

const UserContext = createContext<userContextType | undefined>(
	undefined
);
UserContext.displayName = "UserContext";

export const AuthProvider = ({ children }: { children: any }) => {
	const [user, loading, error] = useAuthState(auth);

	const userData = {
		user,
		loading,
		error,
	};

	if (loading) {
		return <DynamicLoadingSpinner />;
	} else if (error) {
		// TODO: we should return a react error boundary with a fallback here
		return (
			<div role="alert">
				<p>Uh oh... There's a problem. Try refreshing the app.</p>
				<pre>{error.message}</pre>
			</div>
		);
	}
	return (
		<UserContext.Provider value={userData}>{children}</UserContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error(`useAuth must be used within a AuthProvider`);
	}
	return context;
};
