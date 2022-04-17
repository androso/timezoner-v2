import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../lib/context";
import { useRouter } from "next/router";
import { LoginForm, LoadingSpinner } from "../components";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_DEV as string;

export default function loginPage() {
	const userData = useContext(UserContext);
	const { user, isLoggedIn, loading, error } = useContext(UserContext);

	const router = useRouter();

	useEffect(() => {
		if (userData.user != null) {
			router.push("/dashboard");
		}
		console.log(userData);
	}, [userData]);

	return (
		(!loading && !isLoggedIn) ? (
			<LoginForm />
		) : (
			<LoadingSpinner />
		)
	) 
}
