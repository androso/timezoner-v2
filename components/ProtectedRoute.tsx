import dynamic from "next/dynamic";
import React from "react";
import { useAuth } from "../lib/context/auth";

const DynamicLoginForm = dynamic(() => import("../components/LoginForm"), {
	ssr: false,
});

type props = {
	children?: any;
	options?: {
		pathAfterFailure: string;
	};
};

// if we don't have a user we render login form
export default function ProtectedRoute({
	children,
	options = { pathAfterFailure: "/login" },
}: props) {
	const { user, loading } = useAuth();
	if (user && !loading) {
		return children;
	} else if (user == null && !loading) {
		return <DynamicLoginForm />;
	}
}