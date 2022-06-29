import React from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import type { UserData } from "../../lib/utils/types";
import useEventData from "../../lib/utils/hooks/useEventData";

/* We're gonna need
   - Event data
   - User data (avatar)
*/
export default function eventId() {
	const { parsedUser } = useParsedUserData();
	const [organizerData, setOrganizerData] = React.useState<UserData>();
	const { eventData, status, error} = useEventData();

	React.useEffect(() => {
		console.log("first time rendering event overview !")
	}, [])

	if (status === "loading" || status === "idle") {

	}
	if (status === "resolved") {
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
		console.log("marking this as an error");
		return (
			<ProtectedRoute>
				<p className="text-red-200">Sorry, something went wrong with your request, try reloading the page</p>
			</ProtectedRoute>
		)
	}
}
