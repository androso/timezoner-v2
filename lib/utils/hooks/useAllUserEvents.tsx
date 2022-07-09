import {
	collection,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	where,
	getDocs,
	DocumentData,
} from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase";
import { getUserEventsData } from "../client-helpers";
import { EventData, RawEventDataFromFirestore, UserData } from "../types";
import useAsync from "./useAsync";
import useParsedUserData from "./useParsedUserData";

type RawDataType =
	| {
			participatingEvents: EventData[];
			lastEventSnapshot: QueryDocumentSnapshot<DocumentData> | undefined;
	  }
	| null
	| undefined;

export const fetchEvents = async (
	run: (promise: Promise<unknown>) => void,
	parsedUser: UserData | null
) => {
	if (!parsedUser) return;
	const eventsQuery = query(
		collection(firestore, "events"),
		where("organizer_id", "==", parsedUser.id),
		orderBy("date_range.start_date"),
		limit(10)
	);
	const eventsSnap = await getDocs(eventsQuery);
	run(getUserEventsData(eventsSnap));
};

const useAllUserEvents = () => {
	// gets all events where this user is in the organizer data or in the participants array
	//!limit is 10
	const { parsedUser } = useParsedUserData();
	const { data, error, reset, run, status, setData} = useAsync({
		participatingEvents: [],
		lastEventSnapshot: undefined
	});
	const rawData = data as RawDataType;
	const allEvents = rawData?.participatingEvents;
	const lastDocSnap = rawData?.lastEventSnapshot;
	
	React.useEffect(() => {
		if (!parsedUser) return;
		fetchEvents(run, parsedUser);
	}, [run, parsedUser]);

	const refetch = React.useCallback(() => fetchEvents(run, parsedUser), [run, parsedUser])

	return {
		allEvents,
		refetch,
		setData,
		lastDocSnap,
		error,
		reset,
		run,
		status,
	};
};

export default useAllUserEvents;
