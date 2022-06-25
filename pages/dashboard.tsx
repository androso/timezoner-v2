import React from "react";
import dynamic from "next/dynamic";
import type { BtnLinkProps, BtnProps } from "../components/LightButton";
import { useParsedUserData } from "../lib/utils/hooks";

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
	const { parsedUser } = useParsedUserData();	

	return (
		<div>
			<ProtectedRoute>
				<Header
					title={parsedUser?.username ?? undefined}
					screenName="PROFILE"
					photoURL={parsedUser?.photoURL ?? undefined}
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
