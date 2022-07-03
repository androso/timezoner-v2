import {
	collection,
	doc,
	FirestoreError,
	getDoc,
	onSnapshot,
	query,
	QuerySnapshot,
	where,
} from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase";
import { EventDataFromFirestore, UserData } from "../types";
import useParsedUserData from "./useParsedUserData";

const useAllUserEvents = () => {
	// gets all events where this user is in the organizer data or in the participants array
	const { parsedUser } = useParsedUserData();
	const [allEvents, setAllEvents] = React.useState<
		EventDataFromFirestore[] | null
	>(null);
	const [status, setStatus] = React.useState<
		"loading" | "idle" | "success" | "error"
	>("idle");
	const [error, setError] = React.useState<null | FirestoreError>(null);
	
	React.useEffect(() => {
		if (!parsedUser) return;

		setStatus("loading");
		const eventsQuery = query(collection(firestore, "events"));
		let unsubscribe = onSnapshot(
			eventsQuery,
			(eventsSnap) => {
				eventsSnap.forEach((eventDoc) => {
					const event = eventDoc.data() as EventDataFromFirestore;
					// we get the organizer doc to check it they're the organizer
					getDoc(event.organizer_ref).then((organizerSnap) => {
						const organizerData = organizerSnap.data() as UserData;
						if (organizerData.id == parsedUser.id) {
							event.organizer_data = organizerData;
							setAllEvents((prevEvents) => {
								if (prevEvents) {
									return [...prevEvents, event];
								} else {
									return [event];
								}
							});
							setStatus("success");
						}
					});
				});
			},
			(error) => {
				setStatus("error");
				setError(error);
			}
		);

		return unsubscribe;
	}, []);
	return {
		status,
		error,
		allEvents,
	};
};

export default useAllUserEvents;
