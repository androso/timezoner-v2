import {
	collection,
	FirestoreError,
	getDoc,
	limit,
	orderBy,
	onSnapshot,
	query,
	QueryDocumentSnapshot,
	where,
} from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase";
import { getUserEventsData } from "../client-helpers";
import { EventData, RawEventDataFromFirestore, UserData } from "../types";
import useParsedUserData from "./useParsedUserData";

const useAllUserEvents = () => {
	//TODO: paginate events in batches of 4-5 and order them based on their start date, (the sooner they are, the higher they appear)
	// gets all events where this user is in the organizer data or in the participants array
	const { parsedUser } = useParsedUserData();
	const [allEvents, setAllEvents] = React.useState<EventData[] | null>(null);
	const [status, setStatus] = React.useState<
		"loading" | "idle" | "success" | "error"
	>("idle");
	const [error, setError] = React.useState<null | FirestoreError>(null);
	const [lastDocSnap, setLastDocSnap] = React.useState<QueryDocumentSnapshot>();

	React.useEffect(() => {
		if (!parsedUser) return;
		setStatus("loading");

		const eventsQuery = query(
			collection(firestore, "events"),
			where("organizer_id", "==", parsedUser.id),
			orderBy("date_range.start_date"),
			limit(10)
		);

		let unsubscribe = onSnapshot(eventsQuery, async (eventsSnap) => {
			const { participatingEvents: userEvents, lastEventSnapshot } = await getUserEventsData(
				eventsSnap
			);
			setAllEvents((prevEvents) => {
				if (prevEvents) {
					return [...prevEvents, ...userEvents];
				} else {
					return [...userEvents];
				}
			});
			setLastDocSnap(lastEventSnapshot);
			setStatus("success");
		}, (error => {
			setStatus("error");
			setError(error);
		}));

		return unsubscribe;
	}, []);

	return {
		status,
		error,
		allEvents,
		setAllEvents,
		lastDocSnap,
		setLastDocSnap
	};
};

export default useAllUserEvents;
