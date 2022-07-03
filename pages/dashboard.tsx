import React from "react";
import dynamic from "next/dynamic";
import type { BtnLinkProps, BtnProps } from "../components/LightButton";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import useAllUserEvents from "../lib/utils/hooks/useAllUserEvents";
import EventThumbnail from "../components/EventThumbnail";

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
	//! use collection of events where the user is either the organizer of the event or a participant.
	const { parsedUser } = useParsedUserData();
	const { allEvents, status: allEventsStatus } = useAllUserEvents();

	return (
		<ProtectedRoute>
			<Header
				title={parsedUser?.username ?? undefined}
				screenName="PROFILE"
				photoURL={parsedUser?.avatar_url ?? undefined}
			/>
			<Container css="pt-4 sm:pt-6">
				<LightButtonLink
					redirectTo="/new-event"
					innerText="Create Event"
					css="mr-5"
				/>
				<LightButton innerText="Join Event" css="mb-9" />
				<div>
					<h1 className="font-bold text-3xl mb-6">Upcoming Events</h1>
					{/* //TODO: SORT THE EVENTS BASED ON FINISH DATE */}
					<ul>
						{allEventsStatus === "success" &&
							allEvents &&
							allEvents.map((event, index) => {
								return (
									<li key={event.id} className="mb-3">
										<EventThumbnail css="mb-2" eventData={event} />
									</li>
								);
							})}
					</ul>
				</div>
			</Container>
		</ProtectedRoute>
	);
}
