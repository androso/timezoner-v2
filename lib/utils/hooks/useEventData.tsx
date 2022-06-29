import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../../context";
import { firestore } from "../../firebase";
import { EventDataFromFirestore } from "../types";
import useAsync from "./useAsync";

const fetchEventData = async (eventId: string) => {
	/*
	 * fetchData should be returning
	 * a single object with the eventData and organizerData, if succesful
	 * an error if rejected
	 */
	const docRef = doc(firestore, "events", eventId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const eventData = docSnap.data() as EventDataFromFirestore;
		const organizerSnap = await getDoc(eventData.organizer_ref);
		if (organizerSnap.exists()) {
			console.log("fetching event data !");
			return {
				...eventData,
				organizer_data: organizerSnap.data(),
			};
		}
	}
};

const useEventData = () => {
	const router = useRouter();
	const { eventId } = router.query;
	const { status, data, run, error, reset } = useAsync();
	const eventData = data as EventDataFromFirestore | null;
	const { user } = useAuth();

	React.useEffect(() => {
		if (!eventId || !user) return;

		if (typeof eventId === "string") {
			run(fetchEventData(eventId));
			
		}
	}, [eventId, user]);

	return {
		eventData,
		status,
		error,
	};
};

export default useEventData;
