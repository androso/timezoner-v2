//TODO: WHY IS THIS THING SO SLOW?
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import {
	ProtectedRoute,
	Header,
	LightButton,
	UpcomingEvents,
} from "../components";
import { isValidUser, getParsedDataFromUser } from "../lib/utils/client-helpers";
import { User } from "firebase/auth";
import Container from "../components/Layouts/Container";
import { useRouter } from "next/router";


export default function Dashboard() {
	const userData = useContext(UserContext);
	const [username, setusername] = useState<null | string>(null);
	const [avatarURL, setAvatarURL] = useState<null | string>(null);
	const [authProvider, setAuthProvider] = useState<null | string>(null);
	const router = useRouter();

	useEffect(() => {
		if (userData.user != null && isValidUser(userData.user, true)) {
			const user = userData.user as User;
			const { username, photoURL, provider } = getParsedDataFromUser(user);
			setusername(username);
			setAvatarURL(photoURL);
			setAuthProvider(provider);
		}
	}, [userData]);

	return (
		<div>
			<ProtectedRoute options={{ pathAfterFailure: "/login" }}>
				<Header
					{...{ authProvider, username }}
					screenName="PROFILE"
					photoURL={avatarURL}
				/>
				<Container className="pt-4 sm:pt-6">
					<LightButton innerText="Create Event" className="mr-5" clickFunc={() => router.push('/new-event')}/>
					<LightButton innerText="Join Event" />
					<UpcomingEvents />
				</Container>
			</ProtectedRoute>
		</div>
	);
}

