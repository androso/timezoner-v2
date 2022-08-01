import type {
	EventFormValues,
	RawEventDataFromFirestore,
} from "../lib/utils/types";
import { LightButton } from "./LightButton";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { useRouter } from "next/router";
import useParsedUserData from "../lib/utils/hooks/useParsedUserData";
import EventFormFields from "./EventFormFields";
import React from "react";
import {
	getDatesBetweenRange,
	getHoursBetweenRange,
	getTimezoneMetadata,
	standardizeHours,
} from "../lib/utils/client-helpers";
import useHourRangeBasedOnTimezone from "../lib/utils/hooks/useHourRangeBasedOnTimezone";
import { defaultTimezone } from "../lib/timezonesData";
import { timeZones } from "../lib/timezonesData";
import { TimeZone } from "@vvo/tzdb";

export default function CreateEventForm() {
	const formMethods = useForm<EventFormValues>();
	const { parsedUser } = useParsedUserData();
	const router = useRouter();
	const submitForm: SubmitHandler<EventFormValues> = async (data) => {
		const { dateRange, hours_range, description, title, timezone } = data;

		if (parsedUser) {
			const eventDocRef = doc(collection(firestore, "events"));
			const hoursBetweenRange = getHoursBetweenRange(
				hours_range.start_hour,
				hours_range.end_hour
			);

			//todo convert hours_range depending on the timezone selected to host timezone, then to utc
			//todo if host is el salvador and timezone selected Istanbul, then convert hours selected to El Salvador, then to utc
			// i could get the host timezone and the timezone selected
			const timezoneSelectedMeta = getTimezoneMetadata(timezone) as TimeZone;
			const localTimezoneMeta = timeZones.find(
				(tz) =>
					defaultTimezone.value === tz.name ||
					tz.group.includes(defaultTimezone.value)
			) as TimeZone;

			const totalOffsetInMinutes =
				timezoneSelectedMeta?.currentTimeOffsetInMinutes -
				localTimezoneMeta?.currentTimeOffsetInMinutes;

			const hoursConvertedToLocal = hoursBetweenRange.map(
				(hour) =>
					new Date(hour.setMinutes(hour.getMinutes() - totalOffsetInMinutes))
			);

			const utcHourRange = standardizeHours(hoursConvertedToLocal);
			if (dateRange[0]) {
				// the hours object have the right date in them, so we get the date from them
				const utcDateRange = utcHourRange
					.map((utcHour) => {
						const localHour = new Date(utcHour);
						return `${
							localHour.getUTCMonth() + 1
						}/${localHour.getUTCDate()}/${localHour.getUTCFullYear()}`;
					})
					.filter((utcDate, index, self) => self.indexOf(utcDate) === index);
				const dataSentToFirestore = {
					date_range: utcDateRange,
					hours_range: utcHourRange,
					title,
					description: description,
					og_timezone: timezone,
					organizer_ref: doc(firestore, "users", parsedUser.id),
					organizer_id: parsedUser.id,
					id: eventDocRef.id,
					participants: [],
					participants_schedules: utcDateRange.map((utcDate) => ({
						date: utcDate,
						hours_range: utcHourRange
							.map((utcHour) => {
								// console.log(hourObj);
								return {
									hour: utcHour,
									participants: [],
									tableElementIndex: null,
								};
							})
							.filter((item) => {
								const currentDate = new Date(utcDate);
								// console.log(currentDate);
								const localHour = new Date(item.hour);
								return localHour.getUTCDate() === currentDate.getUTCDate();
							}),
					})),
				};
				await setDoc(eventDocRef, dataSentToFirestore);
				router.push(`/event/${eventDocRef.id}`, undefined, { shallow: true });
			}
		}
	};

	return (
		<FormProvider {...formMethods}>
			<form
				onSubmit={formMethods.handleSubmit(submitForm)}
				className="py-6 px-6 bg-gradient-to-b from-softBlackTransparent to-softBlackTransparent mx-auto rounded-md max-w-lg"
				autoComplete="off"
			>
				<h2 className=" font-semibold text-2xl mb-1">Create Event</h2>
				<p className="font-medium text-shadowWhite mb-3">
					You'll be able to invite your friends later
				</p>
				<hr className="bg-[#666666] border-none h-[1px] rounded-sm mb-5" />
				<EventFormFields formMethods={formMethods} />
				<div className="w-full text-center">
					<LightButton
						innerText="CREATE EVENT"
						css="mx-auto"
						btnType="submit"
					/>
				</div>
			</form>
		</FormProvider>
	);
}
