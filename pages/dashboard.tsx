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
import { isValidUser, getParsedDataFromUser } from "../lib/utils/client-helpers";
import { User } from "firebase/auth";
import Container from "../components/Layouts/Container";



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
			// console.log(user);
		}
	}, [userData]);

	useEffect(() => {
		console.log("userData inside of dashboard", userData);
	}, [userData]);

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

