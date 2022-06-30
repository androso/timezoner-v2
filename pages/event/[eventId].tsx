import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useEventData from "../../lib/utils/hooks/useEventData";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import LoadingSpinner from "../../components/LoadingSpinner";
import { EventDataFromFirestore } from "../../lib/utils/types";

export default function eventId() {
	const { eventData, status, error } = useEventData();
	const { parsedUser } = useParsedUserData();
	//TODO: Show one component / screen if the user loggedIn is the organizer of this event

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
			<Container className="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
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
				<HomeBreadcrumbs currentPage="Event" />
				<LoadingSpinner css="h-60" />
			</Container>
		</>
	);
}
