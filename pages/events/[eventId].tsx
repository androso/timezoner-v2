import React from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Container from "../../components/Layouts/Container";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import { EventDataFromFirestore } from "../../lib/utils/types";
import { useParsedUserData } from "../../lib/utils/hooks";
import type { UserData } from "../../lib/utils/types";

//TODO: transform fetching to useAsync hook
/* We're gonna need
   - Event data
   - User data (avatar)
*/
export default function eventId() {
	const { parsedUser } = useParsedUserData();
	const router = useRouter();
	const { eventId } = router.query;
	const [eventData, setEventData] = React.useState<EventDataFromFirestore>();
	const [organizerData, setOrganizerData] = React.useState<UserData>();

	React.useEffect(() => {
		const fetchData = async () => {
			if (typeof eventId == "string") {
				const docRef = doc(firestore, "events", eventId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data() as EventDataFromFirestore;
					const organizerSnap = await getDoc(data.organizer_ref);
					if (organizerSnap.exists()) {
						setOrganizerData(organizerSnap.data() as UserData);
					}
					setEventData(data);
				}
			}
		};
		fetchData();
	}, []);


	return (
		<ProtectedRoute>
			<Header
				title={eventData?.title ?? undefined}
				screenName="EVENT"
				photoURL={parsedUser?.photoURL ?? undefined}
			/>
			<Container className="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				<h1 className="mb-5">Welcome to {organizerData?.username.split(" ")[0]}'s Event</h1>
				<p>{eventData?.description ?? "..."}</p>
			</Container>
		</ProtectedRoute>
	);
}
