import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import EventAvailabilityTable from "../../components/EventAvailabilityTable";
import EventFormFields from "../../components/EventFormFields";
import Header from "../../components/Header";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import Container from "../../components/Layouts/Container";
import { LightButton } from "../../components/LightButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import { firestore } from "../../lib/firebase";
import {
	getFormattedFormData,
	getHoursBetweenRange,
	getTimezoneMetadata,
	standardizeHours,
	useEventDataBasedOnTimezone,
} from "../../lib/utils/client-helpers";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import { EventData, EventFormValues } from "../../lib/utils/types";
import { LoadingOverview } from "../../pages/event/[eventId]";
import {
	defaultTimezone,
	defaultTimezone as localTimezone,
	timeZones,
} from "../../lib/timezonesData";
import { TimeZone } from "@vvo/tzdb";

export default function OrganizerOverview({
	eventData,
}: {
	eventData: EventData | undefined;
}) {
	const { parsedUser } = useParsedUserData();
	const router = useRouter();
	const [showDialog, setShowDialog] = React.useState(false);
	const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);
	const closeDialog = () => setShowDialog(false);
	const toggleDialog = () => setShowDialog((prevValue) => !prevValue);

	const [timezoneSelected, setTimezoneSelected] = React.useState<string | null>(
		localTimezone.label
	);
	const convertedEventData = useEventDataBasedOnTimezone(
		eventData,
		eventData?.og_timezone.replace(" ", "_")
	);
	const datesRange = convertedEventData?.date_range;
	const convertedHours = convertedEventData?.hours_range;
	const { eventId } = router.query;

	const formMethods = useForm<EventFormValues>({
		defaultValues: {
			title: eventData?.title,
			description: eventData?.description,
			timezone: convertedEventData?.og_timezone,
			hours_range: {
				start_hour: convertedEventData?.hours_range[0],
				end_hour:
					convertedEventData?.hours_range[
						convertedEventData.hours_range.length - 1
					],
			},
			date: convertedEventData?.date_range[0],
		},
	});

	const deleteEvent = async () => {
		if (typeof eventId != "string") return;
		try {
			await deleteDoc(doc(firestore, "events", eventId));
			router.push("/dashboard", undefined, { shallow: true });
		} catch (e) {
			toast.error("There was an error deleting the event");
		}
	};

	const updateEvent = async (data: EventFormValues) => {
		const { date, hours_range, description, title, timezone } = data;
		const hoursBetweenRange = getHoursBetweenRange(
			hours_range.start_hour,
			hours_range.end_hour
		);
		const utcHoursRange = standardizeHours(hoursBetweenRange);
		if (eventData?.id && parsedUser && date) {
			const eventDocRef = doc(firestore, "events", eventData?.id);
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
			let dataSentToFirestore = getFormattedFormData(
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

			const timezonesAreNotTheSame =
				data.timezone !== convertedEventData?.og_timezone;
			const dateIsNotTheSame = !convertedEventData?.date_range.find(
				(date) => date.toUTCString() === data.date.toUTCString()
			)
				? true
				: false;
			const hoursAreNotTheSame =
				convertedEventData?.hours_range[0].toUTCString() !==
					data.hours_range.start_hour.toUTCString() ||
				convertedEventData.hours_range[
					convertedEventData.hours_range.length - 1
				].toUTCString() !== data.hours_range.end_hour.toUTCString();

			if (timezonesAreNotTheSame || dateIsNotTheSame || hoursAreNotTheSame) {
				if (
					!confirm(
						"This will reset this event's participants, are you sure to continue?"
					)
				) {
					return;
				}
			} else {
				// formatting participants_schedules to database format
				dataSentToFirestore.participants = convertedEventData?.participants;
				dataSentToFirestore.participants_schedules =
					convertedEventData.participants_schedules.map((schedule) => {
						const utcDate = `${schedule.date.getUTCMonth()}/${schedule.date.getUTCDate()}/${schedule.date.getUTCFullYear()}`; // ie: mm/dd/yy
						return {
							date: utcDate,
							hours_range: schedule.hours_range.map((hourObj, i) => {
								return {
									...hourObj,
									hour: hoursConvertedToLocal[i].toUTCString(),
								};
							}),
						};
					});
			}
			try {
				await setDoc(eventDocRef, dataSentToFirestore, { merge: true });
				closeDialog();
				toast.success("Event updated succesfully");
			} catch (e) {
				toast.error("There was an error while updating the event");
			}
		}
	};

	if (!eventData) {
		return (
			<LoadingOverview>
				<LoadingSpinner />
			</LoadingOverview>
		);
	}

	return (
		<div
			onClick={() => {
				if (showDialog) closeDialog();
			}}
		>
			<Header
				title={eventData.title}
				screenName="EVENT"
				photoURL={eventData.organizer_data.avatar_url}
			/>
			<Container css="pt-4 sm:pt-6 relative">
				<HomeBreadcrumbs currentPage="Event Overview" />
				<h2 className="font-bold text-3xl mt-2 mb-2">Event's availability</h2>
				<div className=" mb-4">
					<button
						className="relative dark-btn-transition bg-gradient-to-t from-darkBtnBottomColor to-darkBtnTopColor py-2 px-5 rounded-md text-sm font-bold before:rounded-md flex "
						onClick={toggleDialog}
					>
						<FontAwesomeIcon icon={faGear} className="w-5 h-5 mr-2" />
						Settings
					</button>

					<div
						id="dialog"
						onClick={(event) => event.stopPropagation()}
						className={`dialog-content mt-2 absolute ${
							showDialog ? "block" : "hidden"
						} sm:min-w-[460px] bg-[#333] z-10`}
					>
						{/* Update event form */}
						<FormProvider {...formMethods}>
							<form
								onSubmit={formMethods.handleSubmit(updateEvent)}
								className="py-6 px-6 bg-gradient-to-b from-softBlackTransparent to-softBlackTransparent mx-auto rounded-md max-w-lg relative"
								autoComplete="off"
							>
								<h2 className=" font-semibold text-2xl mb-1">
									Event's settings
								</h2>
								<p className="font-medium text-shadowWhite mb-3">
									Update the details of your event here
								</p>
								<button
									className="h-7 absolute top-0 right-0 mr-5 mt-6"
									onClick={closeDialog}
									type="button"
									title="close"
								>
									<FontAwesomeIcon icon={faXmark} className="h-full" />
								</button>
								<EventFormFields
									formMethods={formMethods}
									defaultTimezone={eventData.og_timezone}
								/>
								<div className="flex flex-col w-2/3 mx-auto">
									<LightButton
										innerText="UPDATE EVENT"
										btnType="submit"
										css={"mb-3"}
									/>
									<button
										type="button"
										onClick={() => setShowDeleteWarning(true)}
										className={`bg-gray-300 relative text-darkText font-semibold rounded-md px-6 py-3 hover:bg-red-500 focus:bg-red-600 hover:text-whiteText1 transition-colors`}
									>
										DELETE EVENT
									</button>
								</div>
							</form>
						</FormProvider>
					</div>
					<DialogOverlay
						isOpen={showDeleteWarning}
						onDismiss={() => {
							setShowDeleteWarning(false);
							closeDialog();
						}}
						className="z-20"
						style={{ background: "hsla(0, 0%, 0%, 0.5)" }}
					>
						<DialogContent
							aria-label="Delete event warning"
							className="!bg-[#3e4559] text-whiteText1 shadow-md !min-w-fit !sm:w-[50vw] relative"
						>
							<span className="text-2xl font-bold">Delete Event</span>
							<button
								title="Close"
								className="h-7 absolute top-0 right-0 mr-5 mt-6"
								onClick={() => {
									setShowDeleteWarning(false);
									setShowDialog(false);
								}}
							>
								<FontAwesomeIcon icon={faXmark} className="h-full" />
							</button>
							<p className="mb-4">
								Are you sure you want to delete this event? this action can't be
								undone
							</p>
							<div className="flex justify-end">
								<button className="px-3 py-1 bg-slate-500 rounded-md text-lg mr-2 transition-all border-2 border-transparent hover:border-whiteText1">
									Cancel
								</button>
								<button
									onClick={() => deleteEvent()}
									className="px-3 py-1 text-lg bg-red-500 rounded-md transition-all border-2 border-transparent hover:border-whiteText1"
								>
									Delete Event
								</button>
							</div>
						</DialogContent>
					</DialogOverlay>
				</div>

				<EventAvailabilityTable
					eventData={convertedEventData}
					datesRange={datesRange}
					hoursRange={convertedHours}
				/>
				<p className="mt-4 font-medium text-shadowWhite max-w-[190px] text-center m-auto">
					Note: Click on an hour to see availability
				</p>
			</Container>
		</div>
	);
}
