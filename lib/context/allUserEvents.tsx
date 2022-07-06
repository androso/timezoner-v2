import {
	DocumentData,
	FirestoreError,
	QueryDocumentSnapshot,
} from "firebase/firestore";
import React from "react";
import useAllUserEvents from "../utils/hooks/useAllUserEvents";
import { EventData } from "../utils/types";

type AllUserEventsContextType = {
	status: "loading" | "idle" | "success" | "error";
	error: FirestoreError | null;
	allEvents: EventData[] | null;
	setAllEvents: React.Dispatch<React.SetStateAction<EventData[] | null>>;
	lastDocSnap: QueryDocumentSnapshot | undefined;
	setLastDocSnap: React.Dispatch<
		React.SetStateAction<QueryDocumentSnapshot<DocumentData> | undefined>
	>;
};
const AllUserEventsContext = React.createContext<
	undefined | AllUserEventsContextType
>(undefined);

AllUserEventsContext.displayName = "AllUserEventsContext";

const EventsProvider = ({ children }: { children: any }) => {
	const value = useAllUserEvents();

	return (
		<AllUserEventsContext.Provider value={value}>
			{children}
		</AllUserEventsContext.Provider>
	);
};

const useAllEvents = () => {
	const context = React.useContext(AllUserEventsContext);
	if (context === undefined) {
		throw new Error("useAllEvents must be used within a EventsProvider");
	}
	return context;
};

export { useAllEvents, EventsProvider };
