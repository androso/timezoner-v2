import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { UserContext } from "../lib/context";
import { LoginForm } from "../components";
import { useRouter } from "next/router";
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
	const { user, loading } = useContext(UserContext);
	const router = useRouter();

	if (loading) {
		return <LoadingSpinner />;
	} else if (user) {
		return children;
	} else if (options.pathAfterFailure) {
		router.push(options.pathAfterFailure);
	} else {
		return <LoginForm />;
	}
}
