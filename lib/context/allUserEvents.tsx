import React from "react";
import useAllUserEvents from "../utils/hooks/useAllUserEvents";
import { StatusTypes } from "../utils/hooks/useAsync";
import { EventData } from "../utils/types";

type AllUserEventsContextType = {
	allEvents: EventData[] | undefined;
	error: Error | null;
	reset: () => void;
	run: (promise: Promise<unknown>) => void;
	status: StatusTypes;
	refetch: () => Promise<void>;
	setData: (data: unknown) => void;
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
