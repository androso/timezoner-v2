import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useEventData from "../../lib/utils/hooks/useEventData";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import LoadingSpinner from "../../components/LoadingSpinner";
import { EventData } from "../../lib/utils/types";
import EventAvailabalityTable from "../../components/EventAvailabalityTable";
import { EventsProvider } from "../../lib/context/allUserEvents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
	return (
		<EventsProvider>
			<EventId />
		</EventsProvider>
	);
}

function EventId() {
	const { eventData, status, error } = useEventData();
	const { parsedUser } = useParsedUserData();

	if (status === "success") {
		if (parsedUser && eventData) {
			if (parsedUser?.id === eventData?.organizer_data.id) {
				return <OrganizerOverview eventData={eventData} />;
			} else {
				return <ParticipantOverview eventData={eventData} />;
			}
		}
	}
	if (status === "error") {
		return (
			<ProtectedRoute>
				{error instanceof Error ? (
					<Container css="pt-8">
						<HomeBreadcrumbs currentPage="Event" />
						<pre>{error.message}</pre>
					</Container>
				) : (
					<Container css="pt-8">
						<HomeBreadcrumbs currentPage="Event" />
						<p className="text-yellow-400">
							Sorry, something went wrong with your request, try reloading the
							page
						</p>
					</Container>
				)}
			</ProtectedRoute>
		);
	}
	// if (status === "loading" || status === "idle") {
	return (
		<ProtectedRoute>
			<LoadingOverview />
		</ProtectedRoute>
	);
	// }
}

function OrganizerOverview({ eventData }: { eventData: EventData }) {
	return (
		<>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container css="pt-4 sm:pt-6 relative">
				<HomeBreadcrumbs currentPage="Event Overview" />
				<h2>Event availability</h2>
				{/* // TODO: add settings icon here ! */}
				<button
					className="relative dark-btn-transition bg-gradient-to-t from-darkBtnBottomColor to-darkBtnTopColor py-2 px-5 rounded-md text-sm font-bold before:rounded-md flex "
					onClick={() => console.log("showing the form ! ")}
				>
					<FontAwesomeIcon icon={faGear} className="w-5 h-5 mr-2"/>
					Settings
				</button>
				{/* //TODO: ADD TABLE HERE */}
				<EventAvailabalityTable />
			</Container>
		</>
	);
}

function ParticipantOverview({ eventData }: { eventData: EventData }) {
	return (
		<>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container css="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
			</Container>
		</>
	);
}

function LoadingOverview() {
	return (
		<>
			<Header title={undefined} screenName="EVENT" photoURL={undefined} />
			<Container css="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				<LoadingSpinner css="!h-60" />
			</Container>
		</>
	);
}
