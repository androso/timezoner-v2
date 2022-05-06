import React, { useState, useEffect, useContext, ReactChildren } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";

type props = {
	children: any;
	options: {
		pathAfterFailure: string
	};
};

export default function ProtectedRoute({ children, options = {pathAfterFailure: '/login'} }: props) {
	const {user, isLoggedIn, loading, userData} = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		
		if (isLoggedIn) {
			setIsLoading(false);
		} else if (isLoggedIn === false && loading === false && user === null) { 
			router.push(options.pathAfterFailure)
		}
	}, [user, isLoggedIn, loading, userData]);

	return (
		isLoading ? <LoadingSpinner/>
		:
		children
	);
}
