import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import LoadingSpinner from "../components/LoadingSpinner";
export default function dashboard() {
	const userData = useContext(UserContext);

	useEffect(() => {
		if (userData?.user != null) {
			console.log(userData);
		}
	}, [userData]);

	return (
		<div>
			{userData.user != null ? (
				<>
					<h1>{userData.user.displayName}</h1>
					<img src={userData.user.photoURL} />
				</>
			) : (
				<LoadingSpinner />
			)}
		</div>
	);
}
