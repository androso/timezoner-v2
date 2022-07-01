import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { firestore } from "../../firebase";
import { EventDataFromFirestore } from "../types";
import { useQuery } from "react-query";

const fetchEventData = async (eventId: string) => {
	/*
	 * fetchData should be returning
	 * a single object with the eventData and organizerData, if succesful
	 * an error if rejected
	 */
	//TODO: add error boundaries for edge-cases
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
	const { status, data, error } = useQuery(["eventData", eventId], async () => {
		if (typeof eventId === "string") {
			const data = await fetchEventData(eventId);
			return data;
		}
	});
	const eventData = data as EventDataFromFirestore | undefined;

	return {
		eventData,
		status,
		error,
	};
};

export default useEventData;
