import { convertHoursToTimezone, getTimezoneMetadata } from "../client-helpers";

const useHourRangeBasedOnTimezone = (
	hoursRange: Date[] | undefined,
	timezoneSelected: string | null
) => {
	if (!hoursRange || !timezoneSelected) return null;
	const timezoneMetadata = getTimezoneMetadata(timezoneSelected);

	if (timezoneMetadata) {
		const hoursConverted = convertHoursToTimezone(
			hoursRange,
			timezoneMetadata.name
		);
		return hoursConverted;
	} else {
		return null;
	}
};
export default useHourRangeBasedOnTimezone