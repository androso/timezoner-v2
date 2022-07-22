import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import EventFormFields from "../../components/EventFormFields";
import Header from "../../components/Header";
import HomeBreadcrumbs from "../../components/HomeBreadcrumbs";
import { Container } from "../../components/Layouts";
import { LightButton } from "../../components/LightButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import { firestore } from "../../lib/firebase";
import { getDatesBetweenRange, getHoursBetweenRange } from "../../lib/utils/client-helpers";
import useParsedUserData from "../../lib/utils/hooks/useParsedUserData";
import { EventData, EventFormValues } from "../../lib/utils/types";
import { LoadingOverview } from "../../pages/event/[eventId]";

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

	const datesRange = eventData
		? getDatesBetweenRange(
				eventData.date_range.start_date,
				eventData.date_range.end_date
		  )
		: undefined;

	const hoursRange = eventData
		? getHoursBetweenRange(
				eventData.hour_range.start_hour,
				eventData.hour_range.end_hour
		  )
		: undefined;
	const { eventId } = router.query;

	const formMethods = useForm<EventFormValues>({
		defaultValues: {
			title: eventData?.title,
			description: eventData?.description,
			timezone: eventData?.og_timezone,
			hour_range: {
				start_hour: eventData?.hour_range.start_hour,
				end_hour: eventData?.hour_range.end_hour,
			},
			dateRange: [
				eventData?.date_range.start_date,
				eventData?.date_range.end_date,
			],
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
		const { dateRange, hour_range, description, title, timezone } = data;

		if (eventData?.id && parsedUser) {
			const eventDocRef = doc(firestore, "events", eventData?.id);
			const dataSentToFirestore = {
				date_range: {
					start_date: dateRange[0],
					end_date: dateRange[1] ?? dateRange[0],
				},
				hour_range,
				title,
				description: description,
				og_timezone: timezone,
			};
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
			<Container css="pt-4 sm:pt-6 relative mb-72">
				<HomeBreadcrumbs currentPage="Event Overview" />
				<h2>Event availability</h2>
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
						className={`dialog-content bg-[#333] mt-2 absolute ${
							showDialog ? "block" : "hidden"
						} sm:min-w-[460px]`}
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
						style={{ background: "hsla(0, 0%, 0%, 0.5)" }}
					>
						<DialogContent
							aria-label="Delete event warning"
							className="!bg-[#3e4559] text-whiteText1 shadow-md !min-w-fit !sm:w-[50vw] relative"
						>
							<span role="heading" className="text-2xl font-bold">
								Delete Event
							</span>
							<button
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
				{/* //TODO: ADD TABLE HERE */}
			</Container>
		</div>
	);
}