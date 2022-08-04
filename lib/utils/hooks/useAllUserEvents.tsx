import {
	collection,
	orderBy,
	query,
	where,
	getDocs,
	doc,
} from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase";
import { getUserEventsData } from "../client-helpers";
import { EventData, UserData } from "../types";
import useAsync from "./useAsync";
import useParsedUserData from "./useParsedUserData";

export const fetchEvents = async (
	run: (promise: Promise<unknown>) => void,
	parsedUser: UserData | null
) => {
	if (!parsedUser) return;
	const myEventsQuery = query(
		collection(firestore, "events"),
		where("organizer_id", "==", parsedUser.id),
		orderBy("date_range")
	);
	const userRef = doc(firestore, "users", parsedUser.id);
	const participatingEventsQuery = query(
		collection(firestore, "events"),
		where("participants", "array-contains", userRef),
		orderBy("date_range")
	);
	const myEventsSnap = await getDocs(myEventsQuery);
	const participatingEventsSnap = await getDocs(participatingEventsQuery);
	run(getUserEventsData(participatingEventsSnap, myEventsSnap));
};

const useAllUserEvents = () => {
	// gets all events where this user is in the organizer data or in the participants array
	const { parsedUser } = useParsedUserData();
	const { data, error, reset, run, status, setData } = useAsync();
	const allEvents = data as EventData[];

	React.useEffect(() => {
		if (!parsedUser) return;
		fetchEvents(run, parsedUser);
	}, [run, parsedUser]);

	const refetch = React.useCallback(
		() => fetchEvents(run, parsedUser),
		[run, parsedUser]
	);

	return {
		allEvents,
		refetch,
		setData,
		error,
		reset,
		run,
		status,
	};
};

export default useAllUserEvents;
