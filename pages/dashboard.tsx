//TODO: WHY IS THIS THING SO SLOW?
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { ProtectedRoute } from "../components";
import { isValidUser } from "../lib/utils";
import { User } from "firebase/auth";
const defaultGoogleAvatarSize = 96;

export default function Dashboard() {
	const userData = useContext(UserContext);
	const [displayName, setdisplayName] = useState<null | string>(null);
	const [avatarURL, setAvatarURL] = useState<null | string>(null);
	const [authProvider, setAuthProvider] = useState<null | string>(null);

	const logOut = async () => {
		try {
			const result = await signOut(auth);
			console.log("succesfully signed out!");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (userData.user != null && isValidUser(userData.user, true)) {
			const user = userData.user as User;
			const { username, photoURL, provider} = getParsedDataFromUser(user);
			setdisplayName(username);
			setAvatarURL(photoURL);
			setAuthProvider(provider);
		}
		console.log(userData);
	}, [userData]);

	return (
		<div>
			<ProtectedRoute options={{ pathAfterFailure: "/login" }}>
				<h1>{displayName}</h1>
				<img src={avatarURL || undefined} referrerPolicy="no-referrer" />
				<button onClick={logOut}>Sign Out</button>
				<p>Provider: {authProvider}</p>
			</ProtectedRoute>
		</div>
	);
}

function getParsedDataFromUser(user:User) {
	// let username = '';
	// if (typeof user.displayName === 'string') {
	// 	username = user.displayName?.split(" ")[0];		
	// }
	const username = user.displayName?.split(" ")[0] || '';
	const provider = user?.providerData[0].providerId || 'discord';
	let photoURL = '';
	if (provider === 'discord') { 
		
	} else {
		//google
		// get a bigger image
		photoURL = user.photoURL?.replace(`s${defaultGoogleAvatarSize}-c`, "s164-c") || '';
	}

	return {
		username,
		photoURL,
		provider
	}
}