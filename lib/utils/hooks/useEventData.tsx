import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { firestore } from "../../firebase";
import { EventData, UserData } from "../types";
import { useQuery } from "react-query";

const fetchEventData = async (
	eventId: string
): Promise<EventData | undefined> => {
	/*
	 * fetchData should be returning
	 * a single object with the eventData and organizerData, if succesful
	 * an error if rejected
	 */
	const docRef = doc(firestore, "events", eventId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const eventData = docSnap.data() as EventData;
		const organizerSnap = await getDoc(eventData.organizer_ref);
		if (organizerSnap.exists()) {
			const organizerData = organizerSnap.data() as UserData;
			return {
				...eventData,
				organizer_data: organizerData,
			};
		} else {
			return Promise.reject(new Error("Document is corrupt :( no valid Organizer Data"))
		}
	} else {
		return Promise.reject(new Error("Event not found :("));
	}
};

const useEventData = () => {
	const router = useRouter();
	const { eventId } = router.query;

	const { status, data, error } = useQuery(
		["eventData", eventId],
		async () => {
			if (typeof eventId === "string") {
				const data = await fetchEventData(eventId);
				return data;
			}
		},
		{
			refetchOnWindowFocus: false,
		}
	);
	const eventData = data as EventData | undefined;

	return {
		eventData,
		status,
		error,
	};
};

export default useEventData;
