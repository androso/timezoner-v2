import React from "react";
import { EventData } from "../lib/utils/types";
type PropsTypes = {
	hoursRange: Date[] | undefined | null;
	datesRange: Date[] | undefined;
	eventData: EventData;
};
export default function EventAvailabilityTable({
	eventData,
	hoursRange,
	datesRange,
}: PropsTypes) {
	return <div>EventAvailabilityTable</div>;
}
