//TODO: WHY IS THIS THING SO SLOW?
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../lib/context";
import dynamic from "next/dynamic";

import {
	isValidUser,
	getParsedDataFromUser,
} from "../lib/utils/client-helpers";
import { User } from "firebase/auth";
import { useRouter } from "next/router";

const Container = dynamic(() => import("../components/Layouts/Container"), {
	ssr: false,
});

const Header = dynamic(() => import("../components/Header"), { ssr: false });

const ProtectedRoute = dynamic(() => import("../components/ProtectedRoute"), {
	ssr: false,
});

const LightButton = dynamic(() => import("../components/LightButton"), {
	ssr: false,
});

const UpcomingEvents = dynamic(() => import("../components/UpcomingEvents"), {
	ssr: false,
});

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
					<LightButton
						innerText="Create Event"
						className="mr-5"
						clickFunc={() => router.push("/new-event")}
					/>
					<LightButton innerText="Join Event" />
					<UpcomingEvents />
				</Container>
			</ProtectedRoute>
		</div>
	);
}
