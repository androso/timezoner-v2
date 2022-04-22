//TODO: WHY IS THIS THING SO SLOW?
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { ProtectedRoute } from "../components";
import { isValidUser } from "../lib/utils/client-helpers";
import { User } from "firebase/auth";
const defaultGoogleAvatarSize = 96;
import Image from "next/image";

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
				<div className="w-avatar-sm-w md:w-40 relative ">
					<Image 
						src={avatarURL || ""}
						width="128"
						height="128"
						layout="responsive"
						className="rounded-full"
						priority
						quality="100"
					/>
				</div> 
				
				<button className="block" onClick={logOut}>Sign Out</button>
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
	const provider = user?.providerData[0]?.providerId || 'discord';
	console.log(provider); 
	let photoURL = '';
	if (provider === 'discord') { 
		photoURL = user.photoURL || '';
	} else {
		//google
		// get a bigger image
		photoURL = user.photoURL?.replace(`s${defaultGoogleAvatarSize}-c`, "s256-c") || '';
	}

	return {
		username,
		photoURL,
		provider
	}
}