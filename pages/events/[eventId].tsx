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

	React.useEffect(() => {
		const fetchData = async () => {
			if (typeof eventId == "string") {
				const docRef = doc(firestore, "events", eventId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data() as EventDataFromFirestore;
					setEventData(data);
				}
			}
		};
		fetchData();
	}, []);

	React.useEffect(() => {
		console.log(eventData);
	}, [eventData]);

	return (
		<ProtectedRoute>
			<Header
				title={eventData?.title ?? undefined}
				screenName="EVENT"
				photoURL={parsedUser?.photoURL ?? undefined}
			/>
			<Container className="pt-4 sm:pt-6">
				<HomeBreadcrumbs currentPage="Event" />
				<h1>Welcome to {"..."}'s Event</h1>
			</Container>
		</ProtectedRoute>
	);
}
