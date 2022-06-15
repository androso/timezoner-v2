import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";
import { LoginForm } from "../components";

type props = {
	children: any;
	options: {
		pathAfterFailure: string;
	};
};

export default function ProtectedRoute({
	children,
	options = { pathAfterFailure: "/login" },
}: props) {
	const { user, loading } = useContext(UserContext);

	if (loading) {
		return <LoadingSpinner />;
	} else if (user) {
		return children;
	} else {
		return <LoginForm />;
		// router.push(options.pathAfterFailure, undefined, {shallow: true });
	}
}
