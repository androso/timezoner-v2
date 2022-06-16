import { createContext, useContext } from "react";
import { User } from "firebase/auth";
import { LoadingSpinner, LoginForm } from "../components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";


export interface userContextType {
	user: User | null | undefined;
	error: Error | undefined;
	loading: boolean;
}

export const UserContext = createContext<userContextType>({
	user: null,
	error: new Error("default values"),
	loading: true,
});
UserContext.displayName = "UserContext";

export const useAuth = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error(`useAuth must be used within a AuthProvider`);
	}
	return context;
};

export const AuthProvider = ({ children }: { children: any }) => {
	const [user, loading, error] = useAuthState(auth);

	const userData = {
		user,
		loading,
		error,
	};

	//TODO: Login, logout functions

	if (loading) {
		return <LoadingSpinner />;
	} else if (error) {
		// TODO: we should return a react error boundary with a fallback here
		// maybe show the toaster that says "you already have an ac	count with discord"
		return (
			<div role="alert">
				<p>Uh oh... There's a problem. Try refreshing the app.</p>
				<pre>{error.message}</pre>
			</div>
		);
	} else if (user) {
		return (
			<UserContext.Provider value={userData}>{children}</UserContext.Provider>
		);
	} else {
		return <LoginForm />;
	}
};
