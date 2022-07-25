import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useEventData from "../../lib/utils/hooks/useEventData";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import "@reach/dialog/styles.css";
import ParticipantOverview from "../../screens/eventId/ParticipantOverview";
import OrganizerOverview from "../../screens/eventId/OrganizerOverview";

export default function EventId() {
	const { eventData, status: eventStatus, error: eventError } = useEventData();
	const { parsedUser } = useParsedUserData();
	// we have to check if eventStatus is success and also if eventData is not null
	// because for useQuery, the action was succesful as long as it didn't throw an error
	// console.log(eventData);
	if (eventStatus === "success" && parsedUser && eventData) {
		if (parsedUser?.id === eventData?.organizer_data.id) {
			return <OrganizerOverview eventData={eventData} />;
		} else {
			return <ParticipantOverview eventData={eventData} />;
		}
	}

	return (
		<ProtectedRoute>
			{(eventStatus === "success" && !eventData) ||
			eventStatus === "loading" ? (
				<LoadingOverview />
			) : eventStatus === "error" ? (
				eventError instanceof Error ? (
					<Container css="pt-8">
						<HomeBreadcrumbs currentPage="Event" />
						<pre>{eventError.message}</pre>
					</Container>
				) : (
					<Container css="pt-8">
						<HomeBreadcrumbs currentPage="Event" />
						<p className="text-yellow-400">
							Sorry, something went wrong with your request, try reloading the
							page
						</p>
					</Container>
				)
			) : null}
		</ProtectedRoute>
	);
}




export function LoadingOverview({ children }: { children?: any }) {
	return (
		<>
			<Header title={undefined} screenName="EVENT" photoURL={undefined} />
			<Container css="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				{children}
			</Container>
		</>
	);
}
