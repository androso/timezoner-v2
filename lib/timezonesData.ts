import { timeZonesNames, getTimeZones } from "@vvo/tzdb";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const userTimezoneDefault = dayjs.tz.guess();
export const timeZones = getTimeZones();


export const defaultTimezone = {
	label: userTimezoneDefault.replace(/_/g, " "),
	value: userTimezoneDefault,
};
export const timezonesOptionsObjects = timeZonesNames.map((tz) => ({
	value: tz,
	label: tz.replace(/_/g, " "),
}));

export const timezonesLabels = timezonesOptionsObjects.map((tz) => tz.label);
