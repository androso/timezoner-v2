import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useEventData from "../../lib/utils/hooks/useEventData";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import LoadingSpinner from "../../components/LoadingSpinner";
import { EventDataFromFirestore } from "../../lib/utils/types";
import EventAvailabalityTable from "../../components/EventAvailabalityTable";

export default function eventId() {
	const { eventData, status, error } = useEventData();
	const { parsedUser } = useParsedUserData();

	if (status === "loading" || status === "idle") {
		return <LoadingOverview />;
	}

	if (status === "resolved") {
		if (parsedUser && eventData) {
			if (parsedUser?.id === eventData?.organizer_data.id) {
				return <OrganizerOverview eventData={eventData} />;
			} else {
				return <ParticipantOverview eventData={eventData} />;
			}
		}
	}

	if (status === "rejected") {
		return (
			<ProtectedRoute>
				<p className="text-yellow-400">
					Sorry, something went wrong with your request, try reloading the page
				</p>
				<pre>{error ? JSON.stringify(error) : null}</pre>
			</ProtectedRoute>
		);
	}
}

function OrganizerOverview({
	eventData,
}: {
	eventData: EventDataFromFirestore;
}) {
	return (
		<>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container className="pt-4 sm:pt-6 relative">
				<HomeBreadcrumbs currentPage="Event Overview" />
				<h2>Event availability</h2>
				{/* // TODO: add settings icon here ! */}
				<button className="relative dark-btn-transition bg-gradient-to-t from-darkBtnBottomColor to-darkBtnTopColor py-2 px-5 rounded-md text-sm font-bold before:rounded-md" onClick={() => console.log("showing the form ! ")}>
					Settings
				</button>
				{/* //TODO: ADD TABLE HERE */}
				<EventAvailabalityTable/>
			</Container>
		</>
	);
}

function ParticipantOverview({
	eventData,
}: {
	eventData: EventDataFromFirestore;
}) {
	return (
		<>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container className="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
			</Container>
		</>
	);
}

function LoadingOverview() {
	return (
		<>
			<Header title={undefined} screenName="EVENT" photoURL={undefined} />
			<Container className="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="..." />
				<LoadingSpinner css="h-60" />
			</Container>
		</>
	);
}
