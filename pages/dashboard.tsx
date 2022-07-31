import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import type { BtnLinkProps, BtnProps } from "../components/LightButton";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import EventThumbnail from "../components/EventThumbnail";

import { useAllEvents } from "../lib/context/allUserEvents";
import LoginForm from "../components/LoginForm";
import LoadingSpinner from "../components/LoadingSpinner";

const Container = dynamic(() => import("../components/Layouts/Container"), {
	ssr: false,
});

const Header = dynamic(() => import("../components/Header"), { ssr: false });

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

export default function Dashboard() {
	const { parsedUser, loading: userIsLoading } = useParsedUserData();
	const {
		allEvents,
		status: allEventsStatus,
		reset: resetEvents,
		refetch,
		error,
	} = useAllEvents();

	const [eventsPageIndex, setEventsPageIndex] = React.useState(0);
	const currentPageEvents = allEvents?.slice(
		eventsPageIndex * 5,
		eventsPageIndex * 5 + 5
	);
	const handlePreviousPage = () =>
		setEventsPageIndex((prevIndex) => prevIndex - 1);

	React.useLayoutEffect(() => {
		if (!parsedUser) return;
		resetEvents();
		refetch();
	}, []);

	useEffect(() => {
		setEventsPageIndex(0);
	}, [parsedUser]);

	const handleNextPage = async () => {
		if (allEvents) {
			const currentIndex = eventsPageIndex + 1; // so that we start from 1 instead of 0
			const numberOfPagesAvailable = Math.ceil(allEvents.length / 5);
			if (currentIndex === numberOfPagesAvailable) {
				return;
			}
			setEventsPageIndex((prevIndex) => prevIndex + 1);
		}
	};

	if (!parsedUser && !userIsLoading) {
		return (
			<>
				<LoginForm />
			</>
		);
	}

	return (
		<>
			<Header
				title={parsedUser?.username ?? undefined}
				screenName="PROFILE"
				photoURL={parsedUser?.avatar_url ?? undefined}
			/>
			<Container css="pt-4 sm:pt-6">
				<LightButtonLink
					redirectTo="/new-event"
					innerText="Create Event"
					css="mr-5 mb-3 sm:mb-9"
				/>
				<LightButton innerText="Join Event" css="mb-9" />
				<div>
					<div className="mb-6 flex flex-col sm:flex-row ">
						<h1 className="font-bold text-3xl grow mb-5">Upcoming Events</h1>
						<div className="flex">
							<button
								className="h-1/2 self-center p-3 sm:h-min  bg-gray-800 rounded-md mr-2  disabled:bg-gray-500"
								disabled={eventsPageIndex === 0 ? true : false}
								onClick={handlePreviousPage}
							>
								Previous
							</button>
							<p className="self-center mr-2 ">{eventsPageIndex + 1}</p>
							<button
								className={`h-1/2  self-center p-3 sm:h-min bg-gray-800 rounded-md disabled:bg-gray-500`}
								disabled={
									allEvents?.[0]
										? eventsPageIndex + 1 === Math.ceil(allEvents?.length / 5)
											? true
											: false
										: true
								}
								onClick={handleNextPage}
							>
								Next
							</button>
						</div>
					</div>
					<ul>
						{allEventsStatus === "resolved" && currentPageEvents ? (
							currentPageEvents.map((event) => {
								return (
									<li key={event.id} className="mb-3 relative">
										<EventThumbnail css="mb-2" eventData={event} />
									</li>
								);
							})
						) : error ? (
							<p>Error: {error.message}</p>
						) : (
							<LoadingSpinner css="!h-48" />
						)}
					</ul>
				</div>
			</Container>
		</>
	);
}
