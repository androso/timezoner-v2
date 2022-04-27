//TODO: WHY IS THIS THING SO SLOW?
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth, firestore } from "../lib/firebase";
import { signOut } from "firebase/auth";
import {
	ProtectedRoute,
	Header,
	LightButton,
	UpcomingEvents,
} from "../components";
import { isValidUser } from "../lib/utils/client-helpers";
import { User } from "firebase/auth";
import Container from "../components/Layouts/Container";
import { collection, addDoc } from "firebase/firestore";

const defaultGoogleAvatarSize = 96;

export default function Dashboard() {
	const userData = useContext(UserContext);
	const [username, setusername] = useState<null | string>(null);
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

			const { username, photoURL, provider } = getParsedDataFromUser(user);
			setusername(username);
			setAvatarURL(photoURL);
			setAuthProvider(provider);
			console.log(user);
		}
	}, [userData]);

	useEffect(() => {
		console.log("first render of /dashboard!");
	}, []);

	// const submitUserData = async () => {
	// 	console.log("sending to db");
	// 	const docRef = await addDoc(collection(firestore, "users"), {
	// 		username,
	// 		avatar_url: avatarURL,
	// 	});
	// 	console.log("Document written with ID: ", docRef.id);
	// };

	return (
		<div>
			<ProtectedRoute options={{ pathAfterFailure: "/login" }}>
				<Header
					{...{ authProvider, username }}
					screenName="PROFILE"
					photoURL={avatarURL}
				/>
				<Container className="pt-4 sm:pt-6">
					<LightButton innerText="Create Event" className="mr-5" />
					<LightButton innerText="Join Event" />
					<UpcomingEvents />
				</Container>
			</ProtectedRoute>
		</div>
	);
}

function getParsedDataFromUser(user: User) {
	const username = user.displayName?.split(" ")[0] || "";
	const provider = user?.providerData[0]?.providerId || "discord";
	console.log(provider);
	let photoURL = "";
	if (provider === "discord") {
		photoURL = user.photoURL || "";
	} else {
		//google
		// get a bigger image
		photoURL =
			user.photoURL?.replace(`s${defaultGoogleAvatarSize}-c`, "s256-c") || "";
	}

	return {
		username,
		photoURL,
		provider,
	};
}
