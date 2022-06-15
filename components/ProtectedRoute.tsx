import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth, UserContext } from "../lib/context";
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
	// const { user, loading } = useContext(UserContext);
	const { user, loading } = useAuth();
	if (user) {
		return children;
	} else {
		return <LoginForm />;
	}
}
