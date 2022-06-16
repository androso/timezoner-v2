import React from "react";
import { useAuth } from "../lib/context";
import { LoginForm } from "../components";

type props = {
	children: any;
	options?: {
		pathAfterFailure: string;
	};
};

export default function ProtectedRoute({
	children,
	options = { pathAfterFailure: "/login" },
}: props) {
	// const { user, loading } = useContext(UserContext);
	const { user } = useAuth();
	if (user) {
		return children;
	} else {
		return <LoginForm />;
	}
}
