import {
	collection,
	DocumentReference,
	FirestoreError,
	getDoc,
	onSnapshot,
	query,
	Timestamp,
} from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase";
import { EventDataFromFirestore, UserData } from "../types";
import useParsedUserData from "./useParsedUserData";

type RawEventDataFromFirestore = {
	date_range: {
		start_date: Timestamp;
		end_date: Timestamp;
	};
	hour_range: {
		start_hour: Timestamp;
		end_hour: Timestamp;
	};
	title: string;
	description: string;
	og_timezone: string;
	organizer_ref: DocumentReference;
};

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
					const rawEventData = eventDoc.data() as RawEventDataFromFirestore;

					const event = {
						...rawEventData,
						date_range: {
							start_date: rawEventData.date_range.start_date.toDate(),
							end_date: rawEventData.date_range.end_date.toDate(),
						},
						hour_range: {
							start_hour: rawEventData.hour_range.start_hour.toDate(),
							end_hour: rawEventData.hour_range.end_hour.toDate(),
						},
					} as EventDataFromFirestore;

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
