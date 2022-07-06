import React from "react";
import dynamic from "next/dynamic";
import type { BtnLinkProps, BtnProps } from "../components/LightButton";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import useAllUserEvents from "../lib/utils/hooks/useAllUserEvents";
import EventThumbnail from "../components/EventThumbnail";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { getUserEventsData } from "../lib/utils/client-helpers";

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

export default function Dashboard() {
	//! use collection of events where the user is either the organizer of the event or a participant.
	// currently we're only fetching events organized
	const { parsedUser } = useParsedUserData();
	const {
		allEvents,
		status: allEventsStatus,
		setAllEvents,
		lastDocSnap,
		setLastDocSnap,
	} = useAllUserEvents();
	const [eventsPageIndex, setEventsPageIndex] = React.useState(0);
	const currentPageEvents = allEvents?.slice(
		eventsPageIndex * 5,
		eventsPageIndex * 5 + 5
	);

	const handlePreviousPage = () =>
		setEventsPageIndex((prevIndex) => prevIndex - 1);

	const handleNextPage = async () => {
		if (allEvents) {
			const currentIndex = eventsPageIndex + 1; // so that we start from 1 instead of 0
			const numberOfPagesAvailable = Math.ceil(allEvents.length / 5);
			const isPageSecondToLast = numberOfPagesAvailable - 1 === currentIndex;

			if (!lastDocSnap && currentIndex === numberOfPagesAvailable) {
				console.log("button next should be disabled, find a way");
				return;
			}

			if (isPageSecondToLast && lastDocSnap) {
				// we fetch
				if (parsedUser) {
					const eventsQuery = query(
						collection(firestore, "events"),
						where("organizer_id", "==", parsedUser.id),
						orderBy("date_range.start_date"),
						startAfter(lastDocSnap),
						limit(10)
					);

					const snapshot = await getDocs(eventsQuery);
					const { participatingEvents: nextBatchOfEvents, lastEventSnapshot } =
						await getUserEventsData(snapshot);

					setAllEvents((prevEvents) => {
						if (prevEvents) {
							return [...prevEvents, ...nextBatchOfEvents];
						} else {
							return [...nextBatchOfEvents];
						}
					});
					setEventsPageIndex((prevIndex) => prevIndex + 1);
					if (!nextBatchOfEvents[0]) {
						console.log("we should disable the button now");
						setLastDocSnap(undefined);
					} else {
						setLastDocSnap(lastEventSnapshot);
					}
					return;
				}
			}
			// we update the index by default
			setEventsPageIndex((prevIndex) => prevIndex + 1);
		}
	};

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
									allEvents &&
									eventsPageIndex + 1 === Math.ceil(allEvents?.length / 5)
										? true
										: false
								}
								onClick={handleNextPage}
							>
								Next
							</button>
						</div>
					</div>
					<ul>
						{allEventsStatus === "success" &&
							currentPageEvents &&
							currentPageEvents.map((event, index) => {
								return (
									<li key={event.id} className="mb-3 relative">
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
