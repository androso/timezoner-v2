import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { firestore } from "../../firebase";
import { EventData, RawEventDataFromFirestore, UserData } from "../types";
import { useQuery } from "react-query";
import { useAllEvents } from "../../context/allUserEvents";
import useParsedUserData from "./useParsedUserData";
import { formatRawEventData } from "../client-helpers";

const fetchEventData = async (
	eventId: string
): Promise<RawEventDataFromFirestore> => {
	/*
	 * fetchData should be returning
	 * a single object with the eventData and organizerData, if succesful
	 * an error if rejected
	 */
	const docRef = doc(firestore, "events", eventId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const rawEventData = docSnap.data() as RawEventDataFromFirestore;
		return rawEventData;
	} else {
		return Promise.reject(new Error("Event not found :("));
	}
};

const useEventData = () => {
	const router = useRouter();
	const { eventId } = router.query;
	const { allEvents, status: allEventsStatus } = useAllEvents();
	const { parsedUser } = useParsedUserData();
	const { status, data, error } = useQuery(
		["eventData", eventId, allEvents, parsedUser, allEventsStatus],
		async () => {
			//! We should fetch only if the user is authenticated AND authorized
			if (!router.isReady) {
				return;
			}
			if (allEventsStatus === "loading" || allEventsStatus === "idle") {
				return;
			}
			if (typeof eventId === "string") {
				let eventAlreadyFetched = allEvents?.find(
					(event) => event.id === eventId
				);
				if (eventAlreadyFetched) {
					// console.log("this event was found in the allUsers array");
					return eventAlreadyFetched;
				} else if (parsedUser) {
					// console.log(
					// 	"this event wasn't found in the allUsers array, and thus had to be fetched individually"
					// );
					try {
						const rawData = await fetchEventData(eventId);
						const formattedEvent = await formatRawEventData(rawData);
						return formattedEvent;
					} catch (e) {
						return e;
					}
				} else {
					// console.log("we're not fetching bc we're not authenticated");
					return new Error("unauthenticated request");
				}
				// console.log("what is this weird edge-case?")
			} else {
				return new Error("event id is not valid");
				// console.log("typeof eventId is not string", eventId);
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
