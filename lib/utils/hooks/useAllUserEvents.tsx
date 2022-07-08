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
	// gets all events where this user is in the organizer data or in the participants array
	//!limit is 10
	const { parsedUser } = useParsedUserData();
	const [allEvents, setAllEvents] = React.useState<EventData[] | null>(null);
	const [status, setStatus] = React.useState<
		"loading" | "idle" | "success" | "error"
	>("idle");
	const [error, setError] = React.useState<null | FirestoreError>(null);
	const [lastDocSnap, setLastDocSnap] = React.useState<QueryDocumentSnapshot>();

	React.useEffect(() => {
		if (!parsedUser || status === "success") return;
	
		setStatus("loading");
		
		const eventsQuery = query(
			collection(firestore, "events"),
			where("organizer_id", "==", parsedUser.id),
			orderBy("date_range.start_date"),
			limit(10)
		);
		// !why use a onSnapshot if we only access this data once and limit it to 10? refactor (?)
		let unsubscribe = onSnapshot(
			eventsQuery,
			async (eventsSnap) => {
				//! The error is happening in this call.
				const { participatingEvents: userEvents, lastEventSnapshot } =
					await getUserEventsData(eventsSnap);
				// console.log(userEvents);
				//! If we trigger a state here, it will trigger a re-render of this. 
				//! we need to find a way to avoid fetching this whole thing after we had done it once (?)

				setAllEvents((prevEvents) => {
					if (prevEvents) {
						return [...prevEvents, ...userEvents];
					} else {
						return [...userEvents];
					}
				});
				setLastDocSnap(lastEventSnapshot);
				setStatus("success");
			},
			(error) => {
				setStatus("error");
				setError(error);
			}
		);

		return unsubscribe;
	}, [parsedUser]);
	console.log("re-rendering");

	return {
		status,
		error,
		allEvents,
		setAllEvents,
		lastDocSnap,
		setLastDocSnap,
	};
};

export default useAllUserEvents;
