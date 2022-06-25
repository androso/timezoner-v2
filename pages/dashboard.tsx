import React from "react";
import { useAuth } from "../lib/context";
import dynamic from "next/dynamic";
import { getParsedDataFromUser } from "../lib/utils/client-helpers";
import type { BtnLinkProps, BtnProps } from "../components/LightButton";

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
	const { user } = useAuth();
	const parsedUserData = getParsedDataFromUser(user);

	return (
		<div>
			<ProtectedRoute>
				<Header
					title={parsedUserData?.username ?? undefined}
					screenName="PROFILE"
					photoURL={parsedUserData?.photoURL ?? undefined}
				/>
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
