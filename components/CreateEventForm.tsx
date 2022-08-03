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
	getFormattedFormData,
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
		const { date, hours_range, description, title, timezone } = data;
		if (parsedUser) {
			const eventDocRef = doc(collection(firestore, "events"));
			const hoursBetweenRange = getHoursBetweenRange(
				hours_range.start_hour,
				hours_range.end_hour
			);
			const timezoneSelectedMeta = getTimezoneMetadata(timezone) as TimeZone;
			const localTimezoneMeta = timeZones.find(
				(tz) =>
					defaultTimezone.value === tz.name ||
					tz.group.includes(defaultTimezone.value)
			) as TimeZone;

			const totalOffsetInMinutes =
				timezoneSelectedMeta?.currentTimeOffsetInMinutes -
				localTimezoneMeta?.currentTimeOffsetInMinutes;

			const hoursConvertedToLocal = hoursBetweenRange.map((hour) => {
				// convert first to aug 1 then jul 31
				const formDate = date;
				const newHour = new Date(
					`${
						formDate.getMonth() + 1
					}/${formDate.getDate()}/${formDate.getFullYear()} ${hour.getHours()}:${hour.getMinutes()}`
				);
				newHour.setMinutes(hour.getMinutes() - totalOffsetInMinutes);
				return newHour;
			});
			const dataSentToFirestore = getFormattedFormData(
				{
					...data,
					hours_range: {
						start_hour: hoursConvertedToLocal[0],
						end_hour: hoursConvertedToLocal[hoursConvertedToLocal.length - 1],
					},
				},
				parsedUser.id,
				eventDocRef.id
			);

			await setDoc(eventDocRef, dataSentToFirestore);
			router.push(`/event/${eventDocRef.id}`, undefined, { shallow: true });
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
