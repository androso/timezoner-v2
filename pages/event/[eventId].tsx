import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import type { UserData } from "../../lib/utils/types";
import useEventData from "../../lib/utils/hooks/useEventData";

export default function eventId() {
	const { parsedUser } = useParsedUserData();
	const [organizerData, setOrganizerData] = React.useState<UserData>();
	const { eventData, status, error } = useEventData();

	if (status === "resolved" || status === "loading" || status === "idle") {
		return (
			<ProtectedRoute>
				<Header
					title={eventData?.title ?? undefined}
					screenName="EVENT"
					photoURL={parsedUser?.photoURL ?? undefined}
				/>
				<Container className="pt-4 sm:pt-6">
					<HomeBreadcrumbs currentPage="Event" />
					<h1 className="mb-5">
						Welcome to {organizerData?.username.split(" ")[0]}'s Event
					</h1>
					<p>{eventData?.description ?? "..."}</p>
				</Container>
			</ProtectedRoute>
		);
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
