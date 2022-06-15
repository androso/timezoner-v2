//TODO: WHY IS THIS THING SO SLOW?
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../lib/context";
import dynamic from "next/dynamic";
import { getParsedDataFromUser } from "../lib/utils/client-helpers";
import { User } from "firebase/auth";
import { BtnLinkProps, BtnProps } from "../components/LightButton";

const Container = dynamic(() => import("../components/Layouts/Container"), {
	ssr: false,
});

const Header = dynamic(() => import("../components/Header"), { ssr: false });

const ProtectedRoute = dynamic(() => import("../components/ProtectedRoute"), {
	ssr: false,
});

const LightButtonLink = dynamic<BtnLinkProps>(
	() => import("../components/LightButton").then((md) => md.LightButtonLink),
	{
		ssr: false,
	}
);
const LightButton = dynamic<BtnProps>(
	() => import("../components/LightButton").then((md) => md.LightButton),
	{ ssr: false }
);
const UpcomingEvents = dynamic(() => import("../components/UpcomingEvents"), {
	ssr: false,
});

export default function Dashboard() {
	const userData = useContext(UserContext);
	const [username, setusername] = useState<null | string>(null);
	const [avatarURL, setAvatarURL] = useState<null | string>(null);

	useEffect(() => {
		if (userData.user != null) {
			const user = userData.user as User;
			const { username, photoURL } = getParsedDataFromUser(user);
			setusername(username);
			setAvatarURL(photoURL);
		}
	}, [userData]);

	return (
		<div>
			<ProtectedRoute>
				<Header username={username} screenName="PROFILE" photoURL={avatarURL} />
				<Container className="pt-4 sm:pt-6">
					<LightButtonLink
						redirectTo="/new-event"
						innerText="Create Event"
						css="mr-5"
					/>
					<LightButton innerText="Join Event" />
					<UpcomingEvents />
				</Container>
			</ProtectedRoute>
		</div>
	);
}
