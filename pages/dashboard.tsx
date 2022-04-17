import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import ProtectedRoute from "../components/ProtectedRoute";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { getIdTokenResult } from "firebase/auth";

export default function Dashboard() {

	const userData = useContext(UserContext);
	const [displayName, setdisplayName] = useState('');
	const [avatarURL, setAvatarURL] = useState('');
	const [authProvider, setAuthProvider] = useState(null);
	const logOut = async () => {
		try {
			const result = await signOut(auth);
			console.log("succesfully signed out!");
		} catch(error) {
			console.error(error);
		}
	}

	useEffect(() => {
	  if (userData.user !== null) {
		const user = userData.user;
		setdisplayName(user.displayName);
		setAvatarURL(user.photoURL);
		
		const oauthProvider = user.providerData[0].providerId;
		setAuthProvider(oauthProvider);
	  }

	}, [userData])
	
	return (
		<div>
			<ProtectedRoute options={{ pathAfterFailure: "/login" }}>
					<h1>{displayName}</h1>
					<img src={avatarURL} />
					<button onClick={logOut}>Sign Out</button>
					<p>Provider: {authProvider}</p>
			</ProtectedRoute>
		</div>
	);
}
