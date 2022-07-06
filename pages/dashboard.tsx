import React from "react";
import dynamic from "next/dynamic";
import type { BtnLinkProps, BtnProps } from "../components/LightButton";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import useAllUserEvents from "../lib/utils/hooks/useAllUserEvents";
import EventThumbnail from "../components/EventThumbnail";
import {
	collection,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	startAt,
	where,
} from "firebase/firestore";
import { firestore } from "../lib/firebase";
import reactSelect from "react-select";
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
const UpcomingEvents = dynamic(() => import("../components/UpcomingEvents"), {
	ssr: false,
});

export default function Dashboard() {
	//! use collection of events where the user is either the organizer of the event or a participant.
	// We could fetch two pages (10 documents) but only render the first 5 of them.
	// We show the next button if there are more than 5 documents in the allEvents state,
	// if not, it means this is the last page

	const { parsedUser } = useParsedUserData();
	const {
		allEvents,
		status: allEventsStatus,
		setAllEvents,
		lastDocSnap,
		setLastDocSnap
	} = useAllUserEvents();
	const [eventsPageIndex, setEventsPageIndex] = React.useState(0);
	const currentPageEvents = allEvents?.slice(
		eventsPageIndex * 5,
		eventsPageIndex * 5 + 5
	);

	React.useEffect(() => {
		console.log(allEvents);
	});
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
					<div className="mb-6 flex">
						<h1 className="font-bold text-3xl grow">Upcoming Events</h1>
						<button className="p-4 bg-gray-800 rounded-md mr-2">
							Previous
						</button>
						<button
							className="p-4 bg-gray-800 rounded-md "
							onClick={async () => {
								if (!lastDocSnap) {
									console.log(" no more events!");
									return
								}
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
									setAllEvents(prevEvents => {
										if (prevEvents) {
											console.log("this is happening!", {prevEvents, nextBatchOfEvents})
											return [...prevEvents, ...nextBatchOfEvents]
										} else {
											
											return [...nextBatchOfEvents];
										}
									})
									setEventsPageIndex(prevIndex => prevIndex + 1);
									setLastDocSnap(lastEventSnapshot);
								}
							}}
						>
							Next
						</button>
					</div>
					<ul>
						{/* {allEventsStatus === "success" &&
							allEvents &&
							allEvents?.map((event, index) => {
								return (
									<li key={event.id} className="mb-3 relative">
										<EventThumbnail css="mb-2" eventData={event} />
									</li>
								);
							})} */}

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
